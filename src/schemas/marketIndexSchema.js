const Joi = require('joi')

const getLastOneSchema = Joi.object({
    symbol: Joi.string().required().min(1)
})

const getByDaysSchema = Joi.object({
    days: Joi.number().integer().min(1).required()
})

module.exports = {
    getLastOneSchema,
    getByDaysSchema
} 