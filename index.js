const express = require('express')
require('dotenv').config()
require('express-async-errors');

const app = express()
const path = require('path');
const cors = require('cors');
const logger = require("./logger")
const errorHandler = require('./js/errorHandler')
require('./js/crawler')
app.use(cors());

if (process.env.DEBUG_MODE) {
	logger.info("In debug mode")
}

// 配置解析表单请求体，类型为：application/app
app.use(express.json())
// 解析表单请求体，类型为：application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set("views", path.resolve(__dirname, "views"));

app.get('/', function (req, res) {
	throw Error(403);
})

app.use('/news', require('./routes/news'))
app.use('/transaction/purchases', require('./routes/records/buy'))
app.use('/transactions/holdings', require('./routes/records/holding'))
app.use('/transaction/sales', require('./routes/records/sell'))
app.use('/users', require('./routes/user'))
app.use('/favorite', require('./routes/favorite'))

app.use(errorHandler);

app.listen(1234, () => {
	logger.info('Server start!')
})