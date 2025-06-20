"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersCollection = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: function (doc, ret) {
            return {
                id: ret.id,
                email: ret.email,
                createdAt: ret.createdAt,
                updatedAt: ret.updatedAt,
            };
        },
    },
    toObject: {
        virtuals: true,
        versionKey: false,
        transform: function (doc, ret) {
            return {
                id: ret.id,
                email: ret.email,
                createdAt: ret.createdAt,
                updatedAt: ret.updatedAt,
            };
        },
    },
});
// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    try {
        const salt = await bcryptjs_1.default.genSalt(10);
        this.password = await bcryptjs_1.default.hash(this.password, salt);
        return next();
    }
    catch (error) {
        return next(error);
    }
});
// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcryptjs_1.default.compare(candidatePassword, this.password);
};
exports.UsersCollection = (0, mongoose_1.model)('Users', userSchema);
