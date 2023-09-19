module.exports = (err, req, res, next) => {
	const tmp = String(err.message)
	const statusCode = tmp.slice(0, 3),
		myCode = tmp.slice(3, 6) || ''
	let myMsg

	let httpStatusMsgMap = {
		400: "Bad Request",
		401: "Unauthorized",
		403: "access denied",
		409: 'Conflict',
		500: "Internal Error"
	},
		httpMsg = httpStatusMsgMap[statusCode],
		myMsgMqp = {
			'100': '帳號或密碼錯誤',
			'101': '此loginId已被使用'
		}
	if(myCode) myMsg = myMsgMqp[myCode] || ''
	res.status(+statusCode).json({ error: httpMsg, message: myMsg, code: +myCode })
	next(err);
}