module.exports = (err, req, res, next) => {
	const code = Number(err.message),
		errMap = {
			400: "Bad Request",
			403: "access denied"
		},
		msg = errMap[code]
	
	
	res.status(code).json({ error: msg });
	next(err);
}