"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasRole = exports.isAdminOrCompany = exports.isStudent = exports.isCompany = exports.isAdmin = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const types_1 = require("../types");
// Verify JWT token middleware
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: 'Access token is required',
            });
            return;
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwt.secret);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({
                success: false,
                message: 'Token has expired',
            });
            return;
        }
        res.status(401).json({
            success: false,
            message: 'Invalid token',
        });
    }
};
exports.verifyToken = verifyToken;
// Check if user is admin
const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== types_1.UserRole.ADMIN) {
        res.status(403).json({
            success: false,
            message: 'Admin access required',
        });
        return;
    }
    next();
};
exports.isAdmin = isAdmin;
// Check if user is company
const isCompany = (req, res, next) => {
    if (!req.user || req.user.role !== types_1.UserRole.COMPANY) {
        res.status(403).json({
            success: false,
            message: 'Company access required',
        });
        return;
    }
    next();
};
exports.isCompany = isCompany;
// Check if user is student
const isStudent = (req, res, next) => {
    if (!req.user || req.user.role !== types_1.UserRole.STUDENT) {
        res.status(403).json({
            success: false,
            message: 'Student access required',
        });
        return;
    }
    next();
};
exports.isStudent = isStudent;
// Check if user is admin or company
const isAdminOrCompany = (req, res, next) => {
    if (!req.user || (req.user.role !== types_1.UserRole.ADMIN && req.user.role !== types_1.UserRole.COMPANY)) {
        res.status(403).json({
            success: false,
            message: 'Admin or Company access required',
        });
        return;
    }
    next();
};
exports.isAdminOrCompany = isAdminOrCompany;
// Check if user has one of the specified roles
const hasRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: `Required role: ${roles.join(' or ')}`,
            });
            return;
        }
        next();
    };
};
exports.hasRole = hasRole;
//# sourceMappingURL=auth.js.map