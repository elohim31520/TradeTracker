export default {
	SUCCESS: { code: 200, message: '成功' },
	MISSING_PARAMS: { code: 401, message: '缺少參數' },
	UNAUTHORIZED: { code: 400, message: '請先登入' },
	SERVER_ERROR: { code: 500, message: '伺服器錯誤' },
	DUPLICATE_ACCOUNT: { code: 409, message: '帳號已存在' }
}
