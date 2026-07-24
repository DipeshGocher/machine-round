import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';
import { Franchise } from '../models/franchiseModel.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { HTTP_STATUS } from '../utils/statusCodes.js';

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Email and password are required');
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail }).select('+password');

  if (!user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, `No account found with email "${normalizedEmail}"`);
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Incorrect password. Password is case-sensitive.');
  }

  // Check user status
  if (user.status === 'Inactive') {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Account is inactive. Please contact system administrator');
  }

  // If franchise owner or staff, check franchise status
  if (user.role !== 'admin' && user.franchise) {
    const franchise = await Franchise.findById(user.franchise);
    if (franchise && franchise.status === 'Inactive') {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Associated franchise is inactive. Access denied');
    }
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET || 'super_secret_jwt_key_food_franchise_2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  // Return user without password
  const userObj = user.toObject();
  delete userObj.password;

  return res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      {
        user: userObj,
        token
      },
      'Login successful'
    )
  );
});
