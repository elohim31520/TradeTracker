const express = require('express')
const router = express.Router()
const newsModel = require('../crud/news')
const { verifyToken } = require('../middleware/auth')

router.post('/subscription', verifyToken, async (req, res) => {
	let data = await newsModel.sqlQuerySubscriptionNews(req.body)
	res.json(data)
})

router.post('/queryall', async (req, res) => {
	const data = await newsModel.sqlQueryAll(req.body)
	res.json(data)
})

// router.get("/:param", (req, res) => {
// 	const queryParam = req.params.param
// 	const queryTitle = req.query.title

// 	if (queryParam == "today") {
// 		newsModel.sqlQueryRange(queryTitle).then(resp => {
// 			res.render("index", {
// 				news: resp || [{ title: "Not found" }]
// 			});
// 		})
// 	} else if (queryParam == "3days") {
// 		newsModel.sqlQueryRange().then(resp => {
// 			res.render("index", {
// 				news: resp || [{ title: "Not found" }]
// 			});
// 		})
// 	} else if (typeof queryParam == "string") {
// 		sqlQuerySingleCompanyNews(queryParam, queryTitle).then(resp => {
// 			res.render("index", {
// 				news: resp || [{ title: "Not found" }]
// 			});
// 		})
// 	}
// })

module.exports = router
