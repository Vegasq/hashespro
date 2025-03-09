# MD5 Performance Comparison

This document summarizes the performance comparison between different MD5 hash algorithm implementations available in the project.

## Implementations Compared

1. **Pure JavaScript Implementation** - A JavaScript implementation of the MD5 algorithm found in `js/md5wasm.js`
2. **WebAssembly Implementation** - A WebAssembly implementation (currently using a JavaScript fallback) in `js/md5wasm.js`
3. **Node.js Crypto Module** - The native Node.js crypto module implementation in `js/md5crypto.js`
4. **Browser SubtleCrypto API** - The browser's built-in Web Crypto API (using SHA-256 as Web Crypto doesn't support MD5)

## Node.js Test Results

The following results were obtained by running the `md5-performance-comparison.js` script:

| Input Size | JS Implementation | WebAssembly | Node.js crypto |
|------------|-------------------|-------------|----------------|
| Tiny       | 0.0059 ms         | 0.0088 ms   | 0.0010 ms      |
| Small      | 0.0028 ms         | 0.0045 ms   | 0.0007 ms      |
| Medium     | 0.0171 ms         | 0.0199 ms   | 0.0026 ms      |
| Large      | 0.1679 ms         | 0.1682 ms   | 0.0207 ms      |
| Huge       | 1.6582 ms         | 1.6884 ms   | 0.2004 ms      |

## Key Findings

1. **Node.js Crypto Module is Fastest**: The Node.js crypto module implementation is significantly faster than both the JavaScript and WebAssembly implementations, being approximately 8-10 times faster for large inputs.

2. **WebAssembly vs JavaScript**: The WebAssembly implementation shows similar performance to the pure JavaScript implementation. This is because the current WebAssembly implementation is actually using a JavaScript fallback. A true WebAssembly implementation would likely show better performance.

3. **Performance Scaling**: All implementations show linear scaling with input size, but the Node.js crypto module maintains its performance advantage across all input sizes.

## Browser Test

A browser-based test was also created (`md5-performance-comparison.html`) that compares:
- Pure JavaScript implementation
- WebAssembly implementation (JavaScript fallback)
- Browser's SubtleCrypto API (using SHA-256 since Web Crypto API doesn't support MD5)

The browser test allows for visual comparison of the performance characteristics through an interactive chart.

## Recommendations

1. **Use Node.js Crypto Module When Available**: For server-side applications or Node.js environments, the crypto module provides the best performance and should be preferred.

2. **Implement True WebAssembly**: The current WebAssembly implementation is using a JavaScript fallback. Implementing a true WebAssembly version of the MD5 algorithm could potentially provide better performance for browser environments.

3. **Consider Modern Alternatives**: MD5 is considered cryptographically broken and should not be used for security purposes. For secure hashing, consider using SHA-256 or other modern hash functions, which are available in both Node.js crypto and browser SubtleCrypto APIs.

## How to Run the Tests

### Node.js Test
```bash
node md5-performance-comparison.js
```

### Browser Test
Start a local server and navigate to the HTML file:
```bash
python3 -m http.server 8000
# Then open http://localhost:8000/md5-performance-comparison.html in a browser
```

## Conclusion

The Node.js crypto module provides the best performance for MD5 hashing operations, followed by the pure JavaScript implementation. The WebAssembly implementation currently shows similar performance to JavaScript due to using a fallback, but a true WebAssembly implementation could potentially offer better performance.
