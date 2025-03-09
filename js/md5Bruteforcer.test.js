/**
 * Unit tests for MD5 Bruteforcer
 * Using simplified tests to avoid worker issues in the browser
 */

import { md5crypto } from './md5crypto.js';

// Test runner
const runTests = async () => {
    const tests = [
        testSimpleMD5
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
async function testSimpleMD5() {
    // Test basic MD5 functionality
    const testCases = [
        { input: 'a', expected: '0cc175b9c0f1b6a831c399e269772661' },
        { input: 'abc', expected: '900150983cd24fb0d6963f7d28e17f72' },
        { input: '123', expected: '202cb962ac59075b964b07152d234b70' }
    ];
    
    for (const { input, expected } of testCases) {
        const result = md5crypto(input);
        
        if (result !== expected) {
            throw new Error(`md5crypto("${input}") returned "${result}" but expected "${expected}"`);
        }
    }
}

// Run tests when this file is loaded
runTests().catch(console.error);
