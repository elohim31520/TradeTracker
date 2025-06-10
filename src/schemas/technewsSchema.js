const Joi = require('joi')

const getByIdSchema = Joi.object({
    id: Joi.string().required()
})

const getAllSchema = Joi.object({
    keyword: Joi.string().min(1).allow('', null),
    page: Joi.number().integer().min(1).default(1),
    size: Joi.number().integer().min(1).max(100).default(10)
})

module.exports = {
    getByIdSchema,
    getAllSchema,
} 