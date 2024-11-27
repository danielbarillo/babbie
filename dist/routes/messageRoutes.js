"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const Message_1 = require("../models/Message");
const Channel_1 = require("../models/Channel");
const validate_1 = require("../middleware/validate");
const schemas_1 = require("../validation/schemas");
const mongoose_1 = __importDefault(require("mongoose"));
const router = (0, express_1.Router)();
// Get messages for a channel
router.get('/channel/:channelId', auth_1.attachUserState, async (req, res) => {
    try {
        const channel = await Channel_1.Channel.findById(req.params.channelId);
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }
        // Check if channel is private and user is authenticated and a member
        if (channel.isPrivate) {
            if (!req.userState || !(0, auth_1.isAuthenticated)(req.userState)) {
                return res.status(401).json({ message: 'Authentication required' });
            }
            const userId = new mongoose_1.default.Types.ObjectId(req.userState._id);
            if (!channel.members.some(id => id.equals(userId))) {
                return res.status(403).json({ message: 'Access denied' });
            }
        }
        const messages = await Message_1.Message.find({ channel: req.params.channelId })
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('sender', 'username')
            .exec();
        res.json(messages);
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
});
// Send a message to a channel
router.post('/channel/:channelId', auth_1.attachUserState, (0, validate_1.validate)(schemas_1.schemas.message.create), async (req, res) => {
    try {
        if (!req.userState) {
            return res.status(401).json({ message: 'User state is required' });
        }
        const channel = await Channel_1.Channel.findById(req.params.channelId);
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }
        // For private channels, require authentication
        if (channel.isPrivate) {
            if (!(0, auth_1.isAuthenticated)(req.userState)) {
                return res.status(401).json({ message: 'Authentication required for private channels' });
            }
            const userId = new mongoose_1.default.Types.ObjectId(req.userState._id);
            if (!channel.members.some(id => id.equals(userId))) {
                return res.status(403).json({ message: 'Access denied' });
            }
        }
        // Create message with appropriate sender info
        const messageData = {
            content: req.body.content,
            channel: new mongoose_1.default.Types.ObjectId(req.params.channelId),
            sender: (0, auth_1.isAuthenticated)(req.userState)
                ? new mongoose_1.default.Types.ObjectId(req.userState._id)
                : { username: 'Guest', type: 'guest' }
        };
        const message = new Message_1.Message(messageData);
        await message.save();
        // Only populate sender if it's a reference to a User
        if ((0, auth_1.isAuthenticated)(req.userState)) {
            await message.populate('sender', 'username');
        }
        res.status(201).json(message);
    }
    catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Error sending message' });
    }
});
exports.default = router;
