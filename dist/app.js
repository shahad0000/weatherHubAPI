"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const logger_1 = __importDefault(require("./utils/logger"));
const helpers_1 = require("./utils/helpers");
const http_status_1 = require("./utils/http-status");
const db_1 = require("./config/db");
const error_1 = require("./utils/error");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
// Load environment variables
dotenv_1.default.config();
// // Delete all collections
// deleteAllCollections();
// Connect to MongoDB
(0, db_1.connectDB)();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('tiny', {
    stream: {
        write: (message) => logger_1.default.info(message.trim())
    }
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Routes
app.use('/api/auth', auth_routes_1.default);
// Basic route
app.get('/', (req, res) => {
    res
        .status(http_status_1.OK)
        .json({ message: 'List & Items API - Welcome!' });
});
// Error handling middleware
app.use((err, req, res, next) => {
    logger_1.default.error('Error:', err.message);
    if (err instanceof error_1.AppError) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            ...(helpers_1.dev && { stack: err.stack })
        });
        return;
    }
    res.status(http_status_1.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Something went wrong!',
        ...(helpers_1.dev && { error: err.message, stack: err.stack })
    });
});
// Start server
app.listen(helpers_1.port, () => {
    logger_1.default.info(`Server is running on port ${helpers_1.port}`);
});
