const crypto = require('crypto-js')

const password = "user_password";
const encryptedPassword = crypto.SHA256(password).toString();
console.log(encryptedPassword);