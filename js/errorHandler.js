module.exports = (err, req, res, next) => {
	const code = Number(err.message)
	let errMap = {
		400: "Bad Request",
		401: "Unauthorized",
		403: "access denied",
		500: "Internal Error"
	},
		msg = errMap[code]
	res.status(code).json({ error: msg })
	next(err);
}