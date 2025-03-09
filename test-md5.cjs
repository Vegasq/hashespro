// Using CommonJS syntax
const fs = require('fs');
const path = require('path');

// Read the md5wasm.js file content
const md5wasmContent = fs.readFileSync(path.join(__dirname, 'js', 'md5wasm.js'), 'utf8');

// Extract the md5 function implementation
const md5FunctionMatch = md5wasmContent.match(/export function md5\(input\) \{[\s\S]+?\}/);
if (!md5FunctionMatch) {
  console.error('Could not find md5 function in md5wasm.js');
  process.exit(1);
}

// Create a function from the extracted code
const md5FunctionCode = md5FunctionMatch[0]
  .replace('export function md5(input) {', 'function md5(input) {');

// Evaluate the function
eval(md5FunctionCode);

// Test the md5 function
console.log("Testing MD5 implementation");
console.log(`MD5 of '1': ${md5('1')}`);
console.log(`Expected: c4ca4238a0b923820dcc509a6f75849b`);
