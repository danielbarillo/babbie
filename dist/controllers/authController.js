"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mockData_1 = require("../utils/mockData");
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = mockData_1.mockUsers.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Felaktig e-postadress eller lösenord'
            });
        }
        // I mockdata, låtsas att alla lösenord är "password"
        const token = jsonwebtoken_1.default.sign({ _id: user._id, username: user.username }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
        res.json({
            status: 'success',
            data: {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    avatarColor: user.avatarColor
                }
            }
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Ett fel uppstod vid inloggning'
        });
    }
};
exports.login = login;
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (mockData_1.mockUsers.some(u => u.email === email)) {
            return res.status(400).json({
                status: 'error',
                message: 'E-postadressen är redan registrerad'
            });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = {
            _id: (mockData_1.mockUsers.length + 1).toString(),
            username,
            email,
            avatarColor: `bg-${['blue', 'green', 'red', 'purple'][Math.floor(Math.random() * 4)]}-500`,
            isOnline: true
        };
        mockData_1.mockUsers.push(newUser);
        const token = jsonwebtoken_1.default.sign({ _id: newUser._id, username: newUser.username }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
        res.status(201).json({
            status: 'success',
            data: {
                token,
                user: {
                    id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    avatarColor: newUser.avatarColor
                }
            }
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Ett fel uppstod vid registrering'
        });
    }
};
exports.register = register;
