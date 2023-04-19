const fs = require('fs')
const path = require('path')
const privateKEY = fs.readFileSync(path.join(__dirname, '../private.key'), 'utf8')
const jwt = require('jsonwebtoken')

function generateToken(payload, option={}) {
    const { algorithm = "RS256", expiresIn = "12h" } = option
    const token = jwt.sign(
        payload,
        privateKEY,
        { algorithm, expiresIn }
    )
    return token
}

module.exports = {
    generateToken
}