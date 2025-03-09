/**
 * Unit tests for MD5 hash functions
 */

import { generateMD5, generateMD5WithSalt, verifyMD5, batchGenerateMD5 } from './md5.js';

// Test runner
const runTests = () => {
    const tests = [
        testGenerateMD5,
        testGenerateMD5WithSalt,
        testVerifyMD5,
        testBatchGenerateMD5,
        testErrorHandling
    ];
    
    let passedTests = 0;
    let failedTests = 0;
    
    console.log('Running MD5 tests...\n');
    
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

// Test cases
function testGenerateMD5() {
    // Test cases with known MD5 hashes
    const testCases = [
        { input: '1', expected: 'c4ca4238a0b923820dcc509a6f75849b' }
    ];
    
    for (const { input, expected } of testCases) {
        const result = generateMD5(input);
        console.log(`Testing generateMD5("${input}"): got "${result}", expected "${expected}"`);
        if (result !== expected) {
            throw new Error(`generateMD5("${input}") returned "${result}" but expected "${expected}"`);
        }
    }
}

function testGenerateMD5WithSalt() {
    // Test with various salts
    const testCases = [
        { input: 'password', salt: 'salt', expected: generateMD5('passwordsalt') },
        { input: 'hello', salt: 'world', expected: generateMD5('helloworld') },
        { input: 'test', salt: '', expected: generateMD5('test') }
    ];
    
    for (const { input, salt, expected } of testCases) {
        const result = generateMD5WithSalt(input, salt);
        if (result !== expected) {
            throw new Error(`generateMD5WithSalt("${input}", "${salt}") returned "${result}" but expected "${expected}"`);
        }
    }
}

function testVerifyMD5() {
    // Test verification of hashes
    const testCases = [
        { input: 'password', hash: '5f4dcc3b5aa765d61d8327deb882cf99', expected: true },
        { input: 'incorrect', hash: '5f4dcc3b5aa765d61d8327deb882cf99', expected: false },
        // Test case insensitivity
        { input: 'abc', hash: '900150983CD24FB0D6963F7D28E17F72', expected: true }
    ];
    
    for (const { input, hash, expected } of testCases) {
        const result = verifyMD5(input, hash);
        if (result !== expected) {
            throw new Error(`verifyMD5("${input}", "${hash}") returned ${result} but expected ${expected}`);
        }
    }
}

function testBatchGenerateMD5() {
    // Test batch processing
    const inputs = ['a', 'b', 'c'];
    const expected = [
        '0cc175b9c0f1b6a831c399e269772661',
        '92eb5ffee6ae2fec3ad71c777531578f',
        '4a8a08f09d37b73795649038408b5f33'
    ];
    
    const results = batchGenerateMD5(inputs);
    
    if (results.length !== expected.length) {
        throw new Error(`batchGenerateMD5 returned ${results.length} results but expected ${expected.length}`);
    }
    
    for (let i = 0; i < expected.length; i++) {
        if (results[i] !== expected[i]) {
            throw new Error(`batchGenerateMD5 result for "${inputs[i]}" was "${results[i]}" but expected "${expected[i]}"`);
        }
    }
}

function testErrorHandling() {
    // Test error handling for invalid inputs
    const errorTests = [
        { fn: () => generateMD5(123), expected: 'Input must be a string' },
        { fn: () => generateMD5WithSalt(123, 'salt'), expected: 'Input and salt must be strings' },
        { fn: () => generateMD5WithSalt('input', 123), expected: 'Input and salt must be strings' },
        { fn: () => verifyMD5(123, 'hash'), expected: 'Input and hash must be strings' },
        { fn: () => verifyMD5('input', 123), expected: 'Input and hash must be strings' },
        { fn: () => batchGenerateMD5('not an array'), expected: 'Inputs must be an array of strings' },
        { fn: () => batchGenerateMD5([1, 2, 3]), expected: 'All inputs must be strings' }
    ];
    
    for (const { fn, expected } of errorTests) {
        try {
            fn();
            throw new Error(`Expected error "${expected}" but no error was thrown`);
        } catch (error) {
            if (error.message !== expected) {
                throw new Error(`Expected error "${expected}" but got "${error.message}"`);
            }
        }
    }
}

// Run tests when this file is loaded
runTests();
