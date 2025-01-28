import Joi from 'joi';

export const schemas = {
  auth: {
    login: Joi.object({
      username: Joi.string()
        .required()
        .messages({
          'string.empty': 'Username is required',
          'any.required': 'Username is required'
        }),
      password: Joi.string()
        .required()
        .messages({
          'string.empty': 'Password is required',
          'any.required': 'Password is required'
        })
    }),
    register: Joi.object({
      username: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
          'string.min': 'Username must be at least 3 characters long',
          'string.max': 'Username cannot exceed 30 characters',
          'string.empty': 'Username is required',
          'any.required': 'Username is required'
        }),
      email: Joi.string()
        .email()
        .required()
        .messages({
          'string.email': 'Please enter a valid email address',
          'string.empty': 'Email is required',
          'any.required': 'Email is required'
        }),
      password: Joi.string()
        .min(6)
        .required()
        .messages({
          'string.min': 'Password must be at least 6 characters long',
          'string.empty': 'Password is required',
          'any.required': 'Password is required'
        })
    })
  },
  message: {
    create: Joi.object({
      content: Joi.string().required().trim().max(1000),
      guestName: Joi.string().optional()
    })
  },
  channel: {
    create: Joi.object({
      name: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
          'string.min': 'Channel name must be at least 3 characters long',
          'string.max': 'Channel name cannot exceed 30 characters',
          'string.empty': 'Channel name is required'
        }),
      isPrivate: Joi.boolean().default(false),
      isRestricted: Joi.boolean().default(false),
      description: Joi.string().max(200).allow('').messages({
        'string.max': 'Description cannot exceed 200 characters'
      })
    })
  },
  directMessage: {
    create: Joi.object({
      content: Joi.string()
        .trim()
        .min(1)
        .max(500)
        .required()
        .messages({
          'string.empty': 'Message cannot be empty',
          'string.min': 'Message cannot be empty',
          'string.max': 'Message cannot exceed 500 characters'
        }),
      recipientId: Joi.string()
        .required()
        .messages({
          'string.empty': 'Recipient is required',
          'any.required': 'Recipient is required'
        })
    })
  }
};