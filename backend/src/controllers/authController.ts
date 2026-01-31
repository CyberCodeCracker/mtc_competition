import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { config } from '../config';
import { AuthRequest, UserRole, JwtPayload, ApiResponse, LoginResponse } from '../types';
import { AppError } from '../middleware';
import {
  LoginInput,
  RegisterStudentInput,
  RegisterCompanyInput,
  RegisterAdminInput,
} from '../validators/schemas';

// Helper function to generate tokens
const generateTokens = (payload: Omit<JwtPayload, 'iat' | 'exp'>) => {
  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
  
  const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
  
  return { accessToken, refreshToken };
};

// Helper to hash password
const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

// Helper to compare passwords
const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// Login controller
export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  console.log(`POST /api/auth/login - Login triggered for: ${req.body.email}`);
  try {
    const { email, password } = req.body as LoginInput;

    // Try to find user in all tables
    let user: any = null;
    let role: UserRole | null = null;
    let name: string | undefined;

    // Check admin
    const admin = await prisma.administration.findUnique({ where: { email } });
    if (admin) {
      user = admin;
      role = UserRole.ADMIN;
      name = admin.username;
    }

    // Check company
    if (!user) {
      const company = await prisma.company.findUnique({ where: { email } });
      if (company) {
        if (!company.isApproved) {
          res.status(403).json({
            success: false,
            message: 'Your company account is pending approval',
          } as ApiResponse);
          return;
        }
        user = company;
        role = UserRole.COMPANY;
        name = company.name;
      }
    }

    // Check student
    if (!user) {
      const student = await prisma.student.findUnique({ where: { email } });
      if (student) {
        user = student;
        role = UserRole.STUDENT;
        name = `${student.firstName} ${student.lastName}`;
      }
    }

    if (!user || !role) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      } as ApiResponse);
      return;
    }

    // Compare password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      } as ApiResponse);
      return;
    }

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role,
    });

    const response: LoginResponse = {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        role,
        name,
      },
    };

    res.json({
      success: true,
      message: 'Login successful',
      data: response,
    } as ApiResponse<LoginResponse>);
  } catch (error) {
    throw new AppError('Login failed', 500);
  }
};

// Refresh token controller
export const refreshToken = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { refreshToken: token } = req.body;

    const decoded = jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
    
    const tokens = generateTokens({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    });

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: tokens,
    } as ApiResponse);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token',
    } as ApiResponse);
  }
};

// Get current user profile
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, role } = req.user!;
    let profile: any = null;

    switch (role) {
      case UserRole.ADMIN:
        profile = await prisma.administration.findUnique({
          where: { id: userId },
          select: { id: true, username: true, email: true, createdAt: true },
        });
        break;
      case UserRole.COMPANY:
        profile = await prisma.company.findUnique({
          where: { id: userId },
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
          },
        });
        break;
      case UserRole.STUDENT:
        profile = await prisma.student.findUnique({
          where: { id: userId },
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
          },
        });
        break;
    }

    if (!profile) {
      res.status(404).json({
        success: false,
        message: 'Profile not found',
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: { ...profile, role },
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to fetch profile', 500);
  }
};

// Register student (Admin only)
export const registerStudent = async (req: AuthRequest, res: Response): Promise<void> => {
  console.log(`POST /api/auth/register-student - Register Student triggered for: ${req.body.email}`);
  try {
    const data = req.body as RegisterStudentInput;
    
    // Check if email already exists
    const existingStudent = await prisma.student.findUnique({
      where: { email: data.email },
    });
    
    if (existingStudent) {
      res.status(409).json({
        success: false,
        message: 'Email already registered',
      } as ApiResponse);
      return;
    }

    const hashedPassword = await hashPassword(data.password);
    
    const student = await prisma.student.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        studyLevel: true,
        groupName: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: student,
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to register student', 500);
  }
};

// Register company (Admin only)
export const registerCompany = async (req: AuthRequest, res: Response): Promise<void> => {
  console.log(`POST /api/auth/register-company - Register Company triggered for: ${req.body.email}`);
  try {
    const data = req.body as RegisterCompanyInput;
    
    // Check if email already exists
    const existingCompany = await prisma.company.findUnique({
      where: { email: data.email },
    });
    
    if (existingCompany) {
      res.status(409).json({
        success: false,
        message: 'Email already registered',
      } as ApiResponse);
      return;
    }

    const hashedPassword = await hashPassword(data.password);
    
    const company = await prisma.company.create({
      data: {
        ...data,
        password: hashedPassword,
        isApproved: true, // Admin-created companies are auto-approved
      },
      select: {
        id: true,
        name: true,
        email: true,
        sector: true,
        isApproved: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Company registered successfully',
      data: company,
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to register company', 500);
  }
};

// Register admin (Admin only)
export const registerAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  console.log(`POST /api/auth/register-admin - Register Admin triggered for: ${req.body.username}`);
  try {
    const data = req.body as RegisterAdminInput;
    
    // Check if email or username already exists
    const existingAdmin = await prisma.administration.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });
    
    if (existingAdmin) {
      res.status(409).json({
        success: false,
        message: 'Email or username already exists',
      } as ApiResponse);
      return;
    }

    const hashedPassword = await hashPassword(data.password);
    
    const admin = await prisma.administration.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: admin,
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to register admin', 500);
  }
};

// Change password
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  console.log('POST /api/auth/change-password - Change Password triggered');
  try {
    const { userId, role } = req.user!;
    const { currentPassword, newPassword } = req.body;

    let user: any = null;

    switch (role) {
      case UserRole.ADMIN:
        user = await prisma.administration.findUnique({ where: { id: userId } });
        break;
      case UserRole.COMPANY:
        user = await prisma.company.findUnique({ where: { id: userId } });
        break;
      case UserRole.STUDENT:
        user = await prisma.student.findUnique({ where: { id: userId } });
        break;
    }

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      } as ApiResponse);
      return;
    }

    const isValidPassword = await comparePassword(currentPassword, user.password);
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      } as ApiResponse);
      return;
    }

    const hashedPassword = await hashPassword(newPassword);

    switch (role) {
      case UserRole.ADMIN:
        await prisma.administration.update({
          where: { id: userId },
          data: { password: hashedPassword },
        });
        break;
      case UserRole.COMPANY:
        await prisma.company.update({
          where: { id: userId },
          data: { password: hashedPassword },
        });
        break;
      case UserRole.STUDENT:
        await prisma.student.update({
          where: { id: userId },
          data: { password: hashedPassword },
        });
        break;
    }

    res.json({
      success: true,
      message: 'Password changed successfully',
    } as ApiResponse);
  } catch (error) {
    throw new AppError('Failed to change password', 500);
  }
};
