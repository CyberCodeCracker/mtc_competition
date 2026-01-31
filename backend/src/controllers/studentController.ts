import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest, ApiResponse, PaginatedResponse } from '../types';
import { AppError } from '../middleware';
import { UpdateStudentInput } from '../validators/schemas';

// Get all students (Admin only)
export const getAllStudents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const studyLevel = req.query.studyLevel as string;
    const groupName = req.query.groupName as string;

    const skip = (page - 1) * limit;

    const where: any = {};
    
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
      prisma.student.findMany({
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
      prisma.student.count({ where }),
    ]);

    const response: PaginatedResponse<any> = {
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
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to fetch students', 500);
  }
};

// Get student by ID
export const getStudentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const student = await prisma.student.findUnique({
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
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: student,
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to fetch student', 500);
  }
};

// Update student profile
export const updateStudent = async (req: AuthRequest, res: Response): Promise<void> => {
  console.log(`PUT /api/students/${req.params.id} - Update Student triggered`);
  try {
    const { id } = req.params;
    const data = req.body as UpdateStudentInput;
    const { userId, role } = req.user!;

    // Students can only update their own profile
    if (role === 'STUDENT' && userId !== parseInt(id)) {
      res.status(403).json({
        success: false,
        message: 'You can only update your own profile',
      } as ApiResponse);
      return;
    }

    const student = await prisma.student.update({
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
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to update student', 500);
  }
};

// Delete student (Admin only)
export const deleteStudent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.student.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: 'Student deleted successfully',
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to delete student', 500);
  }
};

// Get student's applications
export const getStudentApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.user!;
    const status = req.query.status as string;

    const where: any = { studentId: userId };
    if (status) {
      where.status = status;
    }

    const applications = await prisma.application.findMany({
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
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to fetch applications', 500);
  }
};

// Get student statistics
export const getStudentStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.user!;

    const [
      totalApplications,
      pendingApplications,
      acceptedApplications,
      rejectedApplications,
    ] = await Promise.all([
      prisma.application.count({ where: { studentId: userId } }),
      prisma.application.count({ where: { studentId: userId, status: 'PENDING' } }),
      prisma.application.count({ where: { studentId: userId, status: 'ACCEPTED' } }),
      prisma.application.count({ where: { studentId: userId, status: 'REJECTED' } }),
    ]);

    res.json({
      success: true,
      data: {
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
