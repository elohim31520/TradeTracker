const express = require('express')
const router = express.Router()
const {createUser} = require("../crud/user/index.js");

router.post("/register" ,(req ,res) => {
    createUser(req.body).then(() => {
        res.json({code: 1 ,msg: "success"})
    }).catch(e =>{
        console.warn(e);
        res.json({code: 0,msg: e.msg})
    })
})

module.exports = router