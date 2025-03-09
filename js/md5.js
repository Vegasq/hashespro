/**
 * MD5 Hash Module
 * Provides a simple interface for generating MD5 hashes from strings
 * Now using a pure JavaScript implementation for better compatibility
 */

import { md5crypto as md5 } from './md5crypto.js';

/**
 * Generate MD5 hash from a string
 * @param {string} input - Input string to hash
 * @returns {string} - MD5 hash as a hexadecimal string
 */
export function generateMD5(input) {
    if (typeof input !== 'string') {
        throw new Error('Input must be a string');
    }
    
    return md5(input);
}

/**
 * Generate MD5 hash from a string with optional salt
 * @param {string} input - Input string to hash
 * @param {string} salt - Optional salt to add to the input
 * @returns {string} - MD5 hash as a hexadecimal string
 */
export function generateMD5WithSalt(input, salt = '') {
    if (typeof input !== 'string' || typeof salt !== 'string') {
        throw new Error('Input and salt must be strings');
    }
    
    return md5(input + salt);
}

/**
 * Verify if a string matches a given MD5 hash
 * @param {string} input - Input string to verify
 * @param {string} hash - MD5 hash to compare against
 * @returns {boolean} - True if the input's MD5 hash matches the provided hash
 */
export function verifyMD5(input, hash) {
    if (typeof input !== 'string' || typeof hash !== 'string') {
        throw new Error('Input and hash must be strings');
    }
    
    const calculatedHash = md5(input);
    return calculatedHash.toLowerCase() === hash.toLowerCase();
}

/**
 * Generate multiple MD5 hashes from an array of strings
 * @param {string[]} inputs - Array of input strings to hash
 * @returns {string[]} - Array of MD5 hashes
 */
export function batchGenerateMD5(inputs) {
    if (!Array.isArray(inputs)) {
        throw new Error('Inputs must be an array of strings');
    }
    
    return inputs.map(input => {
        if (typeof input !== 'string') {
            throw new Error('All inputs must be strings');
        }
        return md5(input);
    });
}
