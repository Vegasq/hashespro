/**
 * String to Hash module
 * Provides functionality to hash strings using various algorithms
 * Now using a pure JavaScript implementation for MD5 for better compatibility
 */

import { md5crypto as md5 } from './md5crypto.js';

// Polyfill for TextEncoder/TextDecoder if not available
if (typeof TextEncoder === 'undefined') {
    window.TextEncoder = function() {};
    TextEncoder.prototype.encode = function(str) {
        const utf8 = [];
        for (let i = 0; i < str.length; i++) {
            let charcode = str.charCodeAt(i);
            if (charcode < 0x80) utf8.push(charcode);
            else if (charcode < 0x800) {
                utf8.push(0xc0 | (charcode >> 6), 
                          0x80 | (charcode & 0x3f));
            }
            else if (charcode < 0xd800 || charcode >= 0xe000) {
                utf8.push(0xe0 | (charcode >> 12), 
                          0x80 | ((charcode>>6) & 0x3f), 
                          0x80 | (charcode & 0x3f));
            }
            else {
                i++;
                charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                          | (str.charCodeAt(i) & 0x3ff));
                utf8.push(0xf0 | (charcode >>18), 
                          0x80 | ((charcode>>12) & 0x3f), 
                          0x80 | ((charcode>>6) & 0x3f), 
                          0x80 | (charcode & 0x3f));
            }
        }
        return new Uint8Array(utf8);
    };
}

if (typeof TextDecoder === 'undefined') {
    window.TextDecoder = function() {};
    TextDecoder.prototype.decode = function(bytes) {
        let str = '';
        for (let i = 0; i < bytes.length; i++) {
            str += String.fromCharCode(bytes[i]);
        }
        return str;
    };
}

/**
 * Generate SHA-1 hash
 * @param {string} input - Input string to hash
 * @returns {string} - SHA-1 hash
 */
async function sha1(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate SHA-256 hash
 * @param {string} input - Input string to hash
 * @returns {string} - SHA-256 hash
 */
async function sha256(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate SHA-512 hash
 * @param {string} input - Input string to hash
 * @returns {string} - SHA-512 hash
 */
async function sha512(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-512', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate SHA-3 hash (using SHA-384 as a substitute since SHA-3 is not directly supported in Web Crypto API)
 * @param {string} input - Input string to hash
 * @returns {string} - SHA-3 hash (actually SHA-384)
 */
async function sha3(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-384', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate hash based on selected algorithm
 * @param {string} input - Input string to hash
 * @param {string} algorithm - Hash algorithm to use (md5, sha1, sha256, sha512, sha3)
 * @returns {Promise<string>} - Hash value
 */
export async function generateHash(input, algorithm) {
    switch (algorithm) {
        case 'md5':
            return md5(input);
        case 'sha1':
            return await sha1(input);
        case 'sha256':
            return await sha256(input);
        case 'sha512':
            return await sha512(input);
        case 'sha3':
            return await sha3(input);
        default:
            throw new Error(`Unsupported hash algorithm: ${algorithm}`);
    }
}

/**
 * Main function to generate hash from input field
 */
export async function hashString() {
    console.log("hashString function called");
    try {
        // Debug all textarea elements on the page
        const allTextareas = document.getElementsByTagName("textarea");
        console.log("All textareas on page:", allTextareas.length);
        for (let i = 0; i < allTextareas.length; i++) {
            console.log(`Textarea ${i} id:`, allTextareas[i].id);
            console.log(`Textarea ${i} value:`, allTextareas[i].value);
        }
        
        // Try to get the input element directly
        const inputElement = document.getElementById("stringToHashInput");
        console.log("Input element:", inputElement);
        
        // Get the input value
        const stringInput = inputElement ? inputElement.value : "";
        console.log("Input text:", stringInput);
        
        // Use the actual input value
        const textToHash = stringInput;
        console.log("Text to hash:", textToHash);
        
        const algorithm = document.getElementById("hashAlgorithmSelect").value;
        console.log("Selected algorithm:", algorithm);
        
        const resultElement = document.getElementById("hashResult");
        const algorithmResultElement = document.getElementById("hashAlgorithmResult");
        
        if (!resultElement) {
            console.error("Result element not found");
            return;
        }
        
        if (!algorithmResultElement) {
            console.error("Algorithm result element not found");
            return;
        }
        
        // Update algorithm display
        algorithmResultElement.textContent = algorithm.toUpperCase();
        
        // Generate hash
        console.log("Generating hash...");
        const hash = await generateHash(textToHash, algorithm);
        console.log("Generated hash:", hash);
        
        // Display result
        resultElement.textContent = hash;
        console.log("Hash displayed in result element");
    } catch (error) {
        console.error("Error in hashString function:", error);
        const resultElement = document.getElementById("hashResult");
        if (resultElement) {
            resultElement.textContent = `Error: ${error.message}`;
        }
    }
}
