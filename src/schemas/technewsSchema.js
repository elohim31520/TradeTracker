const Joi = require('joi')

const getByIdSchema = Joi.object({
    id: Joi.string().required()
})

const getAllSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    size: Joi.number().integer().min(1).max(100).default(10)
})

const searchByKeywordSchema = Joi.object({
    keyword: Joi.string().required().min(1)
})

module.exports = {
    getByIdSchema,
    getAllSchema,
    searchByKeywordSchema
} 