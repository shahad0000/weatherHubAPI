"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllCollections = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../utils/logger"));
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            logger_1.default.error('MONGODB_URI is not defined');
            process.exit(1);
        }
        await mongoose_1.default.connect(mongoURI);
        logger_1.default.info('MongoDB connected successfully');
    }
    catch (error) {
        logger_1.default.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
const deleteAllCollections = async () => {
    const collections = mongoose_1.default.connection.collections;
    if (!collections) {
        logger_1.default.error('No collections found');
        return;
    }
    for (const collection of Object.values(collections)) {
        await collection.drop();
    }
    logger_1.default.info('All collections dropped');
};
exports.deleteAllCollections = deleteAllCollections;
