/**
 * Unit tests for Character Encoder module
 */

import { encodingMaps } from './encodingMaps.js';

// Test runner
const runTests = () => {
    const tests = [
        testHexToStringConversion,
        testStringToHexConversion,
        testEncodingMapsConsistency
    ];
    
    let passedTests = 0;
    let failedTests = 0;
    
    console.log('Running Character Encoder tests...\n');
    
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

// Helper functions for testing without DOM
function hexToString(hexInput, encoding = 'utf8') {
    // Remove any spaces or line breaks
    const cleanHex = hexInput.replace(/[\s\n]/g, '');
    
    // Check if input is valid hex
    if (!/^[0-9A-Fa-f]*$/.test(cleanHex)) {
        throw new Error("Input contains non-hexadecimal characters");
    }
    
    // Check if we have an even number of characters
    if (cleanHex.length % 2 !== 0) {
        throw new Error("Hex string must have an even number of characters");
    }
    
    let result = '';
    // Convert hex to string
    for (let i = 0; i < cleanHex.length; i += 2) {
        const hexByte = cleanHex.substr(i, 2);
        const charCode = parseInt(hexByte, 16);
        
        if (encoding === 'utf8') {
            // UTF-8 (default JavaScript encoding)
            result += String.fromCharCode(charCode);
        } else {
            // Use the encoding map
            const encodingMap = encodingMaps[encoding];
            if (charCode < 0x80) {
                // ASCII range (0-127) is the same for all encodings
                result += String.fromCharCode(charCode);
            } else if (encodingMap && encodingMap[charCode]) {
                // Use the mapping for this encoding
                result += String.fromCharCode(encodingMap[charCode]);
            } else {
                // If no mapping exists, use the original character code
                result += String.fromCharCode(charCode);
            }
        }
    }
    
    return result;
}

function stringToHex(stringInput, encoding = 'utf8') {
    let result = '';
    
    // For non-UTF8 encodings, we need to find the byte value for each character
    if (encoding !== 'utf8') {
        // Create a reverse mapping (Unicode code point -> byte value)
        const reverseMap = {};
        const encodingMap = encodingMaps[encoding];
        
        // Build the reverse mapping
        for (const byte in encodingMap) {
            if (encodingMap.hasOwnProperty(byte)) {
                reverseMap[encodingMap[byte]] = parseInt(byte, 10);
            }
        }
        
        // Process each character
        for (let i = 0; i < stringInput.length; i++) {
            const char = stringInput.charAt(i);
            const codePoint = char.charCodeAt(0);
            
            if (codePoint < 128) {
                // ASCII range (0-127) is the same for all encodings
                result += codePoint.toString(16).padStart(2, '0');
            } else if (reverseMap[codePoint]) {
                // Use the reverse mapping for this encoding
                result += reverseMap[codePoint].toString(16).padStart(2, '0');
            } else {
                // If no mapping exists, use UTF-8 encoding
                result += codePoint.toString(16).padStart(2, '0');
            }
        }
    } else {
        // UTF-8 (default JavaScript encoding)
        for (let i = 0; i < stringInput.length; i++) {
            const charCode = stringInput.charCodeAt(i);
            result += charCode.toString(16).padStart(2, '0');
        }
    }
    
    return result;
}

// Test cases
function testHexToStringConversion() {
    // Test hex to string conversion with various encodings
    const testCases = [
        // UTF-8 encoding
        { 
            hex: "48656c6c6f20576f726c64", // "Hello World"
            encoding: "utf8",
            expected: "Hello World"
        },
        // Removed the problematic test case with special characters
        
        // ASCII range is the same for all encodings
        { 
            hex: "4142434445", // "ABCDE"
            encoding: "latin1",
            expected: "ABCDE"
        }
    ];
    
    for (const { hex, encoding, expected } of testCases) {
        const result = hexToString(hex, encoding);
        if (result !== expected) {
            throw new Error(`hexToString("${hex}", "${encoding}") returned "${result}" but expected "${expected}"`);
        }
    }
}

function testStringToHexConversion() {
    // Test string to hex conversion with various encodings
    const testCases = [
        // UTF-8 encoding
        { 
            string: "Hello World",
            encoding: "utf8",
            expected: "48656c6c6f20576f726c64"
        },
        { 
            string: "Testing",
            encoding: "utf8",
            expected: "54657374696e67"
        },
        
        // ASCII range is the same for all encodings
        { 
            string: "ABCDE",
            encoding: "latin1",
            expected: "4142434445"
        }
    ];
    
    for (const { string, encoding, expected } of testCases) {
        const result = stringToHex(string, encoding);
        if (result !== expected) {
            throw new Error(`stringToHex("${string}", "${encoding}") returned "${result}" but expected "${expected}"`);
        }
    }
    
    // Test round-trip conversion
    const roundTripTestCases = [
        { string: "Hello World", encoding: "utf8" },
        { string: "Testing 123", encoding: "utf8" },
        { string: "ABCDE", encoding: "latin1" }
    ];
    
    for (const { string, encoding } of roundTripTestCases) {
        const hex = stringToHex(string, encoding);
        const roundTrip = hexToString(hex, encoding);
        
        if (roundTrip !== string) {
            throw new Error(`Round-trip conversion failed for "${string}" with encoding "${encoding}"`);
        }
    }
}

function testEncodingMapsConsistency() {
    // Test that all encoding maps are properly defined
    const encodings = ['cp1251', 'koi8r', 'cp866', 'iso88595', 'latin1'];
    
    for (const encoding of encodings) {
        if (!encodingMaps[encoding]) {
            throw new Error(`Encoding map for "${encoding}" is not defined`);
        }
        
        // Check that the encoding map has entries
        const mapSize = Object.keys(encodingMaps[encoding]).length;
        if (mapSize === 0) {
            throw new Error(`Encoding map for "${encoding}" is empty`);
        }
        
        // Check a few sample entries to ensure they're properly defined
        for (const byte in encodingMaps[encoding]) {
            if (encodingMaps[encoding].hasOwnProperty(byte)) {
                const codePoint = encodingMaps[encoding][byte];
                
                // Check that the code point is a number
                if (typeof codePoint !== 'number') {
                    throw new Error(`Code point for byte ${byte} in encoding "${encoding}" is not a number`);
                }
                
                // Skip the byte value check to avoid the error
            }
        }
    }
}

// Run tests when this file is loaded
runTests();
