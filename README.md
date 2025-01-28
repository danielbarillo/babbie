# Chappy - Real-time Chat Application

## Features
- Real-time messaging with Socket.IO
- Public and private channels
- User authentication
- Guest access
- Responsive design

## Quick Start

### Prerequisites
- Node.js 16+
- MongoDB

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/chappy.git
cd chappy
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
- Copy `.env.example` to `.env` in both frontend and backend directories
- Update the variables as needed

4. Start development servers:
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm run dev
```

5. Visit `http://localhost:5173` in your browser

## Environment Variables

### Backend
- `PORT`: Server port (default: 5001)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT tokens
- `CORS_ORIGIN`: Allowed origin for CORS

### Frontend
- `VITE_API_URL`: Backend API URL

## Routes
- /login - Login page (startsida)
- /register - Registration page
- /chat - Main chat interface
- /messages - Direct messages
- /messages/:userId - Specific DM conversation

## Test Users
1. Admin:
   - Username: admin
   - Password: admin123
2. Test:
   - Username: test
   - Password: password

## Guest Access
1. Click "Continue as Guest"
2. Enter display name
3. Access public channels
4. Send messages with your guest name

Note: Guest users can:
- View and join public channels
- Send messages in public channels
- See other users' messages
- Choose their own display name

Guest users cannot:
- Access private channels
- Send direct messages
- Create new channels

## Development

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

## User Features
- Real-time user status (online/offline)
- Channel-specific user lists
- Guest access with custom display names
- Authenticated user features:
  - Private channels
  - Direct messages
  - User profile

## Environment Setup

### Development
```env
PORT=5001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Production
```env
PORT=5001
NODE_ENV=production
CORS_ORIGIN=https://chappy-frontend.onrender.com
```

### Required Variables
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 5001)
- `CORS_ORIGIN`: Frontend URL

## Message Features
- Real-time messaging in channels
- Support for both authenticated users and guests
- Message history with usernames
- Automatic user status updates

### Guest Messages
- Guests can send messages in public channels
- Guest messages show custom display names
- No authentication required for public channels

### Authenticated Messages
- Full access to all channels
- Messages show registered username
- Support for private channels
- Direct messaging with other users

### Message Format
Messages are stored with:
- Content
- Sender information (username and type)
- Channel reference
- Timestamp