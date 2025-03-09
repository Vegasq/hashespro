/**
 * Character encoding module
 * Provides functionality for hex to string and string to hex conversions
 * with support for various encodings
 */

import { encodingMaps } from './encodingMaps.js';

/**
 * Converts hex string to text using the specified encoding
 */
export function convertHexToString() {
    const hexInput = document.getElementById("hexInputField").value.trim();
    const hexResult = document.getElementById("hexResult");
    const encodingSelect = document.getElementById("encodingSelect");
    const selectedEncoding = encodingSelect.value;
    
    // Update the displayed encoding
    document.getElementById("resultEncoding").textContent = encodingSelect.options[encodingSelect.selectedIndex].text;
    
    // Remove any spaces or line breaks
    const cleanHex = hexInput.replace(/[\s\n]/g, '');
    
    // Check if input is valid hex
    if (!/^[0-9A-Fa-f]*$/.test(cleanHex)) {
        hexResult.textContent = "Error: Input contains non-hexadecimal characters";
        return;
    }
    
    // Check if we have an even number of characters
    if (cleanHex.length % 2 !== 0) {
        hexResult.textContent = "Error: Hex string must have an even number of characters";
        return;
    }
    
    try {
        let result = '';
        // Convert hex to string
        for (let i = 0; i < cleanHex.length; i += 2) {
            const hexByte = cleanHex.substr(i, 2);
            const charCode = parseInt(hexByte, 16);
            
            if (selectedEncoding === 'utf8') {
                // UTF-8 (default JavaScript encoding)
                result += String.fromCharCode(charCode);
            } else {
                // Use the encoding map
                const encodingMap = encodingMaps[selectedEncoding];
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
        
        hexResult.textContent = result;
    } catch (error) {
        hexResult.textContent = "Error: " + error.message;
    }
}

/**
 * Converts text to hex string using the specified encoding
 */
export function convertStringToHex() {
    const stringInput = document.getElementById("stringInputField").value;
    const stringResult = document.getElementById("stringResult");
    const encodingSelect = document.getElementById("stringEncodingSelect");
    const selectedEncoding = encodingSelect.value;
    
    // Update the displayed encoding
    document.getElementById("stringResultEncoding").textContent = encodingSelect.options[encodingSelect.selectedIndex].text;
    
    try {
        let result = '';
        
        // For non-UTF8 encodings, we need to find the byte value for each character
        if (selectedEncoding !== 'utf8') {
            // Create a reverse mapping (Unicode code point -> byte value)
            const reverseMap = {};
            const encodingMap = encodingMaps[selectedEncoding];
            
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
        
        // Format the result with spaces between bytes for readability
        const formattedResult = result.match(/.{2}/g)?.join(' ') || '';
        stringResult.textContent = formattedResult;
    } catch (error) {
        stringResult.textContent = "Error: " + error.message;
    }
}
