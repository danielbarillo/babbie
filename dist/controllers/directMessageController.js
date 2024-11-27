"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendDirectMessage = exports.getDirectMessages = exports.getDirectMessageConversations = void 0;
const mockData_1 = require("../utils/mockData");
const getDirectMessageConversations = async (req, res) => {
    try {
        const conversations = mockData_1.mockDirectMessages
            .filter(conv => conv.participants.includes(req.user._id))
            .map(conv => {
            const otherUserId = conv.participants.find(id => id !== req.user._id);
            const otherUser = mockData_1.mockUsers.find(u => u._id === otherUserId);
            if (!otherUser) {
                return null; // Skip conversations with invalid users
            }
            return {
                _id: conv._id,
                otherUser: {
                    _id: otherUser._id,
                    username: otherUser.username,
                    avatarColor: otherUser.avatarColor
                },
                lastMessage: conv.messages[conv.messages.length - 1] || null
            };
        })
            .filter(Boolean); // Remove any null values
        res.json(conversations);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching conversations' });
    }
};
exports.getDirectMessageConversations = getDirectMessageConversations;
const getDirectMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const conversation = mockData_1.mockDirectMessages.find(conv => conv.participants.includes(req.user._id) &&
            conv.participants.includes(userId));
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }
        res.json(conversation.messages);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching messages' });
    }
};
exports.getDirectMessages = getDirectMessages;
const sendDirectMessage = async (req, res) => {
    try {
        const { userId, content } = req.body;
        let conversation = mockData_1.mockDirectMessages.find(conv => conv.participants.includes(req.user._id) &&
            conv.participants.includes(userId));
        if (!conversation) {
            conversation = {
                _id: (mockData_1.mockDirectMessages.length + 1).toString(),
                participants: [req.user._id, userId],
                messages: []
            };
            mockData_1.mockDirectMessages.push(conversation);
        }
        const newMessage = {
            _id: (conversation.messages.length + 1).toString(),
            content,
            sender: {
                _id: req.user._id,
                username: req.user.username,
                avatarColor: req.user.avatarColor
            },
            createdAt: new Date().toISOString()
        };
        conversation.messages.push(newMessage);
        res.status(201).json(newMessage);
    }
    catch (error) {
        res.status(500).json({ message: 'Error sending message' });
    }
};
exports.sendDirectMessage = sendDirectMessage;
