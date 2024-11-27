"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsRead = exports.getConversations = exports.sendDirectMessage = exports.getDirectMessages = void 0;
const DirectMessage_1 = require("../models/DirectMessage");
const User_1 = require("../models/User");
const mongoose_1 = __importDefault(require("mongoose"));
const getDirectMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;
        // Validate that recipient exists
        const recipient = await User_1.User.findById(userId);
        if (!recipient) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Get messages between the two users
        const messages = await DirectMessage_1.DirectMessage.find({
            $or: [
                { sender: currentUserId, recipient: userId },
                { sender: userId, recipient: currentUserId }
            ]
        })
            .populate('sender', 'username avatarColor')
            .sort({ createdAt: 1 })
            .limit(100);
        res.json(messages);
    }
    catch (error) {
        console.error('Error fetching direct messages:', error);
        res.status(500).json({ message: 'Error fetching direct messages' });
    }
};
exports.getDirectMessages = getDirectMessages;
const sendDirectMessage = async (req, res) => {
    try {
        const { userId } = req.params;
        const { content } = req.body;
        const senderId = req.user._id;
        if (!content || !content.trim()) {
            return res.status(400).json({ message: 'Message content is required' });
        }
        // Validate that recipient exists
        const recipient = await User_1.User.findById(userId);
        if (!recipient) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Create and save the message
        const message = new DirectMessage_1.DirectMessage({
            content: content.trim(),
            sender: senderId,
            recipient: userId
        });
        await message.save();
        await message.populate('sender', 'username avatarColor');
        res.status(201).json(message);
    }
    catch (error) {
        console.error('Error sending direct message:', error);
        res.status(500).json({ message: 'Error sending direct message' });
    }
};
exports.sendDirectMessage = sendDirectMessage;
const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;
        // Get the latest message from each conversation
        const conversations = await DirectMessage_1.DirectMessage.aggregate([
            {
                $match: {
                    $or: [
                        { sender: new mongoose_1.default.Types.ObjectId(userId) },
                        { recipient: new mongoose_1.default.Types.ObjectId(userId) }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ['$sender', new mongoose_1.default.Types.ObjectId(userId)] },
                            then: '$recipient',
                            else: '$sender'
                        }
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
                    user: {
                        _id: 1,
                        username: 1,
                        avatarColor: 1,
                        isOnline: 1
                    },
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
};
exports.getConversations = getConversations;
const markAsRead = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user._id;
        const message = await DirectMessage_1.DirectMessage.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        // Only recipient can mark message as read
        if (message.recipient.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        message.read = true;
        await message.save();
        res.json(message);
    }
    catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({ message: 'Error marking message as read' });
    }
};
exports.markAsRead = markAsRead;
