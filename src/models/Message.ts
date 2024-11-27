import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
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
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    required: true
  }
}, {
  timestamps: true
})

// Add index for faster message retrieval
messageSchema.index({ channel: 1, createdAt: -1 })

export const Message = mongoose.model('Message', messageSchema)