const jwt = require("jsonwebtoken")
const fs = require('fs')
const path = require('path')
const publicKey = fs.readFileSync(path.join(__dirname, '../public.key'), 'utf8')

function verifyToken(req, res, next) {
    const auth = req.headers.authorization
    const token = auth && auth.split(" ")[1]
    if (!token) return res.status(401).json({ code: -1, message: "no Token provided" })

    jwt.verify(token, publicKey, (err, decoded) => {
        if (err) {
            console.log(err);
            res.status(401).json({ code: -2, message: "Token not Verified!" })
        }
        next()
    })
}

module.exports = {
    verifyToken
}