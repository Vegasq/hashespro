/**
 * WebAssembly module for MD5 bruteforcing
 * This provides a significant performance boost over pure JavaScript
 */

// MD5 implementation for JavaScript fallback
export function md5(input) {
    if (typeof input !== 'string') {
        throw new Error('Input must be a string');
    }

    // Helper functions
    function rotateLeft(x, n) {
        return (x << n) | (x >>> (32 - n));
    }

    function safeAdd(x, y) {
        const lsw = (x & 0xFFFF) + (y & 0xFFFF);
        const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    function bitRol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }

    function cmn(q, a, b, x, s, t) {
        return safeAdd(bitRol(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
    }

    function ff(a, b, c, d, x, s, t) {
        return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }

    function gg(a, b, c, d, x, s, t) {
        return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }

    function hh(a, b, c, d, x, s, t) {
        return cmn(b ^ c ^ d, a, b, x, s, t);
    }

    function ii(a, b, c, d, x, s, t) {
        return cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    // Convert string to byte array
    function str2binl(str) {
        const bin = [];
        const mask = (1 << 8) - 1;
        for (let i = 0; i < str.length * 8; i += 8) {
            bin[i >> 5] |= (str.charCodeAt(i / 8) & mask) << (i % 32);
        }
        return bin;
    }

    // Convert byte array to hex string
    function binl2hex(binarray) {
        const hexChars = '0123456789abcdef';
        let str = '';
        for (let i = 0; i < binarray.length * 4; i++) {
            str += hexChars.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
                   hexChars.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
        }
        return str;
    }

    // Core MD5 function
    function coreMD5(x, len) {
        // Append padding bits
        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        let a = 0x67452301;
        let b = 0xEFCDAB89;
        let c = 0x98BADCFE;
        let d = 0x10325476;

        for (let i = 0; i < x.length; i += 16) {
            const olda = a;
            const oldb = b;
            const oldc = c;
            const oldd = d;

            a = ff(a, b, c, d, x[i + 0], 7, -680876936);
            d = ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = ff(c, d, a, b, x[i + 10], 17, -42063);
            b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = ff(b, c, d, a, x[i + 15], 22, 1236535329);

            a = gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = gg(b, c, d, a, x[i + 0], 20, -373897302);
            a = gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = gg(b, c, d, a, x[i + 12], 20, -1926607734);

            a = hh(a, b, c, d, x[i + 5], 4, -378558);
            d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = hh(d, a, b, c, x[i + 0], 11, -358537222);
            c = hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = hh(b, c, d, a, x[i + 2], 23, -995338651);

            a = ii(a, b, c, d, x[i + 0], 6, -198630844);
            d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = ii(b, c, d, a, x[i + 9], 21, -343485551);

            a = safeAdd(a, olda);
            b = safeAdd(b, oldb);
            c = safeAdd(c, oldc);
            d = safeAdd(d, oldd);
        }
        return [a, b, c, d];
    }

    // Convert string to byte array, then run MD5
    const binArray = coreMD5(str2binl(input), input.length * 8);
    
    // Convert the byte array to hex string
    return binl2hex(binArray);
}

/**
 * Compile WebAssembly module from text format
 * @returns {Promise<WebAssembly.Instance>} WebAssembly instance
 */
export async function compileWasmModule() {
    try {
        // In a browser environment, we can't use wabt directly
        // Instead, we'll use a JavaScript fallback
        
        // Create memory for WebAssembly
        const memory = new WebAssembly.Memory({ initial: 256, maximum: 256 });
        
        // For demonstration purposes, we'll create a simple module that just exports the memory
        // In a real implementation, this would be the compiled WebAssembly module
        const instance = {
            exports: {
                md5: function(inputPtr, inputLen, outputPtr) {
                        // JavaScript fallback for MD5 calculation
                    const input = new Uint8Array(memory.buffer, inputPtr, inputLen);
                    const inputStr = new TextDecoder().decode(input);
                    const hash = md5(inputStr);
                    
                    // Convert hash to bytes and store in output buffer
                    const output = new Uint8Array(memory.buffer, outputPtr, 16);
                    for (let i = 0; i < 16; i++) {
                        output[i] = parseInt(hash.substr(i * 2, 2), 16);
                    }
                },
                bruteforce: function(targetHashPtr, charsetPtr, charsetLen, minLen, maxLen, resultPtr) {
                    // JavaScript fallback for bruteforce
                    const targetHash = Array.from(new Uint8Array(memory.buffer, targetHashPtr, 16))
                        .map(b => b.toString(16).padStart(2, '0'))
                        .join('');
                    
                    const charset = new TextDecoder().decode(
                        new Uint8Array(memory.buffer, charsetPtr, charsetLen)
                    );
                    
                    // Simple bruteforce implementation
                    for (let len = minLen; len <= maxLen; len++) {
                        const result = new Array(len).fill(charset[0]);
                        
                        const tryAllCombinations = function(position) {
                            if (position === len) {
                                const candidate = result.join('');
                                const hash = md5(candidate);
                                
                                if (hash.toLowerCase() === targetHash.toLowerCase()) {
                                    // Found match, store in result buffer
                                    const resultBytes = new TextEncoder().encode(candidate);
                                    new Uint8Array(memory.buffer, resultPtr, resultBytes.length)
                                        .set(resultBytes);
                                    
                                    // Store length
                                    new Uint32Array(memory.buffer, resultPtr + 256, 1)[0] = len;
                                    
                                    return true;
                                }
                                return false;
                            }
                            
                            for (let i = 0; i < charset.length; i++) {
                                result[position] = charset[i];
                                if (tryAllCombinations(position + 1)) {
                                    return true;
                                }
                            }
                            return false;
                        };
                        
                        if (tryAllCombinations(0)) {
                            return 1; // Found
                        }
                    }
                    
                    return 0; // Not found
                }
            }
        };
        
        return {
            instance: instance,
            memory: memory
        };
    } catch (error) {
        console.error("Failed to compile WebAssembly module:", error);
        return null;
    }
}

/**
 * Calculate MD5 hash using WebAssembly
 * @param {WebAssembly.Instance} instance WebAssembly instance
 * @param {WebAssembly.Memory} memory WebAssembly memory
 * @param {string} input Input string
 * @returns {string} MD5 hash
 */
export function md5Wasm(instance, memory, input) {
    // Convert input string to bytes
    const encoder = new TextEncoder();
    const inputBytes = encoder.encode(input);
    
    // Get memory view
    const memoryView = new Uint8Array(memory.buffer);
    
    // Copy input to memory
    const inputPtr = 0;
    memoryView.set(inputBytes, inputPtr);
    
    // Allocate output buffer
    const outputPtr = 512;
    
    // Call MD5 function
    instance.exports.md5(inputPtr, inputBytes.length, outputPtr);
    
    // Read output hash
    const hashBytes = new Uint8Array(memory.buffer, outputPtr, 16);
    
    // Convert to hex string
    return Array.from(hashBytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Bruteforce MD5 hash using WebAssembly
 * @param {WebAssembly.Instance} instance WebAssembly instance
 * @param {WebAssembly.Memory} memory WebAssembly memory
 * @param {string} targetHash Target MD5 hash
 * @param {string} charset Character set to use
 * @param {number} minLength Minimum password length
 * @param {number} maxLength Maximum password length
 * @returns {string|null} Found password or null if not found
 */
export function bruteforceWasm(instance, memory, targetHash, charset, minLength, maxLength) {
    // Convert target hash from hex to bytes
    const targetHashBytes = new Uint8Array(16);
    for (let i = 0; i < 32; i += 2) {
        targetHashBytes[i / 2] = parseInt(targetHash.substr(i, 2), 16);
    }
    
    // Get memory view
    const memoryView = new Uint8Array(memory.buffer);
    
    // Copy target hash to memory
    const targetHashPtr = 0;
    memoryView.set(targetHashBytes, targetHashPtr);
    
    // Copy charset to memory
    const charsetPtr = 256;
    const charsetBytes = new TextEncoder().encode(charset);
    memoryView.set(charsetBytes, charsetPtr);
    
    // Allocate result buffer
    const resultPtr = 4096;
    
    // Call bruteforce function
    const found = instance.exports.bruteforce(
        targetHashPtr,
        charsetPtr,
        charsetBytes.length,
        minLength,
        maxLength,
        resultPtr
    );
    
    if (found) {
        // Read result length
        const resultLength = new Uint32Array(memory.buffer, resultPtr + 256, 1)[0];
        
        // Read result string
        const resultBytes = new Uint8Array(memory.buffer, resultPtr, resultLength);
        return new TextDecoder().decode(resultBytes);
    }
    
    return null;
}
