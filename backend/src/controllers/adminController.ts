import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest, ApiResponse, DashboardStats } from '../types';
import { AppError } from '../middleware';

// Get admin dashboard statistics
export const getDashboardStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [
      totalStudents,
      totalCompanies,
      approvedCompanies,
      totalOffers,
      activeOffers,
      totalApplications,
      pendingApplications,
      acceptedApplications,
      rejectedApplications,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.company.count(),
      prisma.company.count({ where: { isApproved: true } }),
      prisma.offer.count(),
      prisma.offer.count({ where: { status: 'ACTIVE' } }),
      prisma.application.count(),
      prisma.application.count({ where: { status: 'PENDING' } }),
      prisma.application.count({ where: { status: 'ACCEPTED' } }),
      prisma.application.count({ where: { status: 'REJECTED' } }),
    ]);

    // Get recent offers (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentOffers = await prisma.offer.count({
      where: { postedDate: { gte: sevenDaysAgo } },
    });

    const stats: DashboardStats = {
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
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to fetch dashboard statistics', 500);
  }
};

// Get offers by category stats
export const getOffersByCategory = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [pfeCount, internshipCount, jobCount] = await Promise.all([
      prisma.offer.count({ where: { category: 'PFE' } }),
      prisma.offer.count({ where: { category: 'SUMMER_INTERNSHIP' } }),
      prisma.offer.count({ where: { category: 'JOB' } }),
    ]);

    res.json({
      success: true,
      data: {
        PFE: pfeCount,
        SUMMER_INTERNSHIP: internshipCount,
        JOB: jobCount,
      },
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to fetch offer statistics', 500);
  }
};

// Get recent activity
export const getRecentActivity = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [recentApplications, recentOffers, recentStudents, recentCompanies] = await Promise.all([
      prisma.application.findMany({
        take: 5,
        orderBy: { applicationDate: 'desc' },
        include: {
          student: { select: { firstName: true, lastName: true } },
          offer: { select: { title: true } },
        },
      }),
      prisma.offer.findMany({
        take: 5,
        orderBy: { postedDate: 'desc' },
        include: {
          company: { select: { name: true } },
        },
      }),
      prisma.student.findMany({
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
      prisma.company.findMany({
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
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to fetch recent activity', 500);
  }
};

// Get application trends (monthly for last 6 months)
export const getApplicationTrends = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const applications = await prisma.application.findMany({
      where: { applicationDate: { gte: sixMonthsAgo } },
      select: { applicationDate: true, status: true },
    });

    // Group by month
    const monthlyData: { [key: string]: { total: number; accepted: number; rejected: number; pending: number } } = {};
    
    applications.forEach((app) => {
      const month = app.applicationDate.toISOString().slice(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { total: 0, accepted: 0, rejected: 0, pending: 0 };
      }
      monthlyData[month].total++;
      monthlyData[month][app.status.toLowerCase() as keyof typeof monthlyData[string]]++;
    });

    // Convert to array and sort
    const trends = Object.entries(monthlyData)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month));

    res.json({
      success: true,
      data: trends,
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to fetch application trends', 500);
  }
};

// Get top companies by applications
export const getTopCompanies = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const companies = await prisma.company.findMany({
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
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to fetch top companies', 500);
  }
};
