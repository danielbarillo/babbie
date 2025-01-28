import { httpServer, initializeServer } from './app';

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await initializeServer();

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();