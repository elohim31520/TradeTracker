const express = require('express')
const router = express.Router()
const { createUser } = require("../crud/user");

router.post("/register", async (req, res) => {
    try {
        const resp = await createUser(req.body)
        res.json(resp)
    } catch (e) {
        console.warn(e);
        res.json({ code: 0, msg: e.msg })
    }
})

module.exports = router