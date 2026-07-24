import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../utils/statusCodes.js';
import {
  getDashboardStatsService,
  createFranchiseService,
  getFranchisesService,
  getFranchiseOverviewService,
  updateFranchiseService,
  toggleFranchiseStatusService,
  getAllUsersService,
  getAdminStaffListService,
  getAdminProductsService
} from '../services/adminService.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await getDashboardStatsService();
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, stats, 'Dashboard statistics fetched successfully'));
});

export const createFranchise = asyncHandler(async (req, res) => {
  const franchise = await createFranchiseService(req.body);
  return res
    .status(HTTP_STATUS.CREATED)
    .json(new ApiResponse(HTTP_STATUS.CREATED, franchise, 'Franchise and owner created successfully'));
});

export const getFranchises = asyncHandler(async (req, res) => {
  const franchises = await getFranchisesService();
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, franchises, 'Franchises retrieved successfully'));
});

export const getFranchiseOverview = asyncHandler(async (req, res) => {
  const overview = await getFranchiseOverviewService(req.params.id);
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, overview, 'Franchise overview retrieved successfully'));
});

export const updateFranchise = asyncHandler(async (req, res) => {
  const franchise = await updateFranchiseService(req.params.id, req.body);
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, franchise, 'Franchise updated successfully'));
});

export const toggleFranchiseStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const franchise = await toggleFranchiseStatusService(req.params.id, status);
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, franchise, `Franchise status updated to ${status}`));
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsersService();
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, users, 'Users retrieved successfully'));
});

export const getAdminStaffList = asyncHandler(async (req, res) => {
  const staff = await getAdminStaffListService();
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, staff, 'Staff members list retrieved successfully'));
});

export const getAdminProducts = asyncHandler(async (req, res) => {
  const products = await getAdminProductsService();
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, products, 'All products list retrieved successfully'));
});
