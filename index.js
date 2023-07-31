const express = require('express')
require('dotenv').config()

if(process.env.DEBUG_MODE){
	console.log("in debug mode");
}

const { sqlQueryEearningscall } = require("./crud/news");
const app = express()
const path = require('path');
const cors = require('cors');
const logger = require("./logger")
require('./js/crawler')
app.use(cors());

// 配置解析表单请求体，类型为：application/app
app.use(express.json())
// 解析表单请求体，类型为：application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set("views", path.resolve(__dirname, "views"));

app.get('/', function (req, res) {
    res.send('請求路徑:  /data')
})

app.get('/earningscall', (req, res) => {
    sqlQueryEearningscall().then(resp => {
        res.render("index", {
            news: resp[0] || [{ title: "Not found" }]
        });
    })
})

app.use('/news', require('./routes/news'))
app.use('/records/buy', require('./routes/records/buy'))
app.use('/records/holding', require('./routes/records/holding'))
app.use('/records/sell', require('./routes/records/sell'))
app.use('/users', require('./routes/user'))
app.use('/favorite', require('./routes/favorite'))

app.listen(1234, () => {
	logger.info(`Server Restart`)
    console.log(`server listen on: localhost:1234`);
})