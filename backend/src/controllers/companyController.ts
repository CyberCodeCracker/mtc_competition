import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest, ApiResponse, PaginatedResponse } from '../types';
import { AppError } from '../middleware';
import { UpdateCompanyInput } from '../validators/schemas';

// Get all companies
export const getAllCompanies = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const sector = req.query.sector as string;
    const isApproved = req.query.isApproved as string;

    const skip = (page - 1) * limit;

    const where: any = {};
    
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
      prisma.company.findMany({
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
      prisma.company.count({ where }),
    ]);

    const response: PaginatedResponse<any> = {
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
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to fetch companies', 500);
  }
};

// Get company by ID
export const getCompanyById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const company = await prisma.company.findUnique({
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
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: company,
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to fetch company', 500);
  }
};

// Update company profile
export const updateCompany = async (req: AuthRequest, res: Response): Promise<void> => {
  console.log(`PUT /api/companies/${req.params.id} - Update Company triggered`);
  try {
    const { id } = req.params;
    const data = req.body as UpdateCompanyInput;
    const { userId, role } = req.user!;

    // Companies can only update their own profile
    if (role === 'COMPANY' && userId !== parseInt(id)) {
      res.status(403).json({
        success: false,
        message: 'You can only update your own profile',
      } as ApiResponse);
      return;
    }

    const company = await prisma.company.update({
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
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to update company', 500);
  }
};

// Delete company (Admin only)
export const deleteCompany = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.company.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: 'Company deleted successfully',
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to delete company', 500);
  }
};

// Approve/Reject company (Admin only)
export const toggleCompanyApproval = async (req: AuthRequest, res: Response): Promise<void> => {
  console.log(`PUT /api/companies/${req.params.id}/approval - Toggle Company Approval triggered`);
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const company = await prisma.company.update({
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
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to update company approval status', 500);
  }
};

// Get company's offers
export const getCompanyOffers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.user!;
    const status = req.query.status as string;

    const where: any = { companyId: userId };
    if (status) {
      where.status = status;
    }

    const offers = await prisma.offer.findMany({
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
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to fetch offers', 500);
  }
};

// Get company statistics
export const getCompanyStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.user!;

    const offers = await prisma.offer.findMany({
      where: { companyId: userId },
      select: { id: true },
    });

    const offerIds = offers.map(o => o.id);

    const [
      totalOffers,
      activeOffers,
      totalApplications,
      pendingApplications,
      acceptedApplications,
      rejectedApplications,
    ] = await Promise.all([
      prisma.offer.count({ where: { companyId: userId } }),
      prisma.offer.count({ where: { companyId: userId, status: 'ACTIVE' } }),
      prisma.application.count({ where: { offerId: { in: offerIds } } }),
      prisma.application.count({ where: { offerId: { in: offerIds }, status: 'PENDING' } }),
      prisma.application.count({ where: { offerId: { in: offerIds }, status: 'ACCEPTED' } }),
      prisma.application.count({ where: { offerId: { in: offerIds }, status: 'REJECTED' } }),
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
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to fetch statistics', 500);
  }
};

// Get applications for company's offers
export const getCompanyApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.user!;
    const status = req.query.status as string;
    const offerId = req.query.offerId as string;

    // Get all offer IDs for this company
    const companyOffers = await prisma.offer.findMany({
      where: { companyId: userId },
      select: { id: true },
    });

    const offerIds = companyOffers.map(o => o.id);

    const where: any = { offerId: { in: offerIds } };
    if (status) {
      where.status = status;
    }
    if (offerId) {
      where.offerId = parseInt(offerId);
    }

    const applications = await prisma.application.findMany({
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
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to fetch applications', 500);
  }
};
