const express = require('express');
const router = express.Router();
const Channel = require('../models/Channel');
const auth = require('../middleware/auth');

// Get all channels
router.get('/', auth, async (req, res) => {
  try {
    const channels = await Channel.find().sort({ createdAt: 1 });
    res.json(channels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new channel
router.post('/', auth, async (req, res) => {
  const channel = new Channel({
    name: req.body.name,
    description: req.body.description
  });

  try {
    const newChannel = await channel.save();
    res.status(201).json(newChannel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;