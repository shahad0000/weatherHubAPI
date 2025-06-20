"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.dev = void 0;
exports.dev = process.env.NODE_ENV === 'development';
exports.port = process.env.PORT || 3000;
