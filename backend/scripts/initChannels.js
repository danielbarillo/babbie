const mongoose = require('mongoose');
const Channel = require('../models/Channel');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const defaultChannels = [
  {
    name: 'announcements',
    description: 'Important announcements',
    isDefault: true
  },
  {
    name: 'allmänt',
    description: 'General discussion',
    isDefault: true
  }
];

async function initializeChannels() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const channel of defaultChannels) {
      await Channel.findOneAndUpdate(
        { name: channel.name },
        channel,
        { upsert: true }
      );
      console.log(`Channel "${channel.name}" initialized`);
    }

    console.log('Default channels initialized');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing channels:', error);
    process.exit(1);
  }
}

initializeChannels();