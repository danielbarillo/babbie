"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemas = void 0;
const joi_1 = __importDefault(require("joi"));
exports.schemas = {
    channel: joi_1.default.object({
        name: joi_1.default.string().required().min(2).max(30),
        isPrivate: joi_1.default.boolean().required()
    }),
    message: joi_1.default.object({
        content: joi_1.default.string().required().max(2000),
        channelId: joi_1.default.string().required()
    }),
    auth: {
        register: joi_1.default.object({
            username: joi_1.default.string().required().min(3).max(30),
            email: joi_1.default.string().required().email(),
            password: joi_1.default.string().required().min(6)
        }),
        login: joi_1.default.object({
            email: joi_1.default.string().required().email(),
            password: joi_1.default.string().required()
        })
    }
};
