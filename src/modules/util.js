const _ = require('lodash')
function replaceDotToDash(str) {
	return str.replace('.', '-')
}

const generateRandomID = () => Math.random().toString(36).slice(2)

function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		var r = (Math.random() * 16) | 0,
			v = c == 'x' ? r : (r & 0x3) | 0x8 // (5)
		return v.toString(16) // (6)
	})
}

module.exports = {
	replaceDotToDash,
	generateRandomID,
	uuidv4,
}
