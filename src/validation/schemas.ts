import Joi from 'joi';

export const schemas = {
  auth: {
    login: Joi.object({
      username: Joi.string().required(),
      password: Joi.string().min(6).required()
    }),
    register: Joi.object({
      username: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required()
    })
  },
  message: {
    create: Joi.object({
      content: Joi.string()
        .trim()
        .min(1)
        .max(500)
        .required()
        .messages({
          'string.empty': 'Message cannot be empty',
          'string.max': 'Message cannot exceed 500 characters'
        })
    })
  },
  channel: {
    create: Joi.object({
      name: Joi.string().min(3).max(30).required(),
      isPrivate: Joi.boolean().default(false),
      description: Joi.string().max(200)
    })
  }
};