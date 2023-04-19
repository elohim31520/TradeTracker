const Users = require("../../modal/user")
const sequelize = require("../../js/connect");
const { md5Encode, generateSalt, sha256 } = require("../../js/util");
const { generateToken } = require("../../js/crypto")

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

        return Promise.resolve({ code: 1, token: generateToken({ userId }) })

    } catch (error) {
        console.log(error);
        return Promise.reject({ code: 0, messaage: "寫入失敗" })
    }

}

async function userLogin({ userId, pwd }) {
    try {
        await sequelize.sync()
        const md5 = md5Encode(userId)
        const user = await Users.findOne({ where: { md5_userId: md5 } })
        const { salt, pwd: storeHash } = user.dataValues
        if (!user) return Promise.reject({ code: -1, messaage: "帳號或密碼錯誤" })

        const currentHash = sha256(pwd, salt)
        if (currentHash != storeHash) return Promise.reject({ code: -2, messaage: "帳號或密碼錯誤" })
        return { code: 1, token: generateToken({ userId }) }

    } catch (e) {
        console.log(e);
        return Promise.reject({ code: 0, messaage: "登入失敗", error: e })
    }

}

module.exports = {
    createUser,
    userLogin
}