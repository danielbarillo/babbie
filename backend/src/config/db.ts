import mongoose from 'mongoose';
import { config } from './config';

export const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');

    if (!config.mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      dbName: 'chappy',
      retryWrites: true,
      w: 'majority'
    });

    mongoose.connection.on('connected', () => {
      console.log('MongoDB Connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Don't expose sensitive information in production
    if (config.nodeEnv === 'development') {
      console.error('Connection details:', {
        uri: config.mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//USER:PASS@'),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    throw error;
  }
};