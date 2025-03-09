/**
 * Unit tests for Hash Identifier module
 */

import { identifyHash } from './hashIdentifier.js';

// Test runner
const runTests = () => {
    const tests = [
        testIdentifyHash,
        testIdentifyHashWithEmptyInput,
        testIdentifyHashWithInvalidInput
    ];
    
    let passedTests = 0;
    let failedTests = 0;
    
    console.log('Running Hash Identifier tests...\n');
    
    for (const test of tests) {
        try {
            test();
            console.log(`✅ ${test.name} passed`);
            passedTests++;
        } catch (error) {
            console.error(`❌ ${test.name} failed: ${error.message}`);
            failedTests++;
        }
    }
    
    console.log(`\nTest summary: ${passedTests} passed, ${failedTests} failed`);
    
    return {
        passed: passedTests,
        failed: failedTests
    };
};

// Mock hash types for testing
const mockHashTypes = [
    {
        name: "MD5",
        re: /^[a-f0-9]{32}$/i,
        hashcat: "0",
        john: "raw-md5"
    },
    {
        name: "SHA1",
        re: /^[a-f0-9]{40}$/i,
        hashcat: "100",
        john: "raw-sha1"
    },
    {
        name: "SHA256",
        re: /^[a-f0-9]{64}$/i,
        hashcat: "1400",
        john: "raw-sha256"
    },
    {
        name: "SHA512",
        re: /^[a-f0-9]{128}$/i,
        hashcat: "1700",
        john: "raw-sha512"
    },
    {
        name: "NTLM",
        re: /^[a-f0-9]{32}$/i,
        hashcat: "1000",
        john: "nt"
    }
];

// Test cases
function testIdentifyHash() {
    // Test identification of various hash types
    const testCases = [
        { 
            hash: "5f4dcc3b5aa765d61d8327deb882cf99", // MD5 of "password"
            expectedMatches: 2, // Should match both MD5 and NTLM patterns
            expectedTypes: ["MD5", "NTLM"]
        },
        { 
            hash: "5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8", // SHA1 of "password"
            expectedMatches: 1,
            expectedTypes: ["SHA1"]
        },
        { 
            hash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8", // SHA256 of "password"
            expectedMatches: 1,
            expectedTypes: ["SHA256"]
        },
        { 
            hash: "b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86", // SHA512 of "password"
            expectedMatches: 1,
            expectedTypes: ["SHA512"]
        }
    ];
    
    for (const { hash, expectedMatches, expectedTypes } of testCases) {
        const results = identifyHash(mockHashTypes, hash);
        
        // Check number of matches
        if (results.length !== expectedMatches) {
            throw new Error(`identifyHash for "${hash}" returned ${results.length} matches but expected ${expectedMatches}`);
        }
        
        // Check that all expected types are found
        for (const expectedType of expectedTypes) {
            const found = results.some(result => result.hashType.name === expectedType);
            if (!found) {
                throw new Error(`identifyHash for "${hash}" did not identify it as ${expectedType}`);
            }
        }
    }
}

function testIdentifyHashWithEmptyInput() {
    // Test with empty hash string
    const results = identifyHash(mockHashTypes, "");
    
    if (results.length !== 0) {
        throw new Error(`identifyHash for empty string returned ${results.length} matches but expected 0`);
    }
}

function testIdentifyHashWithInvalidInput() {
    // Test with invalid hash strings
    const testCases = [
        "not-a-hash",
        "12345",
        "abcdefg"
    ];
    
    for (const hash of testCases) {
        const results = identifyHash(mockHashTypes, hash);
        
        if (results.length !== 0) {
            throw new Error(`identifyHash for invalid hash "${hash}" returned ${results.length} matches but expected 0`);
        }
    }
}

// Run tests when this file is loaded
runTests();
