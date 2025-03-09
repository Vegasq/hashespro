import { md5 } from './js/md5wasm.js';

console.log("Testing MD5 implementation");
console.log(`MD5 of '1': ${md5('1')}`);
console.log(`Expected: c4ca4238a0b923820dcc509a6f75849b`);
