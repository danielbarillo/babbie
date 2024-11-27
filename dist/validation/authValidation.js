"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = exports.loginSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email()
        .required()
        .messages({
        'string.email': 'Ogiltig e-postadress',
        'any.required': 'E-postadress krävs'
    }),
    password: joi_1.default.string()
        .min(6)
        .required()
        .messages({
        'string.min': 'Lösenordet måste vara minst 6 tecken',
        'any.required': 'Lösenord krävs'
    })
});
exports.registerSchema = joi_1.default.object({
    username: joi_1.default.string()
        .min(3)
        .max(30)
        .required()
        .messages({
        'string.min': 'Användarnamnet måste vara minst 3 tecken',
        'string.max': 'Användarnamnet får inte vara längre än 30 tecken',
        'any.required': 'Användarnamn krävs'
    }),
    email: joi_1.default.string()
        .email()
        .required()
        .messages({
        'string.email': 'Ogiltig e-postadress',
        'any.required': 'E-postadress krävs'
    }),
    password: joi_1.default.string()
        .min(6)
        .required()
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)/)
        .messages({
        'string.min': 'Lösenordet måste vara minst 6 tecken',
        'string.pattern.base': 'Lösenordet måste innehålla minst en bokstav och en siffra',
        'any.required': 'Lösenord krävs'
    })
});
