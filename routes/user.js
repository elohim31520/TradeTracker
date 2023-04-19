const express = require('express')
const router = express.Router()
const { createUser, userLogin } = require("../crud/user");

router.post("/register", async (req, res) => {
    try {
        const resp = await createUser(req.body)
        res.json(resp)
    } catch (e) {
        res.json(e)
    }
})

router.post("/login", async (req, res) => {
    try {
        const resp = await userLogin(req.body)
        res.json(resp)
    } catch (e) {
        res.json(e)
    }
})

module.exports = router