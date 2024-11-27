"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const channelRoutes_1 = __importDefault(require("./channelRoutes"));
const messageRoutes_1 = __importDefault(require("./messageRoutes"));
const directMessageRoutes_1 = __importDefault(require("./directMessageRoutes"));
const router = (0, express_1.Router)();
router.use('/auth', authRoutes_1.default);
router.use('/channels', channelRoutes_1.default);
router.use('/messages', messageRoutes_1.default);
router.use('/dm', directMessageRoutes_1.default);
exports.default = router;
