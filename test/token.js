const fs = require('fs')
const path = require('path')

let token = ''
const t_parh = path.join(__dirname, './token.txt')
try {
    const data = fs.readFileSync(t_parh, 'utf8');
    token = data
} catch (err) {
    console.error('讀取檔案時發生錯誤:', err);
}

const headers = {
	headers: {
		authorization: `Bearer ${token}`,
	},
}

module.exports = {
	token,
	headers
}