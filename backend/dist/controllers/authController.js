"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.registerAdmin = exports.registerCompany = exports.registerStudent = exports.getProfile = exports.refreshToken = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../config/database"));
const config_1 = require("../config");
const types_1 = require("../types");
const middleware_1 = require("../middleware");
// Helper function to generate tokens
const generateTokens = (payload) => {
    const accessToken = jsonwebtoken_1.default.sign(payload, config_1.config.jwt.secret, {
        expiresIn: config_1.config.jwt.expiresIn,
    });
    const refreshToken = jsonwebtoken_1.default.sign(payload, config_1.config.jwt.refreshSecret, {
        expiresIn: config_1.config.jwt.refreshExpiresIn,
    });
    return { accessToken, refreshToken };
};
// Helper to hash password
const hashPassword = async (password) => {
    return bcryptjs_1.default.hash(password, 12);
};
// Helper to compare passwords
const comparePassword = async (password, hash) => {
    return bcryptjs_1.default.compare(password, hash);
};
// Login controller
const login = async (req, res) => {
    console.log(`POST /api/auth/login - Login triggered for: ${req.body.email}`);
    try {
        const { email, password } = req.body;
        // Try to find user in all tables
        let user = null;
        let role = null;
        let name;
        // Check admin
        const admin = await database_1.default.administration.findUnique({ where: { email } });
        if (admin) {
            user = admin;
            role = types_1.UserRole.ADMIN;
            name = admin.username;
        }
        // Check company
        if (!user) {
            const company = await database_1.default.company.findUnique({ where: { email } });
            if (company) {
                if (!company.isApproved) {
                    res.status(403).json({
                        success: false,
                        message: 'Your company account is pending approval',
                    });
                    return;
                }
                user = company;
                role = types_1.UserRole.COMPANY;
                name = company.name;
            }
        }
        // Check student
        if (!user) {
            const student = await database_1.default.student.findUnique({ where: { email } });
            if (student) {
                user = student;
                role = types_1.UserRole.STUDENT;
                name = `${student.firstName} ${student.lastName}`;
            }
        }
        if (!user || !role) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
            return;
        }
        // Compare password
        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
            return;
        }
        // Generate tokens
        const tokens = generateTokens({
            userId: user.id,
            email: user.email,
            role,
        });
        const response = {
            ...tokens,
            user: {
                id: user.id,
                email: user.email,
                role,
                name,
            },
        };
        res.json({
            success: true,
            message: 'Login successful',
            data: response,
        });
    }
    catch (error) {
        throw new middleware_1.AppError('Login failed', 500);
    }
};
exports.login = login;
// Refresh token controller
const refreshToken = async (req, res) => {
    try {
        const { refreshToken: token } = req.body;
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwt.refreshSecret);
        const tokens = generateTokens({
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        });
        res.json({
            success: true,
            message: 'Token refreshed successfully',
            data: tokens,
        });
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid refresh token',
        });
    }
};
exports.refreshToken = refreshToken;
// Get current user profile
const getProfile = async (req, res) => {
    try {
        const { userId, role } = req.user;
        let profile = null;
        switch (role) {
            case types_1.UserRole.ADMIN:
                profile = await database_1.default.administration.findUnique({
                    where: { id: userId },
                    select: { id: true, username: true, email: true, createdAt: true },
                });
                break;
            case types_1.UserRole.COMPANY:
                profile = await database_1.default.company.findUnique({
                    where: { id: userId },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        sector: true,
                        description: true,
                        isApproved: true,
                        logoPath: true,
                        website: true,
                        phone: true,
                        address: true,
                        createdAt: true,
                    },
                });
                break;
            case types_1.UserRole.STUDENT:
                profile = await database_1.default.student.findUnique({
                    where: { id: userId },
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        studyLevel: true,
                        groupName: true,
                        cvPath: true,
                        skills: true,
                        phone: true,
                        linkedin: true,
                        github: true,
                        avatarPath: true,
                        createdAt: true,
                    },
                });
                break;
        }
        if (!profile) {
            res.status(404).json({
                success: false,
                message: 'Profile not found',
            });
            return;
        }
        res.json({
            success: true,
            data: { ...profile, role },
        });
    }
    catch (error) {
        throw new middleware_1.AppError('Failed to fetch profile', 500);
    }
};
exports.getProfile = getProfile;
// Register student (Admin only)
const registerStudent = async (req, res) => {
    console.log(`POST /api/auth/register-student - Register Student triggered for: ${req.body.email}`);
    try {
        const data = req.body;
        // Check if email already exists
        const existingStudent = await database_1.default.student.findUnique({
            where: { email: data.email },
        });
        if (existingStudent) {
            res.status(409).json({
                success: false,
                message: 'Email already registered',
            });
            return;
        }
        const hashedPassword = await hashPassword(data.password);
        const student = await database_1.default.student.create({
            data: {
                ...data,
                password: hashedPassword,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                studyLevel: true,
                groupName: true,
                createdAt: true,
            },
        });
        res.status(201).json({
            success: true,
            message: 'Student registered successfully',
            data: student,
        });
    }
    catch (error) {
        throw new middleware_1.AppError('Failed to register student', 500);
    }
};
exports.registerStudent = registerStudent;
// Register company (Admin only)
const registerCompany = async (req, res) => {
    console.log(`POST /api/auth/register-company - Register Company triggered for: ${req.body.email}`);
    try {
        const data = req.body;
        // Check if email already exists
        const existingCompany = await database_1.default.company.findUnique({
            where: { email: data.email },
        });
        if (existingCompany) {
            res.status(409).json({
                success: false,
                message: 'Email already registered',
            });
            return;
        }
        const hashedPassword = await hashPassword(data.password);
        const company = await database_1.default.company.create({
            data: {
                ...data,
                password: hashedPassword,
                isApproved: true, // Admin-created companies are auto-approved
            },
            select: {
                id: true,
                name: true,
                email: true,
                sector: true,
                isApproved: true,
                createdAt: true,
            },
        });
        res.status(201).json({
            success: true,
            message: 'Company registered successfully',
            data: company,
        });
    }
    catch (error) {
        throw new middleware_1.AppError('Failed to register company', 500);
    }
};
exports.registerCompany = registerCompany;
// Register admin (Admin only)
const registerAdmin = async (req, res) => {
    console.log(`POST /api/auth/register-admin - Register Admin triggered for: ${req.body.username}`);
    try {
        const data = req.body;
        // Check if email or username already exists
        const existingAdmin = await database_1.default.administration.findFirst({
            where: {
                OR: [{ email: data.email }, { username: data.username }],
            },
        });
        if (existingAdmin) {
            res.status(409).json({
                success: false,
                message: 'Email or username already exists',
            });
            return;
        }
        const hashedPassword = await hashPassword(data.password);
        const admin = await database_1.default.administration.create({
            data: {
                ...data,
                password: hashedPassword,
            },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
            },
        });
        res.status(201).json({
            success: true,
            message: 'Admin registered successfully',
            data: admin,
        });
    }
    catch (error) {
        throw new middleware_1.AppError('Failed to register admin', 500);
    }
};
exports.registerAdmin = registerAdmin;
// Change password
const changePassword = async (req, res) => {
    console.log('POST /api/auth/change-password - Change Password triggered');
    try {
        const { userId, role } = req.user;
        const { currentPassword, newPassword } = req.body;
        let user = null;
        switch (role) {
            case types_1.UserRole.ADMIN:
                user = await database_1.default.administration.findUnique({ where: { id: userId } });
                break;
            case types_1.UserRole.COMPANY:
                user = await database_1.default.company.findUnique({ where: { id: userId } });
                break;
            case types_1.UserRole.STUDENT:
                user = await database_1.default.student.findUnique({ where: { id: userId } });
                break;
        }
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }
        const isValidPassword = await comparePassword(currentPassword, user.password);
        if (!isValidPassword) {
            res.status(401).json({
                success: false,
                message: 'Current password is incorrect',
            });
            return;
        }
        const hashedPassword = await hashPassword(newPassword);
        switch (role) {
            case types_1.UserRole.ADMIN:
                await database_1.default.administration.update({
                    where: { id: userId },
                    data: { password: hashedPassword },
                });
                break;
            case types_1.UserRole.COMPANY:
                await database_1.default.company.update({
                    where: { id: userId },
                    data: { password: hashedPassword },
                });
                break;
            case types_1.UserRole.STUDENT:
                await database_1.default.student.update({
                    where: { id: userId },
                    data: { password: hashedPassword },
                });
                break;
        }
        res.json({
            success: true,
            message: 'Password changed successfully',
        });
    }
    catch (error) {
        throw new middleware_1.AppError('Failed to change password', 500);
    }
};
exports.changePassword = changePassword;
//# sourceMappingURL=authController.js.map