"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopCompanies = exports.getApplicationTrends = exports.getRecentActivity = exports.getOffersByCategory = exports.getDashboardStats = void 0;
const database_1 = __importDefault(require("../config/database"));
const middleware_1 = require("../middleware");
// Get admin dashboard statistics
const getDashboardStats = async (_req, res) => {
    try {
        const [totalStudents, totalCompanies, approvedCompanies, totalOffers, activeOffers, totalApplications, pendingApplications, acceptedApplications, rejectedApplications,] = await Promise.all([
            database_1.default.student.count(),
            database_1.default.company.count(),
            database_1.default.company.count({ where: { isApproved: true } }),
            database_1.default.offer.count(),
            database_1.default.offer.count({ where: { status: 'ACTIVE' } }),
            database_1.default.application.count(),
            database_1.default.application.count({ where: { status: 'PENDING' } }),
            database_1.default.application.count({ where: { status: 'ACCEPTED' } }),
            database_1.default.application.count({ where: { status: 'REJECTED' } }),
        ]);
        // Get recent offers (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentOffers = await database_1.default.offer.count({
            where: { postedDate: { gte: sevenDaysAgo } },
        });
        const stats = {
            totalStudents,
            totalCompanies,
            totalOffers,
            totalApplications,
            pendingApplications,
            acceptedApplications,
            rejectedApplications,
            activeOffers,
            recentOffers,
            approvedCompanies,
            pendingCompanies: totalCompanies - approvedCompanies,
        };
        res.json({
            success: true,
            data: stats,
        });
    }
    catch (error) {
        throw new middleware_1.AppError('Failed to fetch dashboard statistics', 500);
    }
};
exports.getDashboardStats = getDashboardStats;
// Get offers by category stats
const getOffersByCategory = async (_req, res) => {
    try {
        const [pfeCount, internshipCount, jobCount] = await Promise.all([
            database_1.default.offer.count({ where: { category: 'PFE' } }),
            database_1.default.offer.count({ where: { category: 'SUMMER_INTERNSHIP' } }),
            database_1.default.offer.count({ where: { category: 'JOB' } }),
        ]);
        res.json({
            success: true,
            data: {
                PFE: pfeCount,
                SUMMER_INTERNSHIP: internshipCount,
                JOB: jobCount,
            },
        });
    }
    catch (error) {
        throw new middleware_1.AppError('Failed to fetch offer statistics', 500);
    }
};
exports.getOffersByCategory = getOffersByCategory;
// Get recent activity
const getRecentActivity = async (_req, res) => {
    try {
        const [recentApplications, recentOffers, recentStudents, recentCompanies] = await Promise.all([
            database_1.default.application.findMany({
                take: 5,
                orderBy: { applicationDate: 'desc' },
                include: {
                    student: { select: { firstName: true, lastName: true } },
                    offer: { select: { title: true } },
                },
            }),
            database_1.default.offer.findMany({
                take: 5,
                orderBy: { postedDate: 'desc' },
                include: {
                    company: { select: { name: true } },
                },
            }),
            database_1.default.student.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    createdAt: true,
                },
            }),
            database_1.default.company.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    isApproved: true,
                    createdAt: true,
                },
            }),
        ]);
        res.json({
            success: true,
            data: {
                recentApplications,
                recentOffers,
                recentStudents,
                recentCompanies,
            },
        });
    }
    catch (error) {
        throw new middleware_1.AppError('Failed to fetch recent activity', 500);
    }
};
exports.getRecentActivity = getRecentActivity;
// Get application trends (monthly for last 6 months)
const getApplicationTrends = async (_req, res) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const applications = await database_1.default.application.findMany({
            where: { applicationDate: { gte: sixMonthsAgo } },
            select: { applicationDate: true, status: true },
        });
        // Group by month
        const monthlyData = {};
        applications.forEach((app) => {
            const month = app.applicationDate.toISOString().slice(0, 7); // YYYY-MM
            if (!monthlyData[month]) {
                monthlyData[month] = { total: 0, accepted: 0, rejected: 0, pending: 0 };
            }
            monthlyData[month].total++;
            monthlyData[month][app.status.toLowerCase()]++;
        });
        // Convert to array and sort
        const trends = Object.entries(monthlyData)
            .map(([month, data]) => ({ month, ...data }))
            .sort((a, b) => a.month.localeCompare(b.month));
        res.json({
            success: true,
            data: trends,
        });
    }
    catch (error) {
        throw new middleware_1.AppError('Failed to fetch application trends', 500);
    }
};
exports.getApplicationTrends = getApplicationTrends;
// Get top companies by applications
const getTopCompanies = async (_req, res) => {
    try {
        const companies = await database_1.default.company.findMany({
            where: { isApproved: true },
            select: {
                id: true,
                name: true,
                logoPath: true,
                sector: true,
                _count: {
                    select: { offers: true },
                },
                offers: {
                    select: {
                        _count: {
                            select: { applications: true },
                        },
                    },
                },
            },
        });
        const companiesWithStats = companies
            .map((company) => ({
            id: company.id,
            name: company.name,
            logoPath: company.logoPath,
            sector: company.sector,
            totalOffers: company._count.offers,
            totalApplications: company.offers.reduce((sum, offer) => sum + offer._count.applications, 0),
        }))
            .sort((a, b) => b.totalApplications - a.totalApplications)
            .slice(0, 5);
        res.json({
            success: true,
            data: companiesWithStats,
        });
    }
    catch (error) {
        throw new middleware_1.AppError('Failed to fetch top companies', 500);
    }
};
exports.getTopCompanies = getTopCompanies;
//# sourceMappingURL=adminController.js.map