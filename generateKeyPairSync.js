const { generateKeyPairSync } = require('crypto');
const fs = require('fs');
const path = require('path');

// 取得命令列參數傳入的路徑
const privateKeyPath = process.argv[2]; 
const publicKeyPath = process.argv[3];

if (!privateKeyPath || !publicKeyPath) {
    console.error("Usage: node generateKeyPairSync.js <privateKeyPath> <publicKeyPath>");
    process.exit(1);
}

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

fs.writeFileSync(privateKeyPath, privateKey);
fs.writeFileSync(publicKeyPath, publicKey);

console.log("Keys generated successfully.");