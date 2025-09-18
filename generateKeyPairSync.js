const fs = require('fs')

const crypto = require('crypto');

const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
});

// We need to output the keys in a way our shell script can easily parse them.
// Using a simple delimiter.
process.stdout.write('-----PRIVATE KEY-----\n');
process.stdout.write(privateKey + '\n');
process.stdout.write('-----PUBLIC KEY-----\n');
process.stdout.write(publicKey + '\n');