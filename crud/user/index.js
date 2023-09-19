const Users = require("../../modal/user")
const sequelize = require("../../js/connect");
const { generateToken, md5Encode, generateSalt, sha256 } = require("../../js/crypto")

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
        if (!user) throw new Error(401100)

        const currentHash = sha256(pwd, salt)
        if (currentHash != storeHash) throw new Error(401100)
        return { code: 1, token: generateToken({ userId }) }

    } catch (e) {
		console.log(e);
        throw new Error(401100)
    }

}

module.exports = {
    createUser,
    userLogin
}