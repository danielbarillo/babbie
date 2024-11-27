"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const Channel_1 = require("../models/Channel");
const validate_1 = require("../middleware/validate");
const schemas_1 = require("../validation/schemas");
const mongoose_1 = __importDefault(require("mongoose"));
const router = (0, express_1.Router)();
// Get all channels (public and private if authenticated)
router.get('/', auth_1.attachUserState, async (req, res) => {
    try {
        // If user is authenticated, include private channels they're a member of
        const channels = await Channel_1.Channel.find(req.userState && (0, auth_1.isAuthenticated)(req.userState)
            ? {
                $or: [
                    { isPrivate: false },
                    { isPrivate: true, members: new mongoose_1.default.Types.ObjectId(req.userState._id) }
                ]
            }
            : { isPrivate: false }).select('name description isPrivate');
        res.json(channels);
    }
    catch (error) {
        console.error('Error fetching channels:', error);
        res.status(500).json({ message: 'Error fetching channels' });
    }
});
// Get channel by ID (public for open channels, auth for private)
router.get('/:id', auth_1.attachUserState, async (req, res) => {
    try {
        const channel = await Channel_1.Channel.findById(req.params.id);
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }
        if (channel.isPrivate) {
            if (!req.userState || !(0, auth_1.isAuthenticated)(req.userState)) {
                return res.status(401).json({ message: 'Authentication required' });
            }
            const userId = new mongoose_1.default.Types.ObjectId(req.userState._id);
            if (!channel.members.some(id => id.equals(userId))) {
                return res.status(403).json({ message: 'Access denied' });
            }
        }
        res.json(channel);
    }
    catch (error) {
        console.error('Error fetching channel:', error);
        res.status(500).json({ message: 'Error fetching channel' });
    }
});
// Create new channel (auth required)
router.post('/', auth_1.requireAuth, (0, validate_1.validate)(schemas_1.schemas.channel.create), async (req, res) => {
    try {
        if (!req.userState || !(0, auth_1.isAuthenticated)(req.userState)) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const { name, description, isPrivate } = req.body;
        const channel = new Channel_1.Channel({
            name,
            description,
            isPrivate,
            members: [new mongoose_1.default.Types.ObjectId(req.userState._id)],
            createdBy: new mongoose_1.default.Types.ObjectId(req.userState._id)
        });
        await channel.save();
        res.status(201).json(channel);
    }
    catch (error) {
        console.error('Error creating channel:', error);
        if (error instanceof Error && 'code' in error && error.code === 11000) {
            return res.status(400).json({ message: 'Channel name already exists' });
        }
        res.status(500).json({ message: 'Error creating channel' });
    }
});
// Join channel (auth required for private channels)
router.post('/:id/join', auth_1.attachUserState, async (req, res) => {
    try {
        const channel = await Channel_1.Channel.findById(req.params.id);
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }
        // For private channels, require authentication
        if (channel.isPrivate) {
            if (!req.userState || !(0, auth_1.isAuthenticated)(req.userState)) {
                return res.status(401).json({ message: 'Authentication required for private channels' });
            }
            const userId = new mongoose_1.default.Types.ObjectId(req.userState._id);
            if (channel.members.some(id => id.equals(userId))) {
                return res.status(400).json({ message: 'Already a member' });
            }
            channel.members.push(userId);
            await channel.save();
        }
        res.json(channel);
    }
    catch (error) {
        console.error('Error joining channel:', error);
        res.status(500).json({ message: 'Error joining channel' });
    }
});
// Leave channel (auth required)
router.post('/:id/leave', auth_1.requireAuth, async (req, res) => {
    try {
        if (!req.userState || !(0, auth_1.isAuthenticated)(req.userState)) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const channel = await Channel_1.Channel.findById(req.params.id);
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }
        const userId = new mongoose_1.default.Types.ObjectId(req.userState._id);
        if (!channel.members.some(id => id.equals(userId))) {
            return res.status(400).json({ message: 'Not a member' });
        }
        channel.members = channel.members.filter(id => !id.equals(userId));
        await channel.save();
        res.json(channel);
    }
    catch (error) {
        console.error('Error leaving channel:', error);
        res.status(500).json({ message: 'Error leaving channel' });
    }
});
exports.default = router;
