const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path')
const htmlPath = path.join(__dirname, 'msft.html');

const htmlContent = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(htmlContent);

// 选择包含数据的 table
const targetTable = $('.row .col-lg-7 .table');
const tdObject = {}

targetTable.find('tbody tr').each((index, element) => {
	// 获取当前 tr 元素下的所有 td 元素
	const tds = $(element).find('td');

	// 提取第一个和第三个 td 的文本内容，作为键值对添加到对象中
	const key1 = $(tds[0]).text().trim();
	const value1 = $(tds[1]).text().trim();
	const key2 = $(tds[2]).text().trim();
	const value2 = $(tds[3]).text().trim();

	// 将键值对添加到对象中
	if (key1) tdObject[key1] = value1;
	if (key2) tdObject[key2] = value2;
});

// 输出所有 td 值
// console.log(tdObject);

const keymap = {
	'P/E (Trailing)': 'PE_Trailing',
	'P/E (Forward)': 'PE_Forward',
	'EPS (Trailing)': 'EPS_Trailing',
	'Prev Close': 'price',
	'EPS (Forward)': 'EPS_Forward',
	Volume: 'volume',
	'Market Cap': 'marketCap',
}

const newObj = {}

for (const key in tdObject) {
	if(keymap.hasOwnProperty(key)){
		let newkey = keymap[key]
		newObj[newkey] = tdObject[key]
	}
}
console.log(newObj);

// id           | int           | NO   | PRI | NULL    | auto_increment |
// | symbo        | varchar(255)  | NO   |     | NULL    |                |
// | price        | decimal(10,0) | YES  |     | NULL    |                |
// | PE_Trailing  | decimal(10,0) | YES  |     | NULL    |                |
// | PE_Forward   | decimal(10,0) | YES  |     | NULL    |                |
// | EPS_Trailing | decimal(10,0) | YES  |     | NULL    |                |
// | EPS_Forward  | decimal(10,0) | YES  |     | NULL    |                |
// | volume       | int           | YES  |     | NULL    |                |
// | marketCap    | varchar(255)  | YES  |     | NULL    |                |
// | createdAt    | datetime      | NO   |     | NULL    |                |
// | updatedAt 