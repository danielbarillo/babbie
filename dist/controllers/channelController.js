"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChannel = exports.leaveChannel = exports.joinChannel = exports.createChannel = exports.getChannels = void 0;
const mockData_1 = require("../utils/mockData");
const getChannels = async (req, res) => {
    try {
        const channels = mockData_1.mockChannels.filter(channel => !channel.isPrivate || channel.members.includes(req.user._id));
        res.json(channels);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching channels' });
    }
};
exports.getChannels = getChannels;
const createChannel = async (req, res) => {
    try {
        const { name, description, isPrivate } = req.body;
        const newChannel = {
            _id: (mockData_1.mockChannels.length + 1).toString(),
            name,
            description,
            isPrivate,
            members: [req.user._id],
            messages: [],
            createdAt: new Date().toISOString()
        };
        mockData_1.mockChannels.push(newChannel);
        res.status(201).json(newChannel);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating channel' });
    }
};
exports.createChannel = createChannel;
const joinChannel = async (req, res) => {
    try {
        const channel = mockData_1.mockChannels.find(c => c._id === req.params.channelId);
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }
        if (channel.members.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already a member' });
        }
        channel.members.push(req.user._id);
        res.json(channel);
    }
    catch (error) {
        res.status(500).json({ message: 'Error joining channel' });
    }
};
exports.joinChannel = joinChannel;
const leaveChannel = async (req, res) => {
    try {
        const channel = mockData_1.mockChannels.find(c => c._id === req.params.channelId);
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }
        if (!channel.members.includes(req.user._id)) {
            return res.status(400).json({ message: 'Not a member of this channel' });
        }
        channel.members = channel.members.filter(id => id !== req.user._id);
        res.json({ message: 'Successfully left channel' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error leaving channel' });
    }
};
exports.leaveChannel = leaveChannel;
const getChannel = async (req, res) => {
    try {
        const channel = mockData_1.mockChannels.find(c => c._id === req.params.channelId);
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }
        if (channel.isPrivate && !channel.members.includes(req.user._id)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        res.json(channel);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching channel' });
    }
};
exports.getChannel = getChannel;
