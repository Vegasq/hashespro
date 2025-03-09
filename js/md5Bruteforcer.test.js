/**
 * Unit tests for MD5 Bruteforcer
 * Now using the Node.js crypto module implementation for MD5
 */

import { bruteforceHash } from './md5Bruteforcer.js';
import { md5crypto as md5 } from './md5crypto.js';

// Test runner
const runTests = async () => {
    const tests = [
        testBruteforceSimple,
        testBruteforceWithLength
    ];
    
    let passedTests = 0;
    let failedTests = 0;
    
    console.log('Running MD5 Bruteforcer tests...\n');
    
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
async function testBruteforceSimple() {
    // Test with simple single-character passwords
    // These should be quick to bruteforce
    const testCases = [
        { input: 'a', hash: md5('a'), minLength: 1, maxLength: 1 },
        { input: 'b', hash: md5('b'), minLength: 1, maxLength: 1 },
        { input: 'Z', hash: md5('Z'), minLength: 1, maxLength: 1 }
    ];
    
    for (const { input, hash, minLength, maxLength } of testCases) {
        const result = await bruteforceHash(hash, minLength, maxLength);
        
        if (result !== input) {
            throw new Error(`bruteforceHash for "${hash}" returned "${result}" but expected "${input}"`);
        }
    }
}

async function testBruteforceWithLength() {
    // Test with passwords of different lengths
    // Using very short passwords to keep tests fast
    const testCases = [
        { input: 'ab', hash: md5('ab'), minLength: 2, maxLength: 2 },
        { input: '123', hash: md5('123'), minLength: 3, maxLength: 3 }
    ];
    
    for (const { input, hash, minLength, maxLength } of testCases) {
        const result = await bruteforceHash(hash, minLength, maxLength);
        
        if (result !== input) {
            throw new Error(`bruteforceHash for "${hash}" returned "${result}" but expected "${input}"`);
        }
    }
}

// Mock progress callback for testing
function mockProgressCallback(progress) {
    // Just a placeholder for testing
    console.log(`Bruteforce progress: ${progress}%`);
}

// Run tests when this file is loaded
runTests().catch(console.error);
