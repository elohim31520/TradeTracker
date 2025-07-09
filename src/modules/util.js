const _ = require('lodash')

const generateRandomID = () => Math.random().toString(36).slice(2)

function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		var r = (Math.random() * 16) | 0,
			v = c == 'x' ? r : (r & 0x3) | 0x8 // (5)
		return v.toString(16) // (6)
	})
}

function deleteFolderRecursive(myPath) {
	if (fs.existsSync(myPath)) {
		fs.readdirSync(myPath).forEach((file, index) => {
			const curPath = path.join(myPath, file)
			if (fs.lstatSync(curPath).isDirectory()) {
				// recurse
				deleteFolderRecursive(curPath)
			} else {
				// delete file
				fs.unlinkSync(curPath)
			}
		})
		fs.rmdirSync(myPath)
		console.log('已刪除: ', myPath)
	}
}

module.exports = {
	generateRandomID,
	uuidv4,
}
