const express = require('express')
const router = express.Router()
const { sqlGet, sqlUpdate, sqlCreate, sqlDelete, sqlGetAvg, sqlBulkCreate } = require("../crud/records/index.js");
const { verifyToken } = require("../js/middleware")

router.get("/:userId", (req, res) => {
    const id = req.params.userId
    if (!id) {
        res.json({ code: 0, msg: "缺少參數" })
        return
    }
    sqlGet(id).then(resp => {
        res.json(resp)
    })
})

router.post("/add", (req, res) => {
    // const {userId ,share ,price ,company ,dividend ,total ,open_time} = req.body.data
    sqlCreate(req.body).then(() => {
        res.json({ code: 0, msg: "寫入成功" })
    })
        .catch(e => {
            console.error('SQL寫入records失敗 : ', e);
            res.json({ code: 0, msg: "寫入失敗" })
        })
})

router.post("/bulkcreate", (req, res) => {
    sqlBulkCreate(req.body).then(() => {
        res.json({ code: 0, msg: "寫入成功" })
    })
        .catch(e => {
            console.error('SQL寫入records失敗 : ', e);
            res.json({ code: 0, msg: "寫入失敗" })
        })
})

router.delete("/del/:id", async (req, res) => {
    const { id } = req.params
    if (!id) {
        res.json({ code: 0, msg: "缺少參數" })
        return
    }
    try {
        await sqlDelete(id)
        res.json({ code: 1, msg: "刪除成功" })
    } catch (error) {
        console.error('SQL刪除records失敗 : ', e);
        res.json({ code: 0, msg: "刪除失敗" })
    }
})

router.put("/put", (req, res) => {
    if (!req.body.data.id) {
        res.json({ code: 0, msg: "缺少參數 - id" })
        return
    }
    sqlUpdate(req.body.data).then(resp => {
        res.json({ code: 1, msg: "更新成功" })
    })
        .catch(e => {
            console.error('SQL更新records失敗 : ', e);
            res.json({ code: 0, msg: "更新失敗" })
        })
})

router.post("/avg", verifyToken, async (req, res) => {
    const { userId } = req.body
    if (!userId) {
        res.json({ code: -1, msg: "缺少參數" })
        return
    }
    try {
        const resp = await sqlGetAvg(userId)
        res.json(resp)
    } catch (error) {
        console.log(error);
        console.log('query 平均失敗');
    }
})

module.exports = router