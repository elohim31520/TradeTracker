const express = require('express')
const router = express.Router()
const { sqlWrite, sqlQuerySingleCompanyNews, sqlCreateStatements, sqlQuerEearningscall, sqlQueryTodayNews } = require("../crud/index");

router.get("/:param", (req, res) => {
    const queryParam = req.params.param 

    if(queryParam == "today"){
        sqlQueryTodayNews().then(resp => {
            res.render("index", {
                news: resp || [{ title: "Not found" }]
            });
        })
    }
    else if (typeof queryParam == "string") {
        sqlQuerySingleCompanyNews(queryParam).then(resp => {
            res.render("index", {
                news: resp || [{ title: "Not found" }]
            });
        })
    }
})

module.exports = router