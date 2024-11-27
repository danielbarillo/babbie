"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockMessages = exports.mockChannels = exports.mockDirectMessages = exports.mockUsers = void 0;
exports.mockUsers = [
    {
        _id: '1',
        username: 'user1',
        avatarColor: 'blue',
        email: 'user1@example.com',
        isOnline: true
    },
    // ... other users
];
exports.mockDirectMessages = [
    {
        _id: '1',
        participants: ['1', '2'],
        messages: [
            {
                _id: '1',
                content: 'Hello!',
                sender: exports.mockUsers[0],
                createdAt: new Date().toISOString()
            }
        ]
    },
    // ... other conversations
];
exports.mockChannels = [
    {
        _id: '1',
        name: 'general',
        description: 'General discussion channel',
        members: ['1', '2'],
        messages: [
            {
                _id: '1',
                content: 'Welcome to the general channel!',
                sender: exports.mockUsers[0],
                createdAt: new Date().toISOString()
            }
        ],
        createdAt: new Date().toISOString(),
        isPrivate: false
    },
    // Add more mock channels as needed
];
exports.mockMessages = [
    {
        _id: '1',
        content: 'Hello channel!',
        sender: exports.mockUsers[0],
        createdAt: new Date().toISOString(),
        channel: '1' // channel ID
    },
    // Add more mock messages as needed
];
