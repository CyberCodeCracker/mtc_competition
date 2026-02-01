"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOfferApplications = exports.deleteOffer = exports.updateOffer = exports.createOffer = exports.getOfferById = exports.getAllOffers = void 0;
const database_1 = __importDefault(require("../config/database"));
const types_1 = require("../types");
const middleware_1 = require("../middleware");
// Get all offers with filters
const getAllOffers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search;
        const category = req.query.category;
        const status = req.query.status;
        const companyId = req.query.companyId;
        const skip = (page - 1) * limit;
        const where = {};
        // For students, only show active offers from approved companies
        if (req.user?.role === types_1.UserRole.STUDENT) {
            where.status = 'ACTIVE';
            where.company = { isApproved: true };
        }
        if (search) {
            where.OR = [
                { title: { contains: search } },
                { description: { contains: search } },
                { requirements: { contains: search } },
            ];
        }
        if (category) {
            where.category = category;
        }
        if (status && req.user?.role !== types_1.UserRole.STUDENT) {
            where.status = status;
        }
        if (companyId) {
            where.companyId = parseInt(companyId);
        }
        const [offers, total] = await Promise.all([
            database_1.default.offer.findMany({
                where,
                skip,
                take: limit,
                orderBy: { postedDate: 'desc' },
                include: {
                    company: {
                        select: {
                            id: true,
                            name: true,
                            logoPath: true,
                            sector: true,
                        },
                    },
                    _count: {
                        select: { applications: true },
                    },
                },
            }),
            database_1.default.offer.count({ where }),
        ]);
        const response = {
            data: offers,
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
        throw new middleware_1.AppError('Failed to fetch offers', 500);
    }
};
exports.getAllOffers = getAllOffers;
// Get offer by ID
const getOfferById = async (req, res) => {
    try {
        const { id } = req.params;
        const offer = await database_1.default.offer.findUnique({
            where: { id: parseInt(id) },
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        sector: true,
                        description: true,
                        logoPath: true,
                        website: true,
                        address: true,
                    },
                },
                _count: {
                    select: { applications: true },
                },
            },
        });
        if (!offer) {
            res.status(404).json({
                success: false,
                message: 'Offer not found',
            });
            return;
        }
        // Check if current student has applied
        let hasApplied = false;
        let applicationStatus = null;
        if (req.user?.role === types_1.UserRole.STUDENT) {
            const application = await database_1.default.application.findUnique({
                where: {
                    studentId_offerId: {
                        studentId: req.user.userId,
                        offerId: parseInt(id),
                    },
                },
            });
            if (application) {
                hasApplied = true;
                applicationStatus = application.status;
            }
        }
        res.json({
            success: true,
            data: {
                ...offer,
                hasApplied,
                applicationStatus,
            },
        });
    }
    catch (error) {
        throw new middleware_1.AppError('Failed to fetch offer', 500);
    }
};
exports.getOfferById = getOfferById;
// Create offer (Company only)
const createOffer = async (req, res) => {
    console.log('POST /api/offers - Create Offer triggered');
    try {
        const data = req.body;
        const { userId } = req.user;
        // Check if company is approved
        const company = await database_1.default.company.findUnique({
            where: { id: userId },
            select: { isApproved: true },
        });
        if (!company?.isApproved) {
            res.status(403).json({
                success: false,
                message: 'Your company must be approved to post offers',
            });
            return;
        }
        const offer = await database_1.default.offer.create({
            data: {
                ...data,
                startDate: data.startDate ? new Date(data.startDate) : null,
                deadline: data.deadline ? new Date(data.deadline) : null,
                companyId: userId,
            },
            include: {
                company: {
                    select: { id: true, name: true, logoPath: true },
                },
            },
        });
        res.status(201).json({
            success: true,
            message: 'Offer created successfully',
            data: offer,
        });
    }
    catch (error) {
        throw new middleware_1.AppError('Failed to create offer', 500);
    }
};
exports.createOffer = createOffer;
// Update offer (Company owner or Admin)
const updateOffer = async (req, res) => {
    console.log(`PUT /api/offers/${req.params.id} - Update Offer triggered`);
    try {
        const { id } = req.params;
        const data = req.body;
        const { userId, role } = req.user;
        const existingOffer = await database_1.default.offer.findUnique({
            where: { id: parseInt(id) },
            select: { companyId: true },
        });
        if (!existingOffer) {
            res.status(404).json({
                success: false,
                message: 'Offer not found',
            });
            return;
        }
        // Check ownership
        if (role === types_1.UserRole.COMPANY && existingOffer.companyId !== userId) {
            res.status(403).json({
                success: false,
                message: 'You can only update your own offers',
            });
            return;
        }
        const offer = await database_1.default.offer.update({
            where: { id: parseInt(id) },
            data: {
                ...data,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                deadline: data.deadline ? new Date(data.deadline) : undefined,
            },
            include: {
                company: {
                    select: { id: true, name: true, logoPath: true },
                },
            },
        });
        res.json({
            success: true,
            message: 'Offer updated successfully',
            data: offer,
        });
    }
    catch (error) {
        throw new middleware_1.AppError('Failed to update offer', 500);
    }
};
exports.updateOffer = updateOffer;
// Delete offer (Company owner or Admin)
const deleteOffer = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, role } = req.user;
        const existingOffer = await database_1.default.offer.findUnique({
            where: { id: parseInt(id) },
            select: { companyId: true },
        });
        if (!existingOffer) {
            res.status(404).json({
                success: false,
                message: 'Offer not found',
            });
            return;
        }
        // Check ownership
        if (role === types_1.UserRole.COMPANY && existingOffer.companyId !== userId) {
            res.status(403).json({
                success: false,
                message: 'You can only delete your own offers',
            });
            return;
        }
        await database_1.default.offer.delete({
            where: { id: parseInt(id) },
        });
        res.json({
            success: true,
            message: 'Offer deleted successfully',
        });
    }
    catch (error) {
        throw new middleware_1.AppError('Failed to delete offer', 500);
    }
};
exports.deleteOffer = deleteOffer;
// Get offer applications (Company owner or Admin)
const getOfferApplications = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, role } = req.user;
        const status = req.query.status;
        const offer = await database_1.default.offer.findUnique({
            where: { id: parseInt(id) },
            select: { companyId: true },
        });
        if (!offer) {
            res.status(404).json({
                success: false,
                message: 'Offer not found',
            });
            return;
        }
        // Check ownership
        if (role === types_1.UserRole.COMPANY && offer.companyId !== userId) {
            res.status(403).json({
                success: false,
                message: 'You can only view applications for your own offers',
            });
            return;
        }
        const where = { offerId: parseInt(id) };
        if (status) {
            where.status = status;
        }
        const applications = await database_1.default.application.findMany({
            where,
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
                        avatarPath: true,
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
exports.getOfferApplications = getOfferApplications;
//# sourceMappingURL=offerController.js.map