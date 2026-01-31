import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthRequest, JwtPayload, UserRole, ApiResponse } from '../types';

// Verify JWT token middleware
export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access token is required',
      } as ApiResponse);
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token has expired',
      } as ApiResponse);
      return;
    }
    
    res.status(401).json({
      success: false,
      message: 'Invalid token',
    } as ApiResponse);
  }
};

// Check if user is admin
export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== UserRole.ADMIN) {
    res.status(403).json({
      success: false,
      message: 'Admin access required',
    } as ApiResponse);
    return;
  }
  next();
};

// Check if user is company
export const isCompany = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== UserRole.COMPANY) {
    res.status(403).json({
      success: false,
      message: 'Company access required',
    } as ApiResponse);
    return;
  }
  next();
};

// Check if user is student
export const isStudent = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== UserRole.STUDENT) {
    res.status(403).json({
      success: false,
      message: 'Student access required',
    } as ApiResponse);
    return;
  }
  next();
};

// Check if user is admin or company
export const isAdminOrCompany = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.COMPANY)) {
    res.status(403).json({
      success: false,
      message: 'Admin or Company access required',
    } as ApiResponse);
    return;
  }
  next();
};

// Check if user has one of the specified roles
export const hasRole = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Required role: ${roles.join(' or ')}`,
      } as ApiResponse);
      return;
    }
    next();
  };
};
