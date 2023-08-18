const express = require('express')
const router = express.Router()
const { sqlQuerySingleCompanyNews, sqlQueryTodayNews, sqlQueryRange, sqlQuerySubscriptionNews } = require("../crud/news");
const newsModel = require("../crud/news");
const { verifyToken } = require('../js/middleware');

router.post("/subscription", verifyToken, (req, res) => {
	sqlQuerySubscriptionNews(req.body).then(data => {
		res.json(data)
	})
})

router.post("/queryall", async (req, res) => {
	try {
		const data = await newsModel.sqlQueryRange({ method: req.method, body: req.body })
		res.json(data)
	} catch (e) {
		res.json({ message: e.message })
	}
})

router.get("/:param", (req, res) => {
	const queryParam = req.params.param

	if (queryParam == "today") {
		sqlQueryTodayNews().then(resp => {
			res.render("index", {
				news: resp || [{ title: "Not found" }]
			});
		})
	} else if (queryParam == "3days") {
		sqlQueryRange().then(resp => {
			res.render("index", {
				news: resp || [{ title: "Not found" }]
			});
		})
	} else if (typeof queryParam == "string") {
		sqlQuerySingleCompanyNews(queryParam).then(resp => {
			res.render("index", {
				news: resp || [{ title: "Not found" }]
			});
		})
	}
})

module.exports = router