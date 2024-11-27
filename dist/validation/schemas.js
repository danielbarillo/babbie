"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemas = void 0;
const joi_1 = __importDefault(require("joi"));
exports.schemas = {
    auth: {
        login: joi_1.default.object({
            email: joi_1.default.string()
                .email()
                .required()
                .messages({
                'string.email': 'Please enter a valid email address',
                'string.empty': 'Email is required',
                'any.required': 'Email is required'
            }),
            password: joi_1.default.string()
                .required()
                .messages({
                'string.empty': 'Password is required',
                'any.required': 'Password is required'
            })
        }),
        register: joi_1.default.object({
            username: joi_1.default.string()
                .min(3)
                .max(30)
                .required()
                .messages({
                'string.min': 'Username must be at least 3 characters long',
                'string.max': 'Username cannot exceed 30 characters',
                'string.empty': 'Username is required',
                'any.required': 'Username is required'
            }),
            email: joi_1.default.string()
                .email()
                .required()
                .messages({
                'string.email': 'Please enter a valid email address',
                'string.empty': 'Email is required',
                'any.required': 'Email is required'
            }),
            password: joi_1.default.string()
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
        create: joi_1.default.object({
            content: joi_1.default.string()
                .trim()
                .min(1)
                .max(500)
                .required()
                .messages({
                'string.empty': 'Message cannot be empty',
                'string.min': 'Message cannot be empty',
                'string.max': 'Message cannot exceed 500 characters'
            })
        })
    },
    channel: {
        create: joi_1.default.object({
            name: joi_1.default.string()
                .min(3)
                .max(30)
                .required()
                .messages({
                'string.min': 'Channel name must be at least 3 characters long',
                'string.max': 'Channel name cannot exceed 30 characters',
                'string.empty': 'Channel name is required'
            }),
            isPrivate: joi_1.default.boolean().default(false),
            description: joi_1.default.string().max(200).allow('').messages({
                'string.max': 'Description cannot exceed 200 characters'
            })
        })
    },
    directMessage: {
        create: joi_1.default.object({
            content: joi_1.default.string()
                .trim()
                .min(1)
                .max(500)
                .required()
                .messages({
                'string.empty': 'Message cannot be empty',
                'string.min': 'Message cannot be empty',
                'string.max': 'Message cannot exceed 500 characters'
            }),
            recipientId: joi_1.default.string()
                .required()
                .messages({
                'string.empty': 'Recipient is required',
                'any.required': 'Recipient is required'
            })
        })
    }
};
