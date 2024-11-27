"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.sendMessage = exports.getMessages = void 0;
const mockData_1 = require("../utils/mockData");
const getMessages = async (req, res) => {
    try {
        const { channelId } = req.params;
        const messages = mockData_1.mockMessages.filter((m) => m.channel === channelId);
        res.json(messages);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching messages' });
    }
};
exports.getMessages = getMessages;
const sendMessage = async (req, res) => {
    try {
        const { channelId } = req.params;
        const { content } = req.body;
        const sender = {
            _id: req.user._id,
            username: req.user.username,
            avatarColor: req.user.avatarColor || '',
        };
        const newMessage = {
            _id: (mockData_1.mockMessages.length + 1).toString(),
            content,
            sender,
            createdAt: new Date().toISOString(),
            channel: channelId
        };
        mockData_1.mockMessages.push(newMessage);
        res.status(201).json(newMessage);
    }
    catch (error) {
        res.status(500).json({ message: 'Error sending message' });
    }
};
exports.sendMessage = sendMessage;
const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const messageIndex = mockData_1.mockMessages.findIndex((m) => m._id === messageId);
        if (messageIndex === -1) {
            return res.status(404).json({ message: 'Message not found' });
        }
        if (mockData_1.mockMessages[messageIndex].sender._id !== req.user._id) {
            return res.status(403).json({ message: 'Not authorized to delete this message' });
        }
        mockData_1.mockMessages.splice(messageIndex, 1);
        res.json({ message: 'Message deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting message' });
    }
};
exports.deleteMessage = deleteMessage;
