"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = exports.attachUserState = exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
// Helper function to check if user is authenticated
const isAuthenticated = (userState) => {
    return userState.type === 'authenticated';
};
exports.isAuthenticated = isAuthenticated;
// Middleware to attach user state - either authenticated or guest
const attachUserState = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            req.userState = { type: 'guest' };
            return next();
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await User_1.User.findById(decoded.userId).select('_id username email');
        if (!user) {
            req.userState = { type: 'guest' };
            return next();
        }
        const userState = {
            _id: user._id.toString(),
            username: user.username,
            email: user.email,
            type: 'authenticated'
        };
        req.userState = userState;
        req.user = { _id: userState._id };
        next();
    }
    catch (error) {
        console.error('Token verification error:', error);
        req.userState = { type: 'guest' };
        next();
    }
};
exports.attachUserState = attachUserState;
// Middleware to require authentication
const requireAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await User_1.User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        const userState = {
            _id: user._id.toString(),
            username: user.username,
            email: user.email,
            type: 'authenticated'
        };
        req.userState = userState;
        req.user = { _id: userState._id };
        next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};
exports.requireAuth = requireAuth;
