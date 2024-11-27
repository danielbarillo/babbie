"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
// Connect to MongoDB
(0, db_1.connectDB)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use('/api', routes_1.default);
const startServer = async (retries = 0) => {
    const PORT = Number(process.env.PORT) || 5000 + retries;
    try {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        if (error.code === 'EADDRINUSE' && retries < 10) {
            console.log(`Port ${PORT} is in use, trying ${PORT + 1}...`);
            await startServer(retries + 1);
        }
        else {
            console.error('Server failed to start:', error);
            process.exit(1);
        }
    }
};
startServer();
exports.default = app;
