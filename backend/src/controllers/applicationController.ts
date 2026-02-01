import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest, ApiResponse, UserRole } from '../types';
import { AppError } from '../middleware';
import { CreateApplicationInput, UpdateApplicationStatusInput } from '../validators/schemas';

// Create application (Student only)
export const createApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  console.log('POST /api/applications - Create Application triggered');
  try {
    const { offerId, coverLetter } = req.body as CreateApplicationInput;
    const { userId } = req.user!;

    // Check if offer exists and is active
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: {
        company: { select: { isApproved: true } },
      },
    });

    if (!offer) {
      res.status(404).json({
        success: false,
        message: 'Offer not found',
      } as ApiResponse);
      return;
    }

    if (offer.status !== 'ACTIVE') {
      res.status(400).json({
        success: false,
        message: 'This offer is no longer accepting applications',
      } as ApiResponse);
      return;
    }

    if (!offer.company.isApproved) {
      res.status(400).json({
        success: false,
        message: 'Cannot apply to offers from unapproved companies',
      } as ApiResponse);
      return;
    }

    // Check deadline
    if (offer.deadline && new Date(offer.deadline) < new Date()) {
      res.status(400).json({
        success: false,
        message: 'Application deadline has passed',
      } as ApiResponse);
      return;
    }

    // Check if already applied
    const existingApplication = await prisma.application.findUnique({
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
      } as ApiResponse);
      return;
    }

    // Get student's CV path
    const student = await prisma.student.findUnique({
      where: { id: userId },
      select: { cvPath: true },
    });

    const application = await prisma.application.create({
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
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to submit application', 500);
  }
};

// Get application by ID
export const getApplicationById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user!;

    const application = await prisma.application.findUnique({
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
      } as ApiResponse);
      return;
    }

    // Access control
    if (role === UserRole.STUDENT && application.studentId !== userId) {
      res.status(403).json({
        success: false,
        message: 'You can only view your own applications',
      } as ApiResponse);
      return;
    }

    if (role === UserRole.COMPANY && application.offer.company.id !== userId) {
      res.status(403).json({
        success: false,
        message: 'You can only view applications for your offers',
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: application,
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to fetch application', 500);
  }
};

// Update application status (Company or Admin)
export const updateApplicationStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  console.log(`PUT /api/applications/${req.params.id}/status - Update Application Status triggered`);
  try {
    const { id } = req.params;
    const { status } = req.body as UpdateApplicationStatusInput;
    const { userId, role } = req.user!;

    const application = await prisma.application.findUnique({
      where: { id: parseInt(id) },
      include: {
        offer: { select: { companyId: true } },
      },
    });

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Application not found',
      } as ApiResponse);
      return;
    }

    // Check ownership for companies
    if (role === UserRole.COMPANY && application.offer.companyId !== userId) {
      res.status(403).json({
        success: false,
        message: 'You can only update applications for your offers',
      } as ApiResponse);
      return;
    }

    const updatedApplication = await prisma.application.update({
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
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to update application status', 500);
  }
};

// Withdraw application (Student only)
export const withdrawApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.user!;

    const application = await prisma.application.findUnique({
      where: { id: parseInt(id) },
      select: { studentId: true, status: true },
    });

    if (!application) {
      res.status(404).json({
        success: false,
        message: 'Application not found',
      } as ApiResponse);
      return;
    }

    if (application.studentId !== userId) {
      res.status(403).json({
        success: false,
        message: 'You can only withdraw your own applications',
      } as ApiResponse);
      return;
    }

    if (application.status !== 'PENDING') {
      res.status(400).json({
        success: false,
        message: 'You can only withdraw pending applications',
      } as ApiResponse);
      return;
    }

    await prisma.application.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: 'Application withdrawn successfully',
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to withdraw application', 500);
  }
};

// Get all applications (Admin only)
export const getAllApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const studentId = req.query.studentId as string;
    const offerId = req.query.offerId as string;
    const companyId = req.query.companyId as string;

    const skip = (page - 1) * limit;

    const where: any = {};
    
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
      prisma.application.findMany({
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
      prisma.application.count({ where }),
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
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to fetch applications', 500);
  }
};
