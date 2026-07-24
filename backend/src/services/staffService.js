import mongoose from 'mongoose';
import { Franchise } from '../models/franchiseModel.js';
import { Product } from '../models/productModel.js';
import { ApiError } from '../utils/apiError.js';
import { HTTP_STATUS } from '../utils/statusCodes.js';

export const getStaffDashboardService = async (currentUser) => {
  if (!currentUser.franchise) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'No franchise associated with this staff account');
  }

  const franchiseId = currentUser.franchise;

  const [franchise, totalProducts, availableProducts, outOfStockProducts, productList] =
    await Promise.all([
      Franchise.findById(franchiseId),
      Product.countDocuments({ franchise: franchiseId }),
      Product.countDocuments({ franchise: franchiseId, availability: true }),
      Product.countDocuments({ franchise: franchiseId, availability: false }),
      Product.find({ franchise: franchiseId }).sort({ createdAt: -1 })
    ]);

  if (!franchise) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Franchise not found');
  }

  return {
    franchiseName: franchise.name,
    franchiseCity: franchise.city,
    totalProducts,
    availableProducts,
    outOfStockProducts,
    productList
  };
};

export const getStaffProductsService = async (currentUser, queryParams) => {
  if (!currentUser.franchise) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Franchise ID missing from staff session');
  }

  const franchiseId = currentUser.franchise;
  const { search, category, availability, page = 1, limit = 10 } = queryParams;

  const filter = { franchise: franchiseId };

  if (search && search.trim() !== '') {
    filter.name = { $regex: search.trim(), $options: 'i' };
  }

  if (category && category !== 'All') {
    filter.category = category;
  }

  if (availability !== undefined && availability !== 'All') {
    filter.availability = availability === 'true' || availability === true;
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  const [products, totalProducts] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Product.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(totalProducts / limitNum) || 1;

  return {
    products,
    totalProducts,
    page: pageNum,
    totalPages
  };
};

export const toggleStaffProductAvailabilityService = async (currentUser, productId, availability) => {
  if (!currentUser.franchise) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Franchise ID missing from staff session');
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid Product ID format');
  }

  if (typeof availability !== 'boolean') {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Availability must be a boolean');
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Product not found');
  }

  // DATA ISOLATION GUARD: Staff can only change availability of products belonging to their franchise
  if (product.franchise.toString() !== currentUser.franchise.toString()) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Forbidden: You do not have permission to access or modify products belonging to another franchise');
  }

  product.availability = availability;
  await product.save();

  return product;
};
