/**
 * Unit tests for MD5 Crypto implementation
 */

import { md5crypto } from './md5crypto.js';

// Test runner
const runTests = () => {
    const tests = [
        testMD5Crypto,
        testMD5CryptoEdgeCases,
        testMD5CryptoErrorHandling
    ];
    
    let passedTests = 0;
    let failedTests = 0;
    
    console.log('Running MD5 Crypto tests...\n');
    
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
function testMD5Crypto() {
    // Test cases with known MD5 hashes
    const testCases = [
        { input: '', expected: 'd41d8cd98f00b204e9800998ecf8427e' },
        { input: 'a', expected: '0cc175b9c0f1b6a831c399e269772661' },
        { input: 'abc', expected: '900150983cd24fb0d6963f7d28e17f72' },
        { input: 'message digest', expected: 'f96b697d7cb7938d525a2f31aaf161d0' },
        { input: 'abcdefghijklmnopqrstuvwxyz', expected: 'c3fcd3d76192e4007dfb496cca67e13b' },
        { input: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', expected: 'd174ab98d277d9f5a5611c2c9f419d9f' },
        { input: '12345678901234567890123456789012345678901234567890123456789012345678901234567890', expected: '57edf4a22be3c955ac49da2e2107b67a' }
    ];
    
    for (const { input, expected } of testCases) {
        const result = md5crypto(input);
        if (result !== expected) {
            throw new Error(`md5crypto("${input}") returned "${result}" but expected "${expected}"`);
        }
    }
}

function testMD5CryptoEdgeCases() {
    // Test with special characters
    const testCases = [
        { input: '!@#$%^&*()', expected: '05b28d17a7b6e7024b6e5d8cc43a8bf7' },
        { input: 'ñáéíóúü', expected: 'e1365a8f10f97caaef16fc28856cfef9' },
        { input: '你好，世界', expected: '009d027013cd7518560784e1d2bf406f' },
        { input: '\0', expected: '93b885adfe0da089cdf634904fd59f71' } // null character
    ];
    
    for (const { input, expected } of testCases) {
        const result = md5crypto(input);
        if (result !== expected) {
            throw new Error(`md5crypto("${input}") returned "${result}" but expected "${expected}"`);
        }
    }
}

function testMD5CryptoErrorHandling() {
    // Test error handling for invalid inputs
    const errorTests = [
        { fn: () => md5crypto(123), expected: 'Input must be a string' },
        { fn: () => md5crypto(null), expected: 'Input must be a string' },
        { fn: () => md5crypto(undefined), expected: 'Input must be a string' },
        { fn: () => md5crypto({}), expected: 'Input must be a string' },
        { fn: () => md5crypto([]), expected: 'Input must be a string' }
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
