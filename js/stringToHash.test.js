/**
 * Unit tests for String to Hash module
 */

import { generateHash } from './stringToHash.js';
import { md5 } from './md5wasm.js';

// Test runner
const runTests = async () => {
    const tests = [
        testGenerateHashMD5,
        testGenerateHashSHA1,
        testGenerateHashSHA256,
        testGenerateHashSHA512,
        testGenerateHashSHA3,
        testGenerateHashInvalidAlgorithm
    ];
    
    let passedTests = 0;
    let failedTests = 0;
    
    console.log('Running String to Hash tests...\n');
    
    for (const test of tests) {
        try {
            // All tests are async
            await test();
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

// Test cases
async function testGenerateHashMD5() {
    // Test MD5 hash generation
    const testCases = [
        { input: '', expected: 'd41d8cd98f00b204e9800998ecf8427e' },
        { input: 'a', expected: '0cc175b9c0f1b6a831c399e269772661' },
        { input: 'abc', expected: '900150983cd24fb0d6963f7d28e17f72' }
    ];
    
    for (const { input, expected } of testCases) {
        const result = await generateHash(input, 'md5');
        
        if (result !== expected) {
            throw new Error(`generateHash("${input}", "md5") returned "${result}" but expected "${expected}"`);
        }
        
        // Verify that it matches the direct md5 function
        const directResult = md5(input);
        if (result !== directResult) {
            throw new Error(`generateHash result "${result}" doesn't match direct md5 result "${directResult}"`);
        }
    }
}

async function testGenerateHashSHA1() {
    // Test SHA-1 hash generation
    // Known SHA-1 hashes for test inputs
    const testCases = [
        { input: '', expected: 'da39a3ee5e6b4b0d3255bfef95601890afd80709' },
        { input: 'a', expected: '86f7e437faa5a7fce15d1ddcb9eaeaea377667b8' },
        { input: 'abc', expected: 'a9993e364706816aba3e25717850c26c9cd0d89d' }
    ];
    
    for (const { input, expected } of testCases) {
        const result = await generateHash(input, 'sha1');
        
        if (result !== expected) {
            throw new Error(`generateHash("${input}", "sha1") returned "${result}" but expected "${expected}"`);
        }
    }
}

async function testGenerateHashSHA256() {
    // Test SHA-256 hash generation
    // Known SHA-256 hashes for test inputs
    const testCases = [
        { input: '', expected: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
        { input: 'a', expected: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb' },
        { input: 'abc', expected: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad' }
    ];
    
    for (const { input, expected } of testCases) {
        const result = await generateHash(input, 'sha256');
        
        if (result !== expected) {
            throw new Error(`generateHash("${input}", "sha256") returned "${result}" but expected "${expected}"`);
        }
    }
}

async function testGenerateHashSHA512() {
    // Test SHA-512 hash generation
    // Known SHA-512 hashes for test inputs
    const testCases = [
        { 
            input: '', 
            expected: 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e' 
        },
        { 
            input: 'a', 
            expected: '1f40fc92da241694750979ee6cf582f2d5d7d28e18335de05abc54d0560e0f5302860c652bf08d560252aa5e74210546f369fbbbce8c12cfc7957b2652fe9a75' 
        }
    ];
    
    for (const { input, expected } of testCases) {
        const result = await generateHash(input, 'sha512');
        
        if (result !== expected) {
            throw new Error(`generateHash("${input}", "sha512") returned "${result}" but expected "${expected}"`);
        }
    }
}

async function testGenerateHashSHA3() {
    // Test SHA-3 hash generation (actually SHA-384 in the implementation)
    // Known SHA-384 hashes for test inputs
    const testCases = [
        { 
            input: '', 
            expected: '38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95b' 
        },
        { 
            input: 'a', 
            expected: '54a59b9f22b0b80880d8427e548b7c23abd873486e1f035dce9cd697e85175033caa88e6d57bc35efae0b5afd3145f31' 
        }
    ];
    
    for (const { input, expected } of testCases) {
        const result = await generateHash(input, 'sha3');
        
        if (result !== expected) {
            throw new Error(`generateHash("${input}", "sha3") returned "${result}" but expected "${expected}"`);
        }
    }
}

async function testGenerateHashInvalidAlgorithm() {
    // Test error handling for invalid algorithm
    try {
        await generateHash('test', 'invalid-algorithm');
        throw new Error('Expected error for invalid algorithm but none was thrown');
    } catch (error) {
        if (!error.message.includes('Unsupported hash algorithm')) {
            throw new Error(`Expected error message about unsupported algorithm but got: ${error.message}`);
        }
    }
}

// Run tests when this file is loaded
runTests().catch(console.error);
