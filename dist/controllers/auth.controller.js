"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.refreshToken = exports.signOut = exports.signIn = exports.signUp = void 0;
const AuthService = __importStar(require("../services/auth.service"));
const error_1 = require("../utils/error");
const helpers_1 = require("../utils/helpers");
const http_status_1 = require("../utils/http-status");
const signUp = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, accessToken, refreshToken } = await AuthService.signUp({
            email,
            password,
        });
        // Set cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: !helpers_1.dev,
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: !helpers_1.dev,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(http_status_1.CREATED).json({
            status: 'success',
            data: {
                // Remove password from output
                user: {
                    id: user.id,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
                accessToken,
                refreshToken,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.signUp = signUp;
const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, accessToken, refreshToken } = await AuthService.signIn(email, password);
        // Set cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: !helpers_1.dev,
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: !helpers_1.dev,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(http_status_1.OK).json({
            status: 'success',
            data: {
                // Remove password from output
                user: {
                    id: user.id,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
                accessToken,
                refreshToken,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.signIn = signIn;
const signOut = async (req, res) => {
    res.cookie('accessToken', 'none', {
        expires: new Date(Date.now() + 5 * 1000),
        httpOnly: true,
    });
    res.cookie('refreshToken', 'none', {
        expires: new Date(Date.now() + 5 * 1000),
        httpOnly: true,
    });
    res.status(http_status_1.OK).json({
        status: 'success',
        message: 'Signed out successfully',
    });
};
exports.signOut = signOut;
const refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
        if (!refreshToken) {
            throw new error_1.AppError('Refresh token not provided', 401);
        }
        const tokens = await AuthService.refreshToken(refreshToken);
        // Set new cookies
        res.cookie('accessToken', tokens.accessToken, {
            httpOnly: true,
            secure: !helpers_1.dev,
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: !helpers_1.dev,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(http_status_1.OK).json({
            status: 'success',
            data: tokens,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.refreshToken = refreshToken;
const deleteAccount = async (req, res, next) => {
    try {
        await AuthService.deleteAccount(req.user.id);
        res.cookie('accessToken', 'none', {
            expires: new Date(Date.now() + 5 * 1000),
            httpOnly: true,
        });
        res.cookie('refreshToken', 'none', {
            expires: new Date(Date.now() + 5 * 1000),
            httpOnly: true,
        });
        res.status(http_status_1.OK).json({
            status: 'success',
            message: 'Account deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteAccount = deleteAccount;
