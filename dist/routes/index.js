"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const channelRoutes_1 = __importDefault(require("./channelRoutes"));
const messageRoutes_1 = __importDefault(require("./messageRoutes"));
const directMessageRoutes_1 = __importDefault(require("./directMessageRoutes"));
const router = (0, express_1.Router)();
// Health check
router.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
// Auth routes (/api/auth/*)
router.use('/auth', auth_1.default);
// Channel routes (/api/channels/*)
router.use('/channels', channelRoutes_1.default);
// Message routes (/api/messages/*)
router.use('/messages', messageRoutes_1.default);
// Direct message routes (/api/dm/*)
router.use('/dm', directMessageRoutes_1.default);
exports.default = router;
