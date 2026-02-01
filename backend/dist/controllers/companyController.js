"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompanyApplications = exports.getCompanyStats = exports.getCompanyOffers = exports.toggleCompanyApproval = exports.deleteCompany = exports.updateCompany = exports.getCompanyById = exports.getAllCompanies = void 0;
const database_1 = __importDefault(require("../config/database"));
const middleware_1 = require("../middleware");
// Get all companies
const getAllCompanies = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search;
        const sector = req.query.sector;
        const isApproved = req.query.isApproved;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { email: { contains: search } },
                { sector: { contains: search } },
            ];
        }
        if (sector) {
            where.sector = sector;
        }
        if (isApproved !== undefined) {
            where.isApproved = isApproved === 'true';
        }
        const [companies, total] = await Promise.all([
            database_1.default.company.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
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
                    _count: {
                        select: { offers: true },
                    },
                },
            }),
            database_1.default.company.count({ where }),
        ]);
        const response = {
            data: companies,
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
        throw new middleware_1.AppError('Failed to fetch companies', 500);
    }
};
exports.getAllCompanies = getAllCompanies;
// Get company by ID
const getCompanyById = async (req, res) => {
    try {
        const { id } = req.params;
        const company = await database_1.default.company.findUnique({
            where: { id: parseInt(id) },
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
                offers: {
                    where: { status: 'ACTIVE' },
                    orderBy: { postedDate: 'desc' },
                    select: {
                        id: true,
                        title: true,
                        category: true,
                        location: true,
                        duration: true,
                        postedDate: true,
                        deadline: true,
                        _count: {
                            select: { applications: true },
                        },
                    },
                },
                _count: {
                    select: { offers: true },
                },
            },
        });
        if (!company) {
            res.status(404).json({
                success: false,
                message: 'Company not found',
            });
            return;
        }
        res.json({
            success: true,
            data: company,
        });
    }
    catch (error) {
        throw new middleware_1.AppError('Failed to fetch company', 500);
    }
};
exports.getCompanyById = getCompanyById;
// Update company profile
const updateCompany = async (req, res) => {
    console.log(`PUT /api/companies/${req.params.id} - Update Company triggered`);
    try {
        const { id } = req.params;
        const data = req.body;
        const { userId, role } = req.user;
        // Companies can only update their own profile
        if (role === 'COMPANY' && userId !== parseInt(id)) {
            res.status(403).json({
                success: false,
                message: 'You can only update your own profile',
            });
            return;
        }
        const company = await database_1.default.company.update({
            where: { id: parseInt(id) },
            data,
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
                updatedAt: true,
            },
        });
        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: company,
        });
    }
    catch (error) {
        throw new middleware_1.AppError('Failed to update company', 500);
    }
};
exports.updateCompany = updateCompany;
// Delete company (Admin only)
const deleteCompany = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.default.company.delete({
            where: { id: parseInt(id) },
        });
        res.json({
            success: true,
            message: 'Company deleted successfully',
        });
    }
    catch (error) {
        throw new middleware_1.AppError('Failed to delete company', 500);
    }
};
exports.deleteCompany = deleteCompany;
// Approve/Reject company (Admin only)
const toggleCompanyApproval = async (req, res) => {
    console.log(`PUT /api/companies/${req.params.id}/approval - Toggle Company Approval triggered`);
    try {
        const { id } = req.params;
        const { isApproved } = req.body;
        const company = await database_1.default.company.update({
            where: { id: parseInt(id) },
            data: { isApproved },
            select: {
                id: true,
                name: true,
                email: true,
                isApproved: true,
            },
        });
        res.json({
            success: true,
            message: `Company ${isApproved ? 'approved' : 'rejected'} successfully`,
            data: company,
        });
    }
    catch (error) {
        throw new middleware_1.AppError('Failed to update company approval status', 500);
    }
};
exports.toggleCompanyApproval = toggleCompanyApproval;
// Get company's offers
const getCompanyOffers = async (req, res) => {
    try {
        const { userId } = req.user;
        const status = req.query.status;
        const where = { companyId: userId };
        if (status) {
            where.status = status;
        }
        const offers = await database_1.default.offer.findMany({
            where,
            include: {
                _count: {
                    select: { applications: true },
                },
            },
            orderBy: { postedDate: 'desc' },
        });
        res.json({
            success: true,
            data: offers,
        });
    }
    catch (error) {
        throw new middleware_1.AppError('Failed to fetch offers', 500);
    }
};
exports.getCompanyOffers = getCompanyOffers;
// Get company statistics
const getCompanyStats = async (req, res) => {
    try {
        const { userId } = req.user;
        const offers = await database_1.default.offer.findMany({
            where: { companyId: userId },
            select: { id: true },
        });
        const offerIds = offers.map(o => o.id);
        const [totalOffers, activeOffers, totalApplications, pendingApplications, acceptedApplications, rejectedApplications,] = await Promise.all([
            database_1.default.offer.count({ where: { companyId: userId } }),
            database_1.default.offer.count({ where: { companyId: userId, status: 'ACTIVE' } }),
            database_1.default.application.count({ where: { offerId: { in: offerIds } } }),
            database_1.default.application.count({ where: { offerId: { in: offerIds }, status: 'PENDING' } }),
            database_1.default.application.count({ where: { offerId: { in: offerIds }, status: 'ACCEPTED' } }),
            database_1.default.application.count({ where: { offerId: { in: offerIds }, status: 'REJECTED' } }),
        ]);
        res.json({
            success: true,
            data: {
                totalOffers,
                activeOffers,
                closedOffers: totalOffers - activeOffers,
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
exports.getCompanyStats = getCompanyStats;
// Get applications for company's offers
const getCompanyApplications = async (req, res) => {
    try {
        const { userId } = req.user;
        const status = req.query.status;
        const offerId = req.query.offerId;
        // Get all offer IDs for this company
        const companyOffers = await database_1.default.offer.findMany({
            where: { companyId: userId },
            select: { id: true },
        });
        const offerIds = companyOffers.map(o => o.id);
        const where = { offerId: { in: offerIds } };
        if (status) {
            where.status = status;
        }
        if (offerId) {
            where.offerId = parseInt(offerId);
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
                offer: {
                    select: {
                        id: true,
                        title: true,
                        category: true,
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
exports.getCompanyApplications = getCompanyApplications;
//# sourceMappingURL=companyController.js.map