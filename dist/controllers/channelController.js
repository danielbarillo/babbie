"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicChannels = exports.deleteChannel = exports.getChannel = exports.leaveChannel = exports.joinChannel = exports.createChannel = exports.getChannels = void 0;
const Channel_1 = require("../models/Channel");
const mongoose_1 = __importDefault(require("mongoose"));
const schemas_1 = require("../validation/schemas");
const getChannels = async (req, res) => {
    try {
        const query = req.user ? {} : { isPrivate: false };
        const channels = await Channel_1.Channel.find(query)
            .populate('createdBy', 'username')
            .select('-members');
        res.json(channels);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching channels' });
    }
};
exports.getChannels = getChannels;
const createChannel = async (req, res) => {
    try {
        const { error, value } = schemas_1.schemas.channel.create.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: 'Validation error',
                details: error.details[0].message
            });
        }
        const { name, description, isPrivate } = value;
        const existingChannel = await Channel_1.Channel.findOne({ name });
        if (existingChannel) {
            return res.status(400).json({ message: 'A channel with this name already exists' });
        }
        const channel = new Channel_1.Channel({
            name,
            description,
            isPrivate,
            members: [new mongoose_1.default.Types.ObjectId(req.user._id)],
            createdBy: new mongoose_1.default.Types.ObjectId(req.user._id)
        });
        await channel.save();
        await channel.populate('createdBy', 'username');
        res.status(201).json(channel);
    }
    catch (error) {
        if (error instanceof Error && 'code' in error && error.code === 11000) {
            return res.status(400).json({ message: 'A channel with this name already exists' });
        }
        res.status(500).json({ message: 'Error creating channel' });
    }
};
exports.createChannel = createChannel;
const joinChannel = async (req, res) => {
    try {
        const channel = await Channel_1.Channel.findById(req.params.channelId);
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }
        const userId = new mongoose_1.default.Types.ObjectId(req.user._id);
        if (channel.members.some(id => id.equals(userId))) {
            return res.status(400).json({ message: 'Already a member' });
        }
        channel.members.push(userId);
        await channel.save();
        res.json(channel);
    }
    catch (error) {
        res.status(500).json({ message: 'Error joining channel' });
    }
};
exports.joinChannel = joinChannel;
const leaveChannel = async (req, res) => {
    try {
        const channel = await Channel_1.Channel.findById(req.params.channelId);
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }
        const userId = new mongoose_1.default.Types.ObjectId(req.user._id);
        if (!channel.members.some(id => id.equals(userId))) {
            return res.status(400).json({ message: 'Not a member of this channel' });
        }
        channel.members = channel.members.filter(id => !id.equals(userId));
        await channel.save();
        res.json({ message: 'Successfully left channel' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error leaving channel' });
    }
};
exports.leaveChannel = leaveChannel;
const getChannel = async (req, res) => {
    try {
        const channel = await Channel_1.Channel.findById(req.params.channelId);
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }
        const userId = new mongoose_1.default.Types.ObjectId(req.user._id);
        if (channel.isPrivate && !channel.members.some(id => id.equals(userId))) {
            return res.status(403).json({ message: 'Access denied' });
        }
        res.json(channel);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching channel' });
    }
};
exports.getChannel = getChannel;
const deleteChannel = async (req, res) => {
    try {
        const channel = await Channel_1.Channel.findById(req.params.channelId);
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }
        const userId = new mongoose_1.default.Types.ObjectId(req.user._id);
        if (!channel.createdBy.equals(userId)) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await channel.deleteOne();
        res.json({ message: 'Channel deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting channel' });
    }
};
exports.deleteChannel = deleteChannel;
const getPublicChannels = async (req, res) => {
    try {
        const channels = await Channel_1.Channel.find({ isPrivate: false })
            .populate('createdBy', 'username')
            .select('-members');
        res.json(channels);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching public channels' });
    }
};
exports.getPublicChannels = getPublicChannels;
