const Joi = require('joi')

const createCommentSchema = Joi.object({
    content: Joi.string().required().min(1).max(1000),
    postId: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
    toUserId: Joi.alternatives().try(Joi.string(), Joi.number()).allow(null, ''),
    parentId: Joi.alternatives().try(Joi.string(), Joi.number()).allow(null, '')
})

const updateCommentSchema = Joi.object({
    content: Joi.string().required().min(1).max(1000)
})

const getByIdSchema = Joi.object({
    id: Joi.string().required()
})

const getByPostIdSchema = Joi.object({
    postId: Joi.string().required()
})

const getByParentIdSchema = Joi.object({
    parentId: Joi.string().required()
})

const commentPaginationSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    size: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().valid('createdAt', 'updatedAt').default('createdAt'),
    order: Joi.string().valid('ASC', 'DESC').default('DESC')
})

module.exports = {
    createCommentSchema,
    updateCommentSchema,
    getByIdSchema,
    getByPostIdSchema,
    getByParentIdSchema,
    commentPaginationSchema
} 