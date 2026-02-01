"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentStats = exports.getStudentApplications = exports.deleteStudent = exports.updateStudent = exports.getStudentById = exports.getAllStudents = void 0;
const database_1 = __importDefault(require("../config/database"));
const middleware_1 = require("../middleware");
// Get all students (Admin only)
const getAllStudents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search;
        const studyLevel = req.query.studyLevel;
        const groupName = req.query.groupName;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { firstName: { contains: search } },
                { lastName: { contains: search } },
                { email: { contains: search } },
            ];
        }
        if (studyLevel) {
            where.studyLevel = studyLevel;
        }
        if (groupName) {
            where.groupName = groupName;
        }
        const [students, total] = await Promise.all([
            database_1.default.student.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    studyLevel: true,
                    groupName: true,
                    skills: true,
                    phone: true,
                    linkedin: true,
                    github: true,
                    avatarPath: true,
                    createdAt: true,
                    _count: {
                        select: { applications: true },
                    },
                },
            }),
            database_1.default.student.count({ where }),
        ]);
        const response = {
            data: students,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
        res.json({
            success: true,
            data: response,
        });
    }
    catch (error) {
        throw new middleware_1.AppError('Failed to fetch students', 500);
    }
};
exports.getAllStudents = getAllStudents;
// Get student by ID
const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await database_1.default.student.findUnique({
            where: { id: parseInt(id) },
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
                applications: {
                    include: {
                        offer: {
                            include: {
                                company: {
                                    select: { id: true, name: true, logoPath: true },
                                },
                            },
                        },
                    },
                    orderBy: { applicationDate: 'desc' },
                },
            },
        });
        if (!student) {
            res.status(404).json({
                success: false,
                message: 'Student not found',
            });
            return;
        }
        res.json({
            success: true,
            data: student,
        });
    }
    catch (error) {
        throw new middleware_1.AppError('Failed to fetch student', 500);
    }
};
exports.getStudentById = getStudentById;
// Update student profile
const updateStudent = async (req, res) => {
    console.log(`PUT /api/students/${req.params.id} - Update Student triggered`);
    try {
        const { id } = req.params;
        const data = req.body;
        const { userId, role } = req.user;
        // Students can only update their own profile
        if (role === 'STUDENT' && userId !== parseInt(id)) {
            res.status(403).json({
                success: false,
                message: 'You can only update your own profile',
            });
            return;
        }
        const student = await database_1.default.student.update({
            where: { id: parseInt(id) },
            data,
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
                updatedAt: true,
            },
        });
        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: student,
        });
    }
    catch (error) {
        throw new middleware_1.AppError('Failed to update student', 500);
    }
};
exports.updateStudent = updateStudent;
// Delete student (Admin only)
const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.default.student.delete({
            where: { id: parseInt(id) },
        });
        res.json({
            success: true,
            message: 'Student deleted successfully',
        });
    }
    catch (error) {
        throw new middleware_1.AppError('Failed to delete student', 500);
    }
};
exports.deleteStudent = deleteStudent;
// Get student's applications
const getStudentApplications = async (req, res) => {
    try {
        const { userId } = req.user;
        const status = req.query.status;
        const where = { studentId: userId };
        if (status) {
            where.status = status;
        }
        const applications = await database_1.default.application.findMany({
            where,
            include: {
                offer: {
                    include: {
                        company: {
                            select: { id: true, name: true, logoPath: true, sector: true },
                        },
                    },
                },
            },
            orderBy: { applicationDate: 'desc' },
        });
        res.json({
            success: true,
            data: applications,
        });
    }
    catch (error) {
        throw new middleware_1.AppError('Failed to fetch applications', 500);
    }
};
exports.getStudentApplications = getStudentApplications;
// Get student statistics
const getStudentStats = async (req, res) => {
    try {
        const { userId } = req.user;
        const [totalApplications, pendingApplications, acceptedApplications, rejectedApplications,] = await Promise.all([
            database_1.default.application.count({ where: { studentId: userId } }),
            database_1.default.application.count({ where: { studentId: userId, status: 'PENDING' } }),
            database_1.default.application.count({ where: { studentId: userId, status: 'ACCEPTED' } }),
            database_1.default.application.count({ where: { studentId: userId, status: 'REJECTED' } }),
        ]);
        res.json({
            success: true,
            data: {
                totalApplications,
                pendingApplications,
                acceptedApplications,
                rejectedApplications,
            },
        });
    }
    catch (error) {
        throw new middleware_1.AppError('Failed to fetch statistics', 500);
    }
};
exports.getStudentStats = getStudentStats;
//# sourceMappingURL=studentController.js.map