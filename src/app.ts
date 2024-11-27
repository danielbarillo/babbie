import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import routes from './routes';
import cors from 'cors';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use('/api', routes);

const startServer = async (retries = 0) => {
  const PORT = Number(process.env.PORT) || 5000 + retries;

  try {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error: any) {
    if (error.code === 'EADDRINUSE' && retries < 10) {
      console.log(`Port ${PORT} is in use, trying ${PORT + 1}...`);
      await startServer(retries + 1);
    } else {
      console.error('Server failed to start:', error);
      process.exit(1);
    }
  }
};

startServer();

export default app;