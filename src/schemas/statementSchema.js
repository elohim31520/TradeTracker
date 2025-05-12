const Joi = require('joi')

const getBySymbolSchema = Joi.object({
    symbol: Joi.string().required().min(1)
})

module.exports = {
    getBySymbolSchema
} 