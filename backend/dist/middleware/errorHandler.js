"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = exports.AppError = void 0;
// Custom error class
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
// Not found error handler
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
};
exports.notFoundHandler = notFoundHandler;
// Global error handler
const errorHandler = (error, req, res, _next) => {
    console.error('Error:', error);
    // Handle known operational errors
    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
        return;
    }
    // Handle Prisma errors
    if (error.name === 'PrismaClientKnownRequestError') {
        const prismaError = error;
        if (prismaError.code === 'P2002') {
            res.status(409).json({
                success: false,
                message: 'A record with this value already exists',
            });
            return;
        }
        if (prismaError.code === 'P2025') {
            res.status(404).json({
                success: false,
                message: 'Record not found',
            });
            return;
        }
    }
    // Handle unexpected errors
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'development'
            ? error.message
            : 'Internal server error',
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map