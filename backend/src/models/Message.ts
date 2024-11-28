import mongoose from 'mongoose'

interface GuestSender {
  username: string;
  type: 'guest';
}

type MessageSender = mongoose.Types.ObjectId | GuestSender;

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    maxLength: 500
  },
  sender: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    validate: {
      validator: function(v: any): boolean {
        // Check if it's an ObjectId
        if (mongoose.Types.ObjectId.isValid(v)) {
          return true;
        }
        // Check if it's a guest user object
        if (typeof v === 'object' && v !== null) {
          return v.type === 'guest' && typeof v.username === 'string';
        }
        return false;
      },
      message: 'Sender must be either a valid ObjectId or a guest user object'
    }
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Add index for faster message retrieval
messageSchema.index({ channel: 1, createdAt: -1 })

export interface IMessage extends mongoose.Document {
  content: string;
  sender: MessageSender;
  channel: mongoose.Types.ObjectId;
  createdAt: Date;
}

export const Message = mongoose.model<IMessage>('Message', messageSchema)