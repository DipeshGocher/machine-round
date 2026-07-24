import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../utils/statusCodes.js';
import {
  getFranchiseDashboardService,
  getStaffListService,
  addStaffService,
  updateStaffService,
  toggleStaffStatusService,
  getProductsService,
  addProductService,
  updateProductService,
  deleteProductService,
  toggleProductAvailabilityService
} from '../services/franchiseService.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const data = await getFranchiseDashboardService(req.user);
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, data, 'Dashboard statistics fetched successfully'));
});

/* ==========================================================================
   STAFF CONTROLLERS
   ========================================================================== */

export const getStaffList = asyncHandler(async (req, res) => {
  const staff = await getStaffListService(req.user.franchise);
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, staff, 'Staff list retrieved successfully'));
});

export const addStaff = asyncHandler(async (req, res) => {
  const newStaff = await addStaffService(req.user, req.body);
  return res
    .status(HTTP_STATUS.CREATED)
    .json(new ApiResponse(HTTP_STATUS.CREATED, newStaff, 'Staff member added successfully'));
});

export const updateStaff = asyncHandler(async (req, res) => {
  const updatedStaff = await updateStaffService(req.user, req.params.id, req.body);
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, updatedStaff, 'Staff member updated successfully'));
});

export const toggleStaffStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const updatedStaff = await toggleStaffStatusService(req.user, req.params.id, status);
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, updatedStaff, `Staff status updated to ${status}`));
});

/* ==========================================================================
   PRODUCT CONTROLLERS
   ========================================================================== */

export const getProducts = asyncHandler(async (req, res) => {
  const result = await getProductsService(req.user.franchise, req.query);
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, result, 'Products retrieved successfully'));
});

export const addProduct = asyncHandler(async (req, res) => {
  const product = await addProductService(req.user, req.body);
  return res
    .status(HTTP_STATUS.CREATED)
    .json(new ApiResponse(HTTP_STATUS.CREATED, product, 'Product added successfully'));
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await updateProductService(req.user, req.params.id, req.body);
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, product, 'Product updated successfully'));
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await deleteProductService(req.user, req.params.id);
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, null, 'Product deleted permanently'));
});

export const toggleProductAvailability = asyncHandler(async (req, res) => {
  const { availability } = req.body;
  const product = await toggleProductAvailabilityService(req.user, req.params.id, availability);
  return res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        product,
        `Product availability updated to ${availability ? 'Available' : 'Out of Stock'}`
      )
    );
});
