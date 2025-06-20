"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.authorized = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const error_1 = require("../utils/error");
const http_status_1 = require("../utils/http-status");
const jwt_1 = require("../config/jwt");
const authorized = async (req, res, next) => {
    try {
        // 1) Get token from header
        const authHeader = req.headers.authorization;
        let token;
        if (authHeader && authHeader.startsWith('Bearer')) {
            token = authHeader.split(' ')[1];
        }
        else if (req.cookies?.accessToken) {
            token = req.cookies.accessToken;
        }
        if (!token) {
            return next(new error_1.AppError('You are not logged in', http_status_1.UNAUTHORIZED));
        }
        // 2) Verify token
        const decoded = jsonwebtoken_1.default.verify(token, jwt_1.jwtConfig.secret);
        if (decoded.type !== 'access') {
            return next(new error_1.AppError('Invalid token type', http_status_1.UNAUTHORIZED));
        }
        // 3) Check if user still exists
        const user = await user_model_1.UsersCollection.findOne({ id: decoded.user.id });
        if (!user) {
            return next(new error_1.AppError('User no longer exists', http_status_1.UNAUTHORIZED));
        }
        // 4) Grant access to authorized route
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            next(new error_1.AppError('Token has expired', http_status_1.UNAUTHORIZED));
        }
        else {
            next(new error_1.AppError('Invalid token', http_status_1.UNAUTHORIZED));
        }
    }
};
exports.authorized = authorized;
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new error_1.AppError('You do not have permission to perform this action', http_status_1.FORBIDDEN));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
