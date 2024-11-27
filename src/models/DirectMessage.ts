import mongoose from 'mongoose';

const directMessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    maxLength: 500
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add compound index for faster message retrieval
directMessageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
directMessageSchema.index({ recipient: 1, sender: 1, createdAt: -1 });

export const DirectMessage = mongoose.model('DirectMessage', directMessageSchema);