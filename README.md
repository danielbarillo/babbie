# Chappy - Modern Chat Application

A real-time chat application with support for channels and direct messages.

## Features
- Public and private channels
- Direct messaging
- Guest access with custom display names
- User authentication
- Real-time messaging

## Test Users
1. Admin user:
   - Username: admin
   - Password: admin123

2. Test user:
   - Username: test
   - Password: password

## Routes
- /login - Login page
- /register - Registration page
- /chat - Main chat interface
- /messages - Direct messages
- /messages/:userId - Specific direct message conversation

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Required variables:
     ```
     MONGODB_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     PORT=5001
     CORS_ORIGIN=http://localhost:5173
     ```

4. Start development server:
   ```bash
   npm run dev
   ```

## Testing
You can test the application in three ways:

1. As a guest:
   - Click "Continue as Guest"
   - Enter a display name
   - Access public channels

2. As test user:
   - Login with username: test, password: password
   - Access both public and private channels
   - Send direct messages

3. As admin:
   - Login with username: admin, password: admin123
   - Full access to all features

## Production
The application is deployed on Render.com with:
- Backend: https://chappyv.onrender.com
- Frontend: https://chappy-frontend.onrender.com

## Troubleshooting
If you encounter issues:
1. Clear browser cache and local storage
2. Ensure all environment variables are set correctly
3. Check console for any error messages
4. Verify MongoDB connection