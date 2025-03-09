/**
 * Main module
 * Entry point for the application that initializes all components
 */

console.log('Main module loaded');

import { identify } from './hashIdentifier.js';
import { convertHexToString, convertStringToHex } from './characterEncoder.js';
import { bruteforce } from './md5Bruteforcer.js';
import { hashString } from './stringToHash.js';
import { generateMD5, verifyMD5 } from './md5.js';

console.log('Imports completed');

/**
 * Initialize the application
 */
function init() {
    console.log('Initializing application');
    
    // Initialize hash identifier
    const identifyButton = document.getElementById("identify");
    identifyButton.addEventListener("click", identify);
    
    // Initialize hex to string converter
    const convertHexButton = document.getElementById("convertHex");
    convertHexButton.addEventListener("click", convertHexToString);
    
    // Initialize string to hex converter
    const convertStringButton = document.getElementById("convertString");
    convertStringButton.addEventListener("click", convertStringToHex);
    
    // Initialize MD5 bruteforcer
    const bruteforceButton = document.getElementById("bruteforce");
    bruteforceButton.addEventListener("click", bruteforce);
    
    // Initialize hex to string encoding select
    const hexEncodingSelect = document.getElementById("encodingSelect");
    hexEncodingSelect.addEventListener("change", function() {
        document.getElementById("resultEncoding").textContent = this.options[this.selectedIndex].text;
    });
    
    // Initialize string to hex encoding select
    const stringEncodingSelect = document.getElementById("stringEncodingSelect");
    stringEncodingSelect.addEventListener("change", function() {
        document.getElementById("stringResultEncoding").textContent = this.options[this.selectedIndex].text;
    });
    
    // Initialize string to hash
    const generateHashButton = document.getElementById("generateHash");
    generateHashButton.addEventListener("click", hashString);
    
    // Initialize hash algorithm select
    const hashAlgorithmSelect = document.getElementById("hashAlgorithmSelect");
    hashAlgorithmSelect.addEventListener("change", function() {
        document.getElementById("hashAlgorithmResult").textContent = this.options[this.selectedIndex].text;
    });
    
    // Initialize MD5 generator
    const generateMD5Button = document.getElementById("generateMD5");
    if (generateMD5Button) {
        generateMD5Button.addEventListener("click", function() {
            const input = document.getElementById("md5Input").value;
            const resultElement = document.getElementById("md5Result");
            
            try {
                const hash = generateMD5(input);
                resultElement.textContent = hash;
                resultElement.classList.remove("text-danger");
            } catch (error) {
                resultElement.textContent = `Error: ${error.message}`;
                resultElement.classList.add("text-danger");
            }
        });
    }
    
    // Initialize MD5 verifier
    const verifyMD5Button = document.getElementById("verifyMD5");
    if (verifyMD5Button) {
        verifyMD5Button.addEventListener("click", function() {
            const input = document.getElementById("md5VerifyInput").value;
            const hash = document.getElementById("md5HashToVerify").value;
            const resultElement = document.getElementById("md5VerifyResult");
            
            try {
                const isValid = verifyMD5(input, hash);
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
                resultElement.textContent = `Error: ${error.message}`;
                resultElement.classList.add("text-danger");
                resultElement.classList.remove("text-success");
            }
        });
    }
    
    // Initialize Bootstrap 5 tabs
    try {
        const triggerTabList = [].slice.call(document.querySelectorAll('#featureTabs a'));
        triggerTabList.forEach(function(triggerEl) {
            if (typeof bootstrap !== 'undefined') {
                const tabTrigger = new bootstrap.Tab(triggerEl);
                
                triggerEl.addEventListener('click', function(event) {
                    event.preventDefault();
                    tabTrigger.show();
                });
            } else {
                // Fallback for when bootstrap JS isn't fully loaded
                triggerEl.addEventListener('click', function(event) {
                    event.preventDefault();
                    
                    // Hide all tab panes
                    document.querySelectorAll('.tab-pane').forEach(pane => {
                        pane.classList.remove('show', 'active');
                    });
                    
                    // Deactivate all tabs
                    document.querySelectorAll('.nav-link').forEach(tab => {
                        tab.classList.remove('active');
                        tab.setAttribute('aria-selected', 'false');
                    });
                    
                    // Activate clicked tab
                    this.classList.add('active');
                    this.setAttribute('aria-selected', 'true');
                    
                    // Show corresponding tab pane
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.classList.add('show', 'active');
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error initializing tabs:', error);
    }
    
    // Initialize copy buttons
    initializeCopyButtons();
}

/**
 * Initialize copy buttons functionality
 */
function initializeCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-clipboard-target');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Create a temporary textarea element to copy from
                const textarea = document.createElement('textarea');
                textarea.value = targetElement.textContent;
                textarea.setAttribute('readonly', '');
                textarea.style.position = 'absolute';
                textarea.style.left = '-9999px';
                document.body.appendChild(textarea);
                
                // Select and copy the text
                textarea.select();
                document.execCommand('copy');
                
                // Remove the temporary element
                document.body.removeChild(textarea);
                
                // Show feedback
                const originalTitle = this.getAttribute('title');
                this.setAttribute('title', 'Copied!');
                
                // Reset title after a delay
                setTimeout(() => {
                    this.setAttribute('title', originalTitle);
                }, 1500);
            }
        });
    });
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
