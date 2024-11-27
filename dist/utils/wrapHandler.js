"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapAuthHandler = exports.wrapHandler = void 0;
const wrapHandler = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        }
        catch (error) {
            next(error);
        }
    };
};
exports.wrapHandler = wrapHandler;
const wrapAuthHandler = (handler) => {
    return async (req, res, next) => {
        try {
            const result = await handler(req, res);
            if (result)
                return result;
        }
        catch (error) {
            next(error);
        }
    };
};
exports.wrapAuthHandler = wrapAuthHandler;
