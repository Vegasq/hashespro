/**
 * MD5 Bruteforcer module
 * Provides functionality to bruteforce MD5 hashes using alphanumeric characters
 * Now using a pure JavaScript implementation for better compatibility
 */

// Character set for bruteforcing (a-zA-Z0-9)
const CHARSET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

import { md5crypto as md5 } from './md5crypto.js';

/**
 * Generate all possible combinations of characters with a given length
 * @param {number} length - Length of combinations to generate
 * @param {function} callback - Callback function to process each combination
 */
function generateCombinations(length, callback) {
    const chars = CHARSET.split('');
    const result = new Array(length).fill(chars[0]);
    
    function* generate(position) {
        if (position === length) {
            yield result.join('');
            return;
        }
        
        for (let i = 0; i < chars.length; i++) {
            result[position] = chars[i];
            yield* generate(position + 1);
        }
    }
    
    const generator = generate(0);
    let combination;
    
    while (!(combination = generator.next()).done) {
        if (callback(combination.value) === true) {
            return true; // Stop if callback returns true (found match)
        }
    }
    
    return false;
}

/**
 * Simple bruteforce implementation for testing
 * This is used when Web Workers are not available (e.g., in Node.js)
 */
function simpleBruteforce(hash, charset, minLength, maxLength) {
    hash = hash.toLowerCase();
    
    for (let len = minLength; len <= maxLength; len++) {
        const chars = charset.split('');
        const result = new Array(len).fill(chars[0]);
        
        function generateCombinations(position) {
            if (position === len) {
                const candidate = result.join('');
                const candidateHash = md5(candidate);
                
                if (candidateHash.toLowerCase() === hash) {
                    return candidate;
                }
                return null;
            }
            
            for (let i = 0; i < chars.length; i++) {
                result[position] = chars[i];
                const found = generateCombinations(position + 1);
                if (found) {
                    return found;
                }
            }
            return null;
        }
        
        const found = generateCombinations(0);
        if (found) {
            return found;
        }
    }
    
    return null;
}

// Check if we're running in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof Worker !== 'undefined';

/**
 * Worker pool for parallel bruteforcing (browser only)
 */
class WorkerPool {
    constructor(size) {
        this.size = size;
        this.workers = [];
        this.taskQueue = [];
        this.activeWorkers = 0;
    }
    
    async init() {
        if (!isBrowser) {
            return this; // Skip initialization in Node.js
        }
        
        const workerCode = `
            // Import the MD5 function from the main thread
            ${md5crypto.toString()}
            
            // Define md5 function to use md5crypto
            function md5(input) {
                return md5crypto(input);
            }
            
            self.onmessage = function(e) {
                const { targetHash, charset, minLength, maxLength, startIndex, endIndex } = e.data;
                
                function bruteforce() {
                    // Try all possible combinations within the assigned range
                    for (let len = minLength; len <= maxLength; len++) {
                        const chars = charset.split('');
                        const result = new Array(len).fill(chars[0]);
                        
                        function generateCombinations(position) {
                            if (position === len) {
                                const candidate = result.join('');
                                const hash = md5(candidate);
                                
                                if (hash === targetHash) {
                                    self.postMessage({ found: true, password: candidate });
                                    return true;
                                }
                                return false;
                            }
                            
                            for (let i = 0; i < chars.length; i++) {
                                result[position] = chars[i];
                                if (generateCombinations(position + 1)) {
                                    return true;
                                }
                            }
                            return false;
                        }
                        
                        if (generateCombinations(0)) {
                            return;
                        }
                    }
                    
                    self.postMessage({ found: false });
                }
                
                bruteforce();
            };
        `;
        
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const workerUrl = URL.createObjectURL(blob);
        
        for (let i = 0; i < this.size; i++) {
            const worker = new Worker(workerUrl);
            this.workers.push(worker);
        }
        
        return this;
    }
    
    runTask(task) {
        return new Promise((resolve, reject) => {
            // If not in browser, use simple bruteforce
            if (!isBrowser) {
                const { targetHash, charset, minLength, maxLength } = task;
                const password = simpleBruteforce(targetHash, charset, minLength, maxLength);
                resolve({ found: !!password, password });
                return;
            }
            
            const wrappedTask = {
                task,
                resolve,
                reject
            };
            
            if (this.activeWorkers < this.size) {
                this.runTaskOnWorker(wrappedTask);
            } else {
                this.taskQueue.push(wrappedTask);
            }
        });
    }
    
