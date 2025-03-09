/**
 * Unit tests for MD5 WebAssembly implementation
 */

import { md5, compileWasmModule, md5Wasm, bruteforceWasm } from './md5wasm.js';

// Test runner
const runTests = async () => {
    const tests = [
        testMD5Function,
        testCompileWasmModule,
        testMD5Wasm,
        testBruteforceWasm
    ];
    
    let passedTests = 0;
    let failedTests = 0;
    
    console.log('Running MD5 WebAssembly tests...\n');
    
    for (const test of tests) {
        try {
            // Some tests may be async
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
function testMD5Function() {
    // Test cases with known MD5 hashes
    const testCases = [
        { input: '1', expected: 'c4ca4238a0b923820dcc509a6f75849b' }
    ];
    
    for (const { input, expected } of testCases) {
        const result = md5(input);
        if (result !== expected) {
            throw new Error(`md5("${input}") returned "${result}" but expected "${expected}"`);
        }
    }
}

async function testCompileWasmModule() {
    // Test that the WebAssembly module can be compiled
    const wasmModule = await compileWasmModule();
    
    if (!wasmModule) {
        throw new Error('Failed to compile WebAssembly module');
    }
    
    if (!wasmModule.instance || !wasmModule.memory) {
        throw new Error('WebAssembly module missing instance or memory');
    }
    
    if (!wasmModule.instance.exports.md5 || !wasmModule.instance.exports.bruteforce) {
        throw new Error('WebAssembly module missing required exports');
    }
}

async function testMD5Wasm() {
    // Test MD5 calculation using WebAssembly
    const wasmModule = await compileWasmModule();
    
    if (!wasmModule) {
        throw new Error('Failed to compile WebAssembly module for MD5Wasm test');
    }
    
    const testCases = [
        { input: '1', expected: 'c4ca4238a0b923820dcc509a6f75849b' }
    ];
    
    for (const { input, expected } of testCases) {
        const result = md5Wasm(wasmModule.instance, wasmModule.memory, input);
        if (result !== expected) {
            throw new Error(`md5Wasm("${input}") returned "${result}" but expected "${expected}"`);
        }
    }
}

async function testBruteforceWasm() {
    // Test bruteforce functionality
    const wasmModule = await compileWasmModule();
    
    if (!wasmModule) {
        throw new Error('Failed to compile WebAssembly module for bruteforceWasm test');
    }
    
    const testCases = [
        // Simple test cases with short strings and limited charset
        { 
            hash: '0cc175b9c0f1b6a831c399e269772661', // MD5 of 'a'
            charset: 'abcdefghijklmnopqrstuvwxyz',
            minLength: 1,
            maxLength: 1,
            expected: 'a'
        },
        { 
            hash: '92eb5ffee6ae2fec3ad71c777531578f', // MD5 of 'b'
            charset: 'abcdefghijklmnopqrstuvwxyz',
            minLength: 1,
            maxLength: 1,
            expected: 'b'
        }
    ];
    
    for (const { hash, charset, minLength, maxLength, expected } of testCases) {
        const result = bruteforceWasm(
            wasmModule.instance,
            wasmModule.memory,
            hash,
            charset,
            minLength,
            maxLength
        );
        
        if (result !== expected) {
            throw new Error(`bruteforceWasm for hash "${hash}" returned "${result}" but expected "${expected}"`);
        }
    }
}

// Run tests when this file is loaded
runTests().catch(console.error);
