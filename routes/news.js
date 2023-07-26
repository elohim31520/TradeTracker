const express = require('express')
const router = express.Router()
const { sqlQuerySingleCompanyNews, sqlQueryTodayNews, sqlQueryRange, sqlQuerySubscriptionNews } = require("../crud/news");

router.post("/subscription", (req, res) => {
	sqlQuerySubscriptionNews(req.body).then(resp => {
		res.json(resp)
	})
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
		sqlQueryRange(3).then(resp => {
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