    runTaskOnWorker(wrappedTask) {
        const workerIndex = this.workers.findIndex(w => !w.busy);
        if (workerIndex === -1) {
            this.taskQueue.push(wrappedTask);
            return;
        }
        
        const worker = this.workers[workerIndex];
        worker.busy = true;
        this.activeWorkers++;
        
        worker.onmessage = (e) => {
            wrappedTask.resolve(e.data);
            worker.busy = false;
            this.activeWorkers--;
            
            if (this.taskQueue.length > 0) {
                const nextTask = this.taskQueue.shift();
                this.runTaskOnWorker(nextTask);
            }
        };
        
        worker.onerror = (e) => {
            wrappedTask.reject(e);
            worker.busy = false;
            this.activeWorkers--;
            
            if (this.taskQueue.length > 0) {
                const nextTask = this.taskQueue.shift();
                this.runTaskOnWorker(nextTask);
            }
        };
        
        worker.postMessage(wrappedTask.task);
    }
    
    terminate() {
        if (isBrowser) {
            this.workers.forEach(worker => worker.terminate());
            this.workers = [];
        }
        this.activeWorkers = 0;
        this.taskQueue = [];
    }
}

// Worker pool instance
let workerPool = null;

/**
 * Initialize the worker pool
 */
async function initWorkerPool() {
    const numCores = isBrowser ? (navigator.hardwareConcurrency || 4) : 1;
    workerPool = new WorkerPool(numCores);
    await workerPool.init();
    return workerPool;
}

/**
 * Bruteforce an MD5 hash using the pure JavaScript implementation
 * @param {string} hash - MD5 hash to bruteforce
 * @param {number} minLength - Minimum password length to try
 * @param {number} maxLength - Maximum password length to try
 * @param {function} progressCallback - Callback function for progress updates
 * @returns {Promise<string|null>} - Resolved with the password if found, null otherwise
 */
export async function bruteforceHash(hash, minLength, maxLength, progressCallback) {
    hash = hash.toLowerCase();
    
    console.log("Using pure JavaScript implementation for bruteforcing");
    
    // Initialize worker pool if not already initialized
    if (!workerPool) {
        await initWorkerPool();
    }
    
    // Use Web Workers for parallel processing
    const numCores = navigator.hardwareConcurrency || 4;
    const tasks = [];
    
    for (let i = 0; i < numCores; i++) {
        const startIndex = Math.floor(CHARSET.length * i / numCores);
        const endIndex = Math.floor(CHARSET.length * (i + 1) / numCores);
        
        tasks.push(workerPool.runTask({
            targetHash: hash,
            charset: CHARSET,
            minLength,
            maxLength,
            startIndex,
            endIndex
        }));
    }
    
    // Wait for any worker to find the password
    const results = await Promise.all(tasks);
    const foundResult = results.find(result => result.found);
    
    if (foundResult) {
        return foundResult.password;
    }
    
    return null;
}

/**
 * Main function to bruteforce MD5 hash from input field
 */
export async function bruteforce() {
    const hashInput = document.getElementById("md5HashInput").value.trim();
    const minLengthInput = parseInt(document.getElementById("minLength").value, 10) || 1;
    const maxLengthInput = parseInt(document.getElementById("maxLength").value, 10) || 8;
    const resultElement = document.getElementById("bruteforceResult");
    const progressElement = document.getElementById("bruteforceProgress");
    const timeElement = document.getElementById("bruteforceTime");
    
    // Validate input
    if (!hashInput) {
        resultElement.textContent = "Please enter an MD5 hash";
        return;
    }
    
    if (!/^[a-fA-F0-9]{32}$/.test(hashInput)) {
        resultElement.textContent = "Invalid MD5 hash format";
        return;
    }
    
    // Reset UI
    resultElement.textContent = "Bruteforcing in progress...";
    progressElement.textContent = "0%";
    timeElement.textContent = "0s";
    
    // Start timer
    const startTime = Date.now();
    const updateTimer = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        timeElement.textContent = `${elapsedSeconds}s`;
    }, 1000);
    
    try {
        // Progress tracking
        let totalCombinations = 0;
        let checkedCombinations = 0;
        
        for (let len = minLengthInput; len <= maxLengthInput; len++) {
            totalCombinations += Math.pow(CHARSET.length, len);
        }
        
        const updateProgress = (increment) => {
            checkedCombinations += increment;
            const percentage = Math.min(100, Math.floor((checkedCombinations / totalCombinations) * 100));
            progressElement.textContent = `${percentage}%`;
        };
        
        // Start bruteforcing
        const password = await bruteforceHash(
            hashInput,
            minLengthInput,
            maxLengthInput,
            updateProgress
        );
        
        // Clear timer
        clearInterval(updateTimer);
        
        // Display result
        if (password) {
            const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
            resultElement.textContent = `Password found: ${password} (in ${elapsedTime}s)`;
        } else {
            resultElement.textContent = "Password not found within the specified length range";
        }
    } catch (error) {
        clearInterval(updateTimer);
        resultElement.textContent = `Error: ${error.message}`;
    }
}
