"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const DirectMessage_1 = require("../models/DirectMessage");
const User_1 = require("../models/User");
const validate_1 = require("../middleware/validate");
const schemas_1 = require("../validation/schemas");
const mongoose_1 = __importDefault(require("mongoose"));
const router = (0, express_1.Router)();
// Get all DM conversations for the authenticated user
router.get('/conversations', auth_1.requireAuth, async (req, res) => {
    try {
        if (!req.userState || !(0, auth_1.isAuthenticated)(req.userState)) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const userId = new mongoose_1.default.Types.ObjectId(req.userState._id);
        // Find all unique conversations
        const conversations = await DirectMessage_1.DirectMessage.aggregate([
            {
                $match: {
                    $or: [
                        { sender: userId },
                        { recipient: userId }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ['$sender', userId] },
                            '$recipient',
                            '$sender'
                        ]
                    },
                    lastMessage: { $first: '$$ROOT' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    _id: 1,
                    username: '$user.username',
                    lastMessage: 1
                }
            }
        ]);
        res.json(conversations);
    }
    catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ message: 'Error fetching conversations' });
    }
});
// Get messages between two users
router.get('/:userId', auth_1.requireAuth, async (req, res) => {
    try {
        if (!req.userState || !(0, auth_1.isAuthenticated)(req.userState)) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const currentUserId = new mongoose_1.default.Types.ObjectId(req.userState._id);
        const otherUserId = new mongoose_1.default.Types.ObjectId(req.params.userId);
        // Verify other user exists
        const otherUser = await User_1.User.findById(otherUserId);
        if (!otherUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Get messages between the two users
        const messages = await DirectMessage_1.DirectMessage.find({
            $or: [
                { sender: currentUserId, recipient: otherUserId },
                { sender: otherUserId, recipient: currentUserId }
            ]
        })
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('sender', 'username')
            .populate('recipient', 'username');
        res.json(messages);
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
});
// Send a direct message
router.post('/', auth_1.requireAuth, (0, validate_1.validate)(schemas_1.schemas.directMessage.create), async (req, res) => {
    try {
        if (!req.userState || !(0, auth_1.isAuthenticated)(req.userState)) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const { content, recipientId } = req.body;
        // Verify recipient exists
        const recipient = await User_1.User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: 'Recipient not found' });
        }
        // Create and save the message
        const message = new DirectMessage_1.DirectMessage({
            content,
            sender: new mongoose_1.default.Types.ObjectId(req.userState._id),
            recipient: new mongoose_1.default.Types.ObjectId(recipientId)
        });
        await message.save();
        await message.populate('sender', 'username');
        await message.populate('recipient', 'username');
        res.status(201).json(message);
    }
    catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Error sending message' });
    }
});
exports.default = router;
