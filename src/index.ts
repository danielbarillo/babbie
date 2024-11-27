import express from 'express'
import cors from 'cors'
import { config } from './config/config'
import { connectDB } from './config/db'
import routes from './routes'

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB()

    const app = express()

    // Middleware
    app.use(express.json())
    app.use(cors({
      origin: config.corsOrigins,
      credentials: true
    }))

    // Routes
    app.use('/api', routes)

    // Error handling middleware
    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error(err.stack)
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
      })
    })

    // Start server
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err)
  process.exit(1)
})

startServer()