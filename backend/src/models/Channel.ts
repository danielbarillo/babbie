import mongoose from 'mongoose'

interface IChannel extends mongoose.Document {
  name: string;
  description?: string;
  isPrivate: boolean;
  isRestricted?: boolean;
  members: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  description: {
    type: String,
    maxlength: 200
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  isRestricted: {
    type: Boolean,
    default: false
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

export const Channel = mongoose.model<IChannel>('Channel', channelSchema)