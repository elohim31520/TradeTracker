const User = require("../../modal/user")
const sequelize = require("../../js/connect");
const {md5Encode ,generateRandomID} = require("../../js/util");


function createUser ({loginId ,password: pass_word}){
    return sequelize.sync().then(() => {
        const md5 = md5Encode(loginId)
        return User.findOne({where: {md5}}).then(res =>{
            console.log(res);
            if(res) return Promise.reject({code: 0 ,msg: "loginId重覆了"})
            return User.create({
                userId: generateRandomID(),
                md5,
                loginId,
                pass_word,
            })
        })
    })
}

function userLogin (){
    
}

module.exports = {
    createUser,
    userLogin
}