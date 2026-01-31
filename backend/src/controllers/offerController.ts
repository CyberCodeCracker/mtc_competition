import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest, ApiResponse, PaginatedResponse, UserRole } from '../types';
import { AppError } from '../middleware';
import { CreateOfferInput, UpdateOfferInput } from '../validators/schemas';

// Get all offers with filters
export const getAllOffers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const category = req.query.category as string;
    const status = req.query.status as string;
    const companyId = req.query.companyId as string;

    const skip = (page - 1) * limit;

    const where: any = {};
    
    // For students, only show active offers from approved companies
    if (req.user?.role === UserRole.STUDENT) {
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
    
    if (status && req.user?.role !== UserRole.STUDENT) {
      where.status = status;
    }
    
    if (companyId) {
      where.companyId = parseInt(companyId);
    }

    const [offers, total] = await Promise.all([
      prisma.offer.findMany({
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
      prisma.offer.count({ where }),
    ]);

    const response: PaginatedResponse<any> = {
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
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to fetch offers', 500);
  }
};

// Get offer by ID
export const getOfferById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const offer = await prisma.offer.findUnique({
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
      } as ApiResponse);
      return;
    }

    // Check if current student has applied
    let hasApplied = false;
    let applicationStatus = null;
    
    if (req.user?.role === UserRole.STUDENT) {
      const application = await prisma.application.findUnique({
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
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to fetch offer', 500);
  }
};

// Create offer (Company only)
export const createOffer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = req.body as CreateOfferInput;
    const { userId } = req.user!;

    // Check if company is approved
    const company = await prisma.company.findUnique({
      where: { id: userId },
      select: { isApproved: true },
    });

    if (!company?.isApproved) {
      res.status(403).json({
        success: false,
        message: 'Your company must be approved to post offers',
      } as ApiResponse);
      return;
    }

    const offer = await prisma.offer.create({
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
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to create offer', 500);
  }
};

// Update offer (Company owner or Admin)
export const updateOffer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body as UpdateOfferInput;
    const { userId, role } = req.user!;

    const existingOffer = await prisma.offer.findUnique({
      where: { id: parseInt(id) },
      select: { companyId: true },
    });

    if (!existingOffer) {
      res.status(404).json({
        success: false,
        message: 'Offer not found',
      } as ApiResponse);
      return;
    }

    // Check ownership
    if (role === UserRole.COMPANY && existingOffer.companyId !== userId) {
      res.status(403).json({
        success: false,
        message: 'You can only update your own offers',
      } as ApiResponse);
      return;
    }

    const offer = await prisma.offer.update({
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
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to update offer', 500);
  }
};

// Delete offer (Company owner or Admin)
export const deleteOffer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user!;

    const existingOffer = await prisma.offer.findUnique({
      where: { id: parseInt(id) },
      select: { companyId: true },
    });

    if (!existingOffer) {
      res.status(404).json({
        success: false,
        message: 'Offer not found',
      } as ApiResponse);
      return;
    }

    // Check ownership
    if (role === UserRole.COMPANY && existingOffer.companyId !== userId) {
      res.status(403).json({
        success: false,
        message: 'You can only delete your own offers',
      } as ApiResponse);
      return;
    }

    await prisma.offer.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: 'Offer deleted successfully',
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to delete offer', 500);
  }
};

// Get offer applications (Company owner or Admin)
export const getOfferApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user!;
    const status = req.query.status as string;

    const offer = await prisma.offer.findUnique({
      where: { id: parseInt(id) },
      select: { companyId: true },
    });

    if (!offer) {
      res.status(404).json({
        success: false,
        message: 'Offer not found',
      } as ApiResponse);
      return;
    }

    // Check ownership
    if (role === UserRole.COMPANY && offer.companyId !== userId) {
      res.status(403).json({
        success: false,
        message: 'You can only view applications for your own offers',
      } as ApiResponse);
      return;
    }

    const where: any = { offerId: parseInt(id) };
    if (status) {
      where.status = status;
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
