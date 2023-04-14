const express = require('express')
require('dotenv').config()

const { sqlQueryEearningscall } = require("./crud/news");
const app = express()
const path = require('path');
const news = require('./routes/news')
const records = require('./routes/records')
const cors = require('cors');
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
    }).catch(e => console.log(e))
})

app.use('/news', news)
app.use('/records', records)
app.use('/user', require('./routes/user'))

app.listen(1234, () => {
    console.log(`server listen on: localhost:1234`);
})