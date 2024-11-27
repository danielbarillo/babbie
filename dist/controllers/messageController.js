"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.sendMessage = exports.getMessages = void 0;
const Message_1 = require("../models/Message");
const getMessages = async (req, res) => {
    try {
        const { channelId } = req.params;
        const messages = await Message_1.Message.find({ channel: channelId })
            .populate('sender', 'username avatarColor')
            .sort({ createdAt: 1 })
            .limit(100);
        res.json(messages);
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
};
exports.getMessages = getMessages;
const sendMessage = async (req, res) => {
    try {
        const { channelId } = req.params;
        const { content } = req.body;
        if (!content || !content.trim()) {
            return res.status(400).json({ message: 'Message content is required' });
        }
        const message = new Message_1.Message({
            content: content.trim(),
            sender: req.user._id,
            channel: channelId
        });
        await message.save();
        await message.populate('sender', 'username avatarColor');
        res.status(201).json(message);
    }
    catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Error sending message' });
    }
};
exports.sendMessage = sendMessage;
const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const message = await Message_1.Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        if (message.sender.toString() !== req.user._id) {
            return res.status(403).json({ message: 'Not authorized to delete this message' });
        }
        await message.deleteOne();
        res.json({ message: 'Message deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Error deleting message' });
    }
};
exports.deleteMessage = deleteMessage;
