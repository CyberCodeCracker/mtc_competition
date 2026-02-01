"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllApplications = exports.withdrawApplication = exports.updateApplicationStatus = exports.getApplicationById = exports.createApplication = void 0;
const database_1 = __importDefault(require("../config/database"));
const types_1 = require("../types");
const middleware_1 = require("../middleware");
// Create application (Student only)
const createApplication = async (req, res) => {
    try {
        const { offerId, coverLetter } = req.body;
        const { userId } = req.user;
        // Check if offer exists and is active
        const offer = await database_1.default.offer.findUnique({
            where: { id: offerId },
            include: {
                company: { select: { isApproved: true } },
            },
        });
        if (!offer) {
            res.status(404).json({
                success: false,
                message: 'Offer not found',
            });
            return;
        }
        if (offer.status !== 'ACTIVE') {
            res.status(400).json({
                success: false,
                message: 'This offer is no longer accepting applications',
            });
            return;
        }
        if (!offer.company.isApproved) {
            res.status(400).json({
                success: false,
                message: 'Cannot apply to offers from unapproved companies',
            });
            return;
        }
        // Check deadline
        if (offer.deadline && new Date(offer.deadline) < new Date()) {
            res.status(400).json({
                success: false,
                message: 'Application deadline has passed',
            });
            return;
        }
        // Check if already applied
        const existingApplication = await database_1.default.application.findUnique({
            where: {
                studentId_offerId: {
                    studentId: userId,
                    offerId,
                },
            },
        });
        if (existingApplication) {
            res.status(409).json({
                success: false,
                message: 'You have already applied to this offer',
            });
            return;
        }
        // Get student's CV path
        const student = await database_1.default.student.findUnique({
            where: { id: userId },
            select: { cvPath: true },
        });
        const application = await database_1.default.application.create({
            data: {
                studentId: userId,
                offerId,
                coverLetter,
                cvPath: student?.cvPath,
            },
            include: {
                offer: {
                    include: {
                        company: {
                            select: { id: true, name: true, logoPath: true },
                        },
                    },
                },
            },
        });
        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: application,
        });
    }
    catch (error) {
        throw new middleware_1.AppError('Failed to submit application', 500);
    }
};
exports.createApplication = createApplication;
// Get application by ID
const getApplicationById = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, role } = req.user;
        const application = await database_1.default.application.findUnique({
            where: { id: parseInt(id) },
            include: {
                student: {
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
                    },
                },
                offer: {
                    include: {
                        company: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                sector: true,
                                logoPath: true,
                            },
                        },
                    },
                },
            },
        });
        if (!application) {
            res.status(404).json({
                success: false,
                message: 'Application not found',
            });
            return;
        }
        // Access control
        if (role === types_1.UserRole.STUDENT && application.studentId !== userId) {
            res.status(403).json({
                success: false,
                message: 'You can only view your own applications',
            });
            return;
        }
        if (role === types_1.UserRole.COMPANY && application.offer.company.id !== userId) {
            res.status(403).json({
                success: false,
                message: 'You can only view applications for your offers',
            });
            return;
        }
        res.json({
            success: true,
            data: application,
        });
    }
    catch (error) {
        throw new middleware_1.AppError('Failed to fetch application', 500);
    }
};
exports.getApplicationById = getApplicationById;
// Update application status (Company or Admin)
const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const { userId, role } = req.user;
        const application = await database_1.default.application.findUnique({
            where: { id: parseInt(id) },
            include: {
                offer: { select: { companyId: true } },
            },
        });
        if (!application) {
            res.status(404).json({
                success: false,
                message: 'Application not found',
            });
            return;
        }
        // Check ownership for companies
        if (role === types_1.UserRole.COMPANY && application.offer.companyId !== userId) {
            res.status(403).json({
                success: false,
                message: 'You can only update applications for your offers',
            });
            return;
        }
        const updatedApplication = await database_1.default.application.update({
            where: { id: parseInt(id) },
            data: { status },
            include: {
                student: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                offer: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
        res.json({
            success: true,
            message: `Application ${status.toLowerCase()}`,
            data: updatedApplication,
        });
    }
    catch (error) {
        throw new middleware_1.AppError('Failed to update application status', 500);
    }
};
exports.updateApplicationStatus = updateApplicationStatus;
// Withdraw application (Student only)
const withdrawApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.user;
        const application = await database_1.default.application.findUnique({
            where: { id: parseInt(id) },
            select: { studentId: true, status: true },
        });
        if (!application) {
            res.status(404).json({
                success: false,
                message: 'Application not found',
            });
            return;
        }
        if (application.studentId !== userId) {
            res.status(403).json({
                success: false,
                message: 'You can only withdraw your own applications',
            });
            return;
        }
        if (application.status !== 'PENDING') {
            res.status(400).json({
                success: false,
                message: 'You can only withdraw pending applications',
            });
            return;
        }
        await database_1.default.application.delete({
            where: { id: parseInt(id) },
        });
        res.json({
            success: true,
            message: 'Application withdrawn successfully',
        });
    }
    catch (error) {
        throw new middleware_1.AppError('Failed to withdraw application', 500);
    }
};
exports.withdrawApplication = withdrawApplication;
// Get all applications (Admin only)
const getAllApplications = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const studentId = req.query.studentId;
        const offerId = req.query.offerId;
        const companyId = req.query.companyId;
        const skip = (page - 1) * limit;
        const where = {};
        if (status) {
            where.status = status;
        }
        if (studentId) {
            where.studentId = parseInt(studentId);
        }
        if (offerId) {
            where.offerId = parseInt(offerId);
        }
        if (companyId) {
            where.offer = { companyId: parseInt(companyId) };
        }
        const [applications, total] = await Promise.all([
            database_1.default.application.findMany({
                where,
                skip,
                take: limit,
                orderBy: { applicationDate: 'desc' },
                include: {
                    student: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            studyLevel: true,
                            groupName: true,
                            avatarPath: true,
                        },
                    },
                    offer: {
                        include: {
                            company: {
                                select: { id: true, name: true, logoPath: true },
                            },
                        },
                    },
                },
            }),
            database_1.default.application.count({ where }),
        ]);
        res.json({
            success: true,
            data: {
                data: applications,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    }
    catch (error) {
        throw new middleware_1.AppError('Failed to fetch applications', 500);
    }
};
exports.getAllApplications = getAllApplications;
//# sourceMappingURL=applicationController.js.map