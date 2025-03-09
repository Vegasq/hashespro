# HashesPro

A JavaScript library for hash functions and utilities.

## Features

- Multiple MD5 implementations (JavaScript, WebAssembly, Crypto)
- Hash identification
- String to hash conversion with multiple algorithms (MD5, SHA-1, SHA-256, SHA-512, SHA-3)
- MD5 bruteforcer
- Character encoding utilities

## Testing

The project includes comprehensive tests for all modules. To run the tests:

1. Start a local HTTP server:
   ```
   npx http-server -p 8080
   ```

2. Open the test page in your browser:
   ```
   http://localhost:8080/test.html
   ```

## Continuous Integration

This project uses GitHub Actions for continuous integration. The workflow automatically runs all tests on push and pull requests to the main branch.

The workflow:
1. Sets up a Node.js environment
2. Installs dependencies
3. Starts a local HTTP server
4. Runs the tests using Puppeteer
5. Reports the test results

## Project Structure

- `js/` - Core JavaScript modules
  - `md5.js` - Pure JavaScript MD5 implementation
  - `md5wasm.js` - WebAssembly MD5 implementation
  - `md5crypto.js` - JavaScript MD5 implementation
  - `md5Bruteforcer.js` - MD5 hash bruteforcer
  - `stringToHash.js` - String to hash conversion with multiple algorithms
  - `hashIdentifier.js` - Hash type identification
  - `characterEncoder.js` - Character encoding utilities
  - `encodingMaps.js` - Character encoding maps
- `test.html` - Test runner page
- `.github/workflows/` - GitHub Actions workflow configuration

## License

See the [LICENSE](LICENSE) file for details.
