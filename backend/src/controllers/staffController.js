import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../utils/statusCodes.js';
import {
  getStaffDashboardService,
  getStaffProductsService,
  toggleStaffProductAvailabilityService
} from '../services/staffService.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const data = await getStaffDashboardService(req.user);
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, data, 'Staff dashboard metrics fetched successfully'));
});

export const getProducts = asyncHandler(async (req, res) => {
  const result = await getStaffProductsService(req.user, req.query);
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, result, 'Staff products list retrieved successfully'));
});

export const toggleProductAvailability = asyncHandler(async (req, res) => {
  const { availability } = req.body;
  const product = await toggleStaffProductAvailabilityService(req.user, req.params.id, availability);
  return res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        product,
        `Product status updated to ${availability ? 'Available' : 'Out of Stock'}`
      )
    );
});
