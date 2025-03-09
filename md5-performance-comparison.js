/**
 * MD5 Performance Comparison
 * 
 * This script compares the performance of three MD5 implementations:
 * 1. Pure JavaScript implementation
 * 2. WebAssembly implementation
 * 3. Node.js crypto module implementation
 */

import { md5 } from './js/md5wasm.js';
import { compileWasmModule, md5Wasm } from './js/md5wasm.js';
import { md5crypto } from './js/md5crypto.js';

// Test data generation
function generateTestData() {
    const testSizes = [
        { name: 'Tiny', size: 10 },
        { name: 'Small', size: 100 },
        { name: 'Medium', size: 1000 },
        { name: 'Large', size: 10000 },
        { name: 'Huge', size: 100000 }
    ];
    
    const testData = {};
    
    for (const { name, size } of testSizes) {
        // Generate a string of specified length
        testData[name] = 'a'.repeat(size);
    }
    
    return testData;
}

// Benchmark function
async function runBenchmark(testData) {
    console.log('MD5 Performance Comparison');
    console.log('=========================\n');
    
    // Compile WebAssembly module
    console.log('Compiling WebAssembly module...');
    const wasmModule = await compileWasmModule();
    if (!wasmModule) {
        console.error('Failed to compile WebAssembly module. Skipping WebAssembly tests.');
    } else {
        console.log('WebAssembly module compiled successfully.\n');
    }
    
    // Results table header
    console.log('| Input Size | JS Implementation | WebAssembly | Node.js crypto |');
    console.log('|------------|-------------------|-------------|----------------|');
    
    // Run tests for each input size
    for (const [name, input] of Object.entries(testData)) {
        // Warm-up runs
        md5(input);
        if (wasmModule) md5Wasm(wasmModule.instance, wasmModule.memory, input);
        try {
            md5crypto(input);
        } catch (error) {
            console.error(`Node.js crypto module not available: ${error.message}`);
        }
        
        // Benchmark JS implementation
        const jsStart = performance.now();
        const iterations = 1000;
        for (let i = 0; i < iterations; i++) {
            md5(input);
        }
        const jsEnd = performance.now();
        const jsTime = (jsEnd - jsStart) / iterations;
        
        // Benchmark WebAssembly implementation
        let wasmTime = 'N/A';
        if (wasmModule) {
            const wasmStart = performance.now();
            for (let i = 0; i < iterations; i++) {
                md5Wasm(wasmModule.instance, wasmModule.memory, input);
            }
            const wasmEnd = performance.now();
            wasmTime = (wasmEnd - wasmStart) / iterations;
        }
        
        // Benchmark Node.js crypto implementation
        let cryptoTime = 'N/A';
        try {
            const cryptoStart = performance.now();
            for (let i = 0; i < iterations; i++) {
                md5crypto(input);
            }
            const cryptoEnd = performance.now();
            cryptoTime = (cryptoEnd - cryptoStart) / iterations;
        } catch (error) {
            // Skip if crypto module is not available
        }
        
        // Format results
        const formatTime = (time) => {
            if (time === 'N/A') return 'N/A';
            return `${time.toFixed(4)} ms`;
        };
        
        // Print results
        console.log(`| ${name.padEnd(10)} | ${formatTime(jsTime).padEnd(17)} | ${formatTime(wasmTime).padEnd(11)} | ${formatTime(cryptoTime).padEnd(14)} |`);
    }
    
    console.log('\nNotes:');
    console.log('- Each test was run 1000 times and the average time is reported');
    console.log('- Lower times are better');
    console.log('- "N/A" indicates that the implementation was not available');
    console.log('- The WebAssembly implementation may show "N/A" if compilation failed');
    console.log('- The Node.js crypto implementation may show "N/A" if running in a browser environment');
}

// Run the benchmark
const testData = generateTestData();
runBenchmark(testData).catch(console.error);
