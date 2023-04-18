const Users = require("../../modal/user")
const sequelize = require("../../js/connect");
const { md5Encode, generateSalt, sha256 } = require("../../js/util");
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const privateKEY = fs.readFileSync(path.join(__dirname, '../../private.key'), 'utf8')

async function createUser({ userId, pwd }) {
    await sequelize.sync()
    const md5 = md5Encode(userId)
    const dup = await Users.findOne({ where: { md5_userId: md5 } })
    if (dup) return Promise.reject({ code: 0, msg: "loginId重覆了" })

    try {
        let salt = generateSalt(),
            hashed = sha256(pwd, salt)
        await Users.create({
            userId,
            md5_userId: md5,
            pwd: hashed,
            salt
        })

        const token = jwt.sign(
            { userId },
            privateKEY,
            { algorithm: "RS256", expiresIn: "12h", }
        )
        return Promise.resolve({ code: 0, token })
    } catch (error) {
        console.log(error);
        return Promise.reject({ code: 0, messaage: "寫入失敗" })
    }

}

async function userLogin({ userId, pwd }) {
    await sequelize.sync()

}

module.exports = {
    createUser,
    userLogin
}