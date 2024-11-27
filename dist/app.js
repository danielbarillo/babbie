"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_js_1 = require("./config/db.js");
const index_js_1 = __importDefault(require("./routes/index.js"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? false
        : ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// API routes
app.use('/api', index_js_1.default);
// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    const frontendBuildPath = path_1.default.join(__dirname, '../../frontend/dist');
    app.use(express_1.default.static(frontendBuildPath));
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(frontendBuildPath, 'index.html'));
    });
}
// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        details: err
    });
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});
const startServer = async () => {
    try {
        await (0, db_js_1.connectDB)();
        if (mongoose_1.default.connection.readyState === 1) {
            const PORT = process.env.PORT || 5001;
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
                console.log(`MongoDB connected: ${mongoose_1.default.connection.host}`);
            });
        }
        else {
            console.error('Failed to connect to MongoDB. Server not started.');
            process.exit(1);
        }
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
exports.default = app;
