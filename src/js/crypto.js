const fs = require('fs')
const path = require('path')
const privateKEY = fs.readFileSync(path.join(__dirname, '../../private.key'), 'utf8')
const jwt = require('jsonwebtoken')
const cryptoJS = require('crypto-js');

function generateToken(payload, option={}) {
    const { algorithm = "RS256", expiresIn = "12h" } = option
    const token = jwt.sign(
        payload,
        privateKEY,
        { algorithm, expiresIn }
    )
    return token
}

function generateSalt() {
    // 生成一個16字節（128位）的隨機salt
    var salt = cryptoJS.lib.WordArray.random(16);
    // 輸出16進位格式的salt
    return salt.toString(cryptoJS.enc.Hex)
}

function sha256(pwd, salt) {
    let message = pwd + salt
    return cryptoJS.SHA256(message).toString();
}

function md5Encode(message) {
    var hash = cryptoJS.MD5(message);
    return hash.toString(cryptoJS.enc.Hex)
}

module.exports = {
    generateToken,
    md5Encode,
    generateSalt,
    sha256
}