/**
 * Universal Hash Tool
 * Provides functionality to hash strings using various algorithms and verify hashes
 * Combines the functionality of stringToHash.js and md5.js
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
    if (typeof input !== 'string') {
        throw new Error('Input must be a string');
    }
    
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
 * Verify if a string matches a given hash using the specified algorithm
 * @param {string} input - Input string to verify
 * @param {string} hash - Hash to compare against
 * @param {string} algorithm - Hash algorithm to use (md5, sha1, sha256, sha512, sha3)
 * @returns {Promise<boolean>} - True if the input's hash matches the provided hash
 */
export async function verifyHash(input, hash, algorithm) {
    if (typeof input !== 'string' || typeof hash !== 'string') {
        throw new Error('Input and hash must be strings');
    }
    
    const calculatedHash = await generateHash(input, algorithm);
    return calculatedHash.toLowerCase() === hash.toLowerCase();
}

/**
 * Main function to generate hash from input field
 */
export async function hashString() {
    try {
        const inputElement = document.getElementById("universalHashInput");
        const stringInput = inputElement ? inputElement.value : "";
        const algorithm = document.getElementById("hashAlgorithmSelect").value;
        const resultElement = document.getElementById("hashResult");
        const algorithmResultElement = document.getElementById("hashAlgorithmResult");
        
        if (!resultElement || !algorithmResultElement) {
            console.error("Result elements not found");
            return;
        }
        
        // Update algorithm display
        algorithmResultElement.textContent = algorithm.toUpperCase();
        
        // Generate hash
        const hash = await generateHash(stringInput, algorithm);
        
        // Display result
        resultElement.textContent = hash;
    } catch (error) {
        console.error("Error in hashString function:", error);
        const resultElement = document.getElementById("hashResult");
        if (resultElement) {
            resultElement.textContent = `Error: ${error.message}`;
        }
    }
}

/**
 * Main function to verify hash
 */
export async function verifyHashString() {
    try {
        const inputElement = document.getElementById("verifyInput");
        const hashElement = document.getElementById("hashToVerify");
        const algorithm = document.getElementById("verifyAlgorithmSelect").value;
        const resultElement = document.getElementById("verifyResult");
        
        if (!inputElement || !hashElement || !resultElement) {
            console.error("Required elements not found");
            return;
        }
        
        const input = inputElement.value;
        const hash = hashElement.value;
        
        // Verify hash
        const isValid = await verifyHash(input, hash, algorithm);
        
        // Display result
        if (isValid) {
            resultElement.textContent = "✓ Valid: The input matches the provided hash";
            resultElement.classList.remove("text-danger");
            resultElement.classList.add("text-success");
        } else {
            resultElement.textContent = "✗ Invalid: The input does not match the provided hash";
            resultElement.classList.remove("text-success");
            resultElement.classList.add("text-danger");
        }
    } catch (error) {
        console.error("Error in verifyHashString function:", error);
        const resultElement = document.getElementById("verifyResult");
        if (resultElement) {
            resultElement.textContent = `Error: ${error.message}`;
            resultElement.classList.add("text-danger");
            resultElement.classList.remove("text-success");
        }
    }
}
