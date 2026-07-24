import mongoose from 'mongoose';
import { Franchise } from '../models/franchiseModel.js';
import { User } from '../models/userModel.js';
import { Product } from '../models/productModel.js';
import { ApiError } from '../utils/apiError.js';
import { HTTP_STATUS } from '../utils/statusCodes.js';
import {
  validateAddStaffInput,
  validateUpdateStaffInput,
  validateAddProductInput,
  validateUpdateProductInput
} from '../utils/validators.js';

export const getFranchiseDashboardService = async (currentUser) => {
  if (!currentUser.franchise) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'No franchise associated with this owner account');
  }

  const franchiseId = currentUser.franchise;

  const [
    franchise,
    totalSystemFranchises,
    totalStaff,
    totalProducts,
    activeProducts,
    outOfStockProducts,
    recentlyAddedProducts
  ] = await Promise.all([
    Franchise.findById(franchiseId),
    Franchise.countDocuments({ status: 'Active' }),
    User.countDocuments({ franchise: franchiseId, role: 'staff' }),
    Product.countDocuments({ franchise: franchiseId }),
    Product.countDocuments({ franchise: franchiseId, availability: true }),
    Product.countDocuments({ franchise: franchiseId, availability: false }),
    Product.find({ franchise: franchiseId }).sort({ createdAt: -1 }).limit(5)
  ]);

  if (!franchise) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Franchise not found');
  }

  return {
    franchiseName: franchise.name,
    ownerName: currentUser.name,
    totalSystemFranchises,
    totalStaff,
    totalProducts,
    activeProducts,
    outOfStockProducts,
    recentlyAddedProducts
  };
};

/* ==========================================================================
   STAFF MANAGEMENT SERVICES
   ========================================================================== */

export const getStaffListService = async (franchiseId) => {
  if (!franchiseId) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Franchise ID missing from token context');
  }

  return await User.find({ franchise: franchiseId, role: 'staff' })
    .select('-password')
    .sort({ createdAt: -1 });
};

export const addStaffService = async (currentUser, data) => {
  if (!currentUser.franchise) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Franchise ID missing from owner session');
  }

  validateAddStaffInput(data);

  const normalizedEmail = data.email.toLowerCase().trim();

  // Check unique email
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'A user with this email address already exists');
  }

  const newStaff = new User({
    name: data.name.trim(),
    email: normalizedEmail,
    password: data.password,
    role: 'staff',
    designation: data.designation.trim(),
    franchise: currentUser.franchise,
    status: 'Active'
  });

  await newStaff.save();

  const resultObj = newStaff.toObject();
  delete resultObj.password;
  return resultObj;
};

export const updateStaffService = async (currentUser, staffId, data) => {
  if (!mongoose.Types.ObjectId.isValid(staffId)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid Staff ID format');
  }

  validateUpdateStaffInput(data);

  const staff = await User.findById(staffId);
  if (!staff || staff.role !== 'staff') {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Staff member not found');
  }

  // DATA ISOLATION GUARD
  if (staff.franchise?.toString() !== currentUser.franchise?.toString()) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Forbidden: You do not have permission to access staff belonging to another franchise');
  }

  const { name, email, designation } = data;

  if (name) {
    staff.name = name.trim();
  }

  if (email && email.toLowerCase().trim() !== staff.email) {
    const normalizedEmail = email.toLowerCase().trim();
    const existingEmail = await User.findOne({ email: normalizedEmail, _id: { $ne: staffId } });
    if (existingEmail) {
      throw new ApiError(HTTP_STATUS.CONFLICT, 'Email address already in use by another user');
    }
    staff.email = normalizedEmail;
  }

  if (designation) {
    staff.designation = designation.trim();
  }

  await staff.save();

  const updatedObj = staff.toObject();
  delete updatedObj.password;
  return updatedObj;
};

export const toggleStaffStatusService = async (currentUser, staffId, status) => {
  if (!mongoose.Types.ObjectId.isValid(staffId)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid Staff ID format');
  }

  if (!['Active', 'Inactive'].includes(status)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Status must be either Active or Inactive');
  }

  const staff = await User.findById(staffId);
  if (!staff || staff.role !== 'staff') {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Staff member not found');
  }

  // DATA ISOLATION GUARD
  if (staff.franchise?.toString() !== currentUser.franchise?.toString()) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Forbidden: You do not have permission to modify staff belonging to another franchise');
  }

  staff.status = status;
  await staff.save();

  const updatedObj = staff.toObject();
  delete updatedObj.password;
  return updatedObj;
};

/* ==========================================================================
   PRODUCT MANAGEMENT SERVICES
   ========================================================================== */

export const getProductsService = async (franchiseId, queryParams) => {
  if (!franchiseId) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Franchise ID missing from token context');
  }

  const { search, category, availability, sort, page = 1, limit = 10 } = queryParams;

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

  let sortOption = { createdAt: -1 };
  if (sort === 'price_asc') {
    sortOption = { price: 1 };
  } else if (sort === 'price_desc') {
    sortOption = { price: -1 };
  } else if (sort === 'latest') {
    sortOption = { createdAt: -1 };
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  const [products, totalProducts] = await Promise.all([
    Product.find(filter)
      .populate('createdBy', 'name email')
      .sort(sortOption)
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

export const addProductService = async (currentUser, data) => {
  if (!currentUser.franchise) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Franchise ID missing from owner session');
  }

  validateAddProductInput(data);

  const newProduct = new Product({
    name: data.name.trim(),
    category: data.category,
    price: Number(data.price),
    description: data.description ? data.description.trim() : '',
    imageUrl: data.imageUrl ? data.imageUrl.trim() : '',
    availability: data.availability !== undefined ? Boolean(data.availability) : true,
    createdBy: currentUser._id,
    franchise: currentUser.franchise
  });

  await newProduct.save();

  return await Product.findById(newProduct._id).populate('createdBy', 'name email');
};

export const updateProductService = async (currentUser, productId, data) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid Product ID format');
  }

  validateUpdateProductInput(data);

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Product not found');
  }

  // DATA ISOLATION GUARD
  if (product.franchise?.toString() !== currentUser.franchise?.toString()) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Forbidden: You do not have permission to edit products belonging to another franchise');
  }

  const { name, category, price, description, imageUrl, availability } = data;

  if (name !== undefined) product.name = name.trim();
  if (category !== undefined) product.category = category;
  if (price !== undefined) product.price = Number(price);
  if (description !== undefined) product.description = description.trim();
  if (imageUrl !== undefined) product.imageUrl = imageUrl.trim();
  if (availability !== undefined) product.availability = Boolean(availability);

  await product.save();

  return await Product.findById(productId).populate('createdBy', 'name email');
};

export const deleteProductService = async (currentUser, productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid Product ID format');
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Product not found');
  }

  // DATA ISOLATION GUARD
  if (product.franchise?.toString() !== currentUser.franchise?.toString()) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Forbidden: You do not have permission to delete products belonging to another franchise');
  }

  await Product.findByIdAndDelete(productId);
  return { message: 'Product deleted permanently' };
};

export const toggleProductAvailabilityService = async (currentUser, productId, availability) => {
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

  // DATA ISOLATION GUARD
  if (product.franchise?.toString() !== currentUser.franchise?.toString()) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Forbidden: You do not have permission to modify availability of products belonging to another franchise');
  }

  product.availability = availability;
  await product.save();

  return await Product.findById(productId).populate('createdBy', 'name email');
};
