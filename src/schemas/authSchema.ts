const Joi = require('joi')

const registerSchema = Joi.object({
	name: Joi.string().alphanum().min(3).max(30).required().messages({
		'string.base': '用戶名稱應為文字格式',
		'string.empty': '用戶名稱不能為空',
		'string.min': '用戶名稱長度至少需為 3 個字元',
		'string.max': '用戶名稱長度最多為 30 個字元',
		'any.required': '用戶名稱為必填欄位',
		'string.alphanum': '用戶名稱只能包含英文字母、數字',
	}),
	pwd: Joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:\'",.<>/?]{6,30}$')).required().messages({
		'string.pattern.base': '密碼長度需為 6-30 個字元，且只能包含英文字母、數字或特殊符號',
		'string.empty': '密碼不能為空',
		'any.required': '密碼為必填欄位',
		'string.alphanum': '密碼只能包含英文字母、數字或特殊符號',
	}),
	email: Joi.string().email().required().messages({
		'string.email': '請提供有效的電子郵件地址',
		'string.empty': '電子郵件不能為空',
		'any.required': '電子郵件為必填欄位',
	}),
})

const loginSchema = Joi.object({
	name: Joi.string().alphanum().min(3).max(30).required().messages({
		'string.base': '用戶名稱應為文字格式',
		'string.empty': '用戶名稱不能為空',
		'string.min': '用戶名稱長度至少需為 3 個字元',
		'string.max': '用戶名稱長度最多為 30 個字元',
		'any.required': '用戶名稱為必填欄位',
		'string.alphanum': '用戶名稱只能包含英文字母、數字',
	}),
	pwd: Joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:\'",.<>/?]{6,30}$')).required().messages({
		'string.pattern.base': '密碼長度需為 6-30 個字元，且只能包含英文字母、數字或特殊符號',
		'string.empty': '密碼不能為空',
		'any.required': '密碼為必填欄位',
		'string.alphanum': '密碼只能包含英文字母、數字或特殊符號',
	}),
})

export { registerSchema, loginSchema }
