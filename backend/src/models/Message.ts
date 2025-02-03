import mongoose from 'mongoose'

interface GuestSender {
  username: string;
  type: 'guest';
}

export interface IMessage {
  content: string;
  sender: mongoose.Types.ObjectId | GuestSender;
  channel: mongoose.Types.ObjectId;
  createdAt: Date;
}

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    validate: {
      validator: function(v: any) {
        return (
          (v.type === 'guest' && typeof v.username === 'string') ||
          (v.type === 'authenticated' && v._id && v.username)
        );
      },
      message: 'Invalid sender format'
    }
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    required: true
  }
}, {
  timestamps: true
})

export const Message = mongoose.model<IMessage>('Message', messageSchema)