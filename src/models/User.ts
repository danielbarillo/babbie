import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  avatarColor: string;
  isOnline: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  avatarColor: {
    type: String,
    default: () => {
      const colors = ['text-blue-500', 'text-green-500', 'text-red-500', 'text-purple-500']
      return colors[Math.floor(Math.random() * colors.length)]
    }
  },
  isOnline: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error as Error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error) {
    throw new Error('Error comparing passwords')
  }
}

export const User = mongoose.model<IUser>('User', userSchema)