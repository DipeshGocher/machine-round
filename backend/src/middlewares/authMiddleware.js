import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';
import { Franchise } from '../models/franchiseModel.js';
import { ApiError } from '../utils/apiError.js';
import { HTTP_STATUS } from '../utils/statusCodes.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const verifyToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Authorization token missing or invalid');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Token missing');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_food_franchise_2026');
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User no longer exists');
    }

    if (user.status === 'Inactive') {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Your user account is inactive');
    }

    // If user belongs to a franchise (or role is franchise/staff), check franchise status
    if (user.role !== 'admin' && user.franchise) {
      const franchise = await Franchise.findById(user.franchise);
      if (franchise && franchise.status === 'Inactive') {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Your franchise is inactive. Access denied');
      }
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid or expired token');
  }
});

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'You do not have permission to perform this action');
    }
    next();
  };
};
