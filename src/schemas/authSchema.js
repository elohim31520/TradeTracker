const Joi = require('joi');

const registerSchema = Joi.object({
	user_name: Joi.string().alphanum().min(3).max(30).required().messages({
		'string.base': 'Username should be a type of text',
		'string.empty': 'Username cannot be an empty field',
		'string.min': 'Username should have a minimum length of 3',
		'string.max': 'Username should have a maximum length of 30',
		'any.required': 'Username is a required field',
	}),
	pwd: Joi.string()
		.pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:\'",.<>/?]{6,30}$'))
		.required()
		.messages({
			'string.pattern.base': 'Password must be 6-30 characters long and contain only letters, numbers, or special characters',
			'string.empty': 'Password cannot be an empty field',
			'any.required': 'Password is a required field',
		}),
	email: Joi.string().email().required().messages({
		'string.email': 'Please provide a valid email address',
		'string.empty': 'Email cannot be an empty field',
		'any.required': 'Email is a required field',
	}),
});

const loginSchema = Joi.object({
	user_name: Joi.string().alphanum().min(3).max(30).required().messages({
		'string.base': 'Username should be a type of text',
		'string.empty': 'Username cannot be an empty field',
		'string.min': 'Username should have a minimum length of 3',
		'string.max': 'Username should have a maximum length of 30',
		'any.required': 'Username is a required field',
	}),
	pwd: Joi.string()
		.pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:\'",.<>/?]{6,30}$'))
		.required()
		.messages({
			'string.pattern.base': 'Password must be 6-30 characters long and contain only letters, numbers, or special characters',
			'string.empty': 'Password cannot be an empty field',
			'any.required': 'Password is a required field',
		}),
});

module.exports = {
	registerSchema,
	loginSchema,
}
