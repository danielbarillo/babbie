import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import routes from './routes'

dotenv.config()

const app = express()

// Middleware
app.use(express.json())
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://chappy-frontend.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body)
  next()
})

// Routes
app.use('/', routes)

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({
    message: 'Internal server error',
    details: err.message
  })
})

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined')
    }

    await mongoose.connect(mongoURI)
    console.log('Connected to MongoDB')

    const PORT = process.env.PORT || 5001
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Server startup error:', error)
    process.exit(1)
  }
}

startServer()