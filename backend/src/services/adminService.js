import mongoose from 'mongoose';
import { Franchise } from '../models/franchiseModel.js';
import { User } from '../models/userModel.js';
import { Product } from '../models/productModel.js';
import { ApiError } from '../utils/apiError.js';
import { HTTP_STATUS } from '../utils/statusCodes.js';
import {
  validateCreateFranchiseInput,
  validateUpdateFranchiseInput
} from '../utils/validators.js';

export const getDashboardStatsService = async () => {
  const [
    totalFranchises,
    activeFranchises,
    inactiveFranchises,
    totalStaff,
    totalProducts
  ] = await Promise.all([
    Franchise.countDocuments(),
    Franchise.countDocuments({ status: 'Active' }),
    Franchise.countDocuments({ status: 'Inactive' }),
    User.countDocuments({ role: 'staff' }),
    Product.countDocuments()
  ]);

  return {
    totalFranchises,
    activeFranchises,
    inactiveFranchises,
    totalStaff,
    totalProducts
  };
};

export const createFranchiseService = async (data) => {
  validateCreateFranchiseInput(data);

  const { name, ownerName, ownerEmail, ownerPassword, city } = data;
  const normalizedEmail = ownerEmail.toLowerCase().trim();
  const trimmedName = name.trim();

  // Check duplicate franchise name
  const existingFranchise = await Franchise.findOne({ name: trimmedName });
  if (existingFranchise) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'A franchise with this name already exists');
  }

  // Check duplicate owner email
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'A user with this email already exists');
  }

  let ownerUser = null;
  let newFranchise = null;

  try {
    // 1. Create Franchise Owner User
    ownerUser = new User({
      name: ownerName.trim(),
      email: normalizedEmail,
      password: ownerPassword,
      role: 'franchise',
      status: 'Active'
    });
    await ownerUser.save();

    // 2. Create Franchise Record
    newFranchise = new Franchise({
      name: trimmedName,
      owner: ownerUser._id,
      city: city.trim(),
      status: 'Active'
    });
    await newFranchise.save();

    // 3. Link Franchise ID back to Owner User
    ownerUser.franchise = newFranchise._id;
    await ownerUser.save();

    const populatedFranchise = await Franchise.findById(newFranchise._id).populate(
      'owner',
      'name email role status createdAt'
    );

    return populatedFranchise;
  } catch (error) {
    // Manual Rollback if creation fails at any step
    if (newFranchise && newFranchise._id) {
      await Franchise.findByIdAndDelete(newFranchise._id);
    }
    if (ownerUser && ownerUser._id) {
      await User.findByIdAndDelete(ownerUser._id);
    }
    throw error;
  }
};

export const getFranchisesService = async () => {
  return await Franchise.find()
    .populate('owner', 'name email role status createdAt')
    .sort({ createdAt: -1 });
};

export const getFranchiseOverviewService = async (franchiseId) => {
  if (!mongoose.Types.ObjectId.isValid(franchiseId)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid Franchise ID format');
  }

  const franchise = await Franchise.findById(franchiseId).populate(
    'owner',
    'name email status role createdAt'
  );

  if (!franchise) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Franchise not found');
  }

  const [staffList, productList] = await Promise.all([
    User.find({ franchise: franchiseId, role: 'staff' }).select('-password').sort({ createdAt: -1 }),
    Product.find({ franchise: franchiseId }).sort({ createdAt: -1 })
  ]);

  return {
    franchise: {
      _id: franchise._id,
      name: franchise.name,
      city: franchise.city,
      status: franchise.status,
      createdAt: franchise.createdAt,
      updatedAt: franchise.updatedAt
    },
    owner: franchise.owner,
    totalStaff: staffList.length,
    totalProducts: productList.length,
    staffList,
    productList
  };
};

export const updateFranchiseService = async (franchiseId, data) => {
  if (!mongoose.Types.ObjectId.isValid(franchiseId)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid Franchise ID format');
  }

  validateUpdateFranchiseInput(data);

  const franchise = await Franchise.findById(franchiseId);
  if (!franchise) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Franchise not found');
  }

  const { name, ownerName, ownerEmail, city, status } = data;

  // Check duplicate franchise name if changing
  if (name && name.trim() !== franchise.name) {
    const existingName = await Franchise.findOne({ name: name.trim(), _id: { $ne: franchiseId } });
    if (existingName) {
      throw new ApiError(HTTP_STATUS.CONFLICT, 'Franchise name already in use');
    }
    franchise.name = name.trim();
  }

  if (city) {
    franchise.city = city.trim();
  }

  if (status) {
    franchise.status = status;
  }

  await franchise.save();

  // Update Owner User details if provided
  if (franchise.owner) {
    const ownerUser = await User.findById(franchise.owner);
    if (ownerUser) {
      if (ownerName) {
        ownerUser.name = ownerName.trim();
      }

      if (ownerEmail && ownerEmail.toLowerCase().trim() !== ownerUser.email) {
        const normalizedEmail = ownerEmail.toLowerCase().trim();
        const existingEmail = await User.findOne({
          email: normalizedEmail,
          _id: { $ne: ownerUser._id }
        });
        if (existingEmail) {
          throw new ApiError(HTTP_STATUS.CONFLICT, 'Owner email already in use by another user');
        }
        ownerUser.email = normalizedEmail;
      }

      if (status) {
        ownerUser.status = status;
      }

      await ownerUser.save();
    }
  }

  return await Franchise.findById(franchiseId).populate('owner', 'name email role status createdAt');
};

export const toggleFranchiseStatusService = async (franchiseId, status) => {
  if (!mongoose.Types.ObjectId.isValid(franchiseId)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid Franchise ID format');
  }

  if (!['Active', 'Inactive'].includes(status)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Status must be Active or Inactive');
  }

  const franchise = await Franchise.findById(franchiseId);
  if (!franchise) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Franchise not found');
  }

  franchise.status = status;
  await franchise.save();

  // Cascade status update to owner and staff users belonging to this franchise
  if (franchise.owner) {
    await User.findByIdAndUpdate(franchise.owner, { status });
  }

  // Update all staff under this franchise
  await User.updateMany({ franchise: franchiseId }, { status });

  return await Franchise.findById(franchiseId).populate('owner', 'name email role status createdAt');
};

export const getAllUsersService = async () => {
  const users = await User.find()
    .select('-password')
    .populate('franchise', 'name city status')
    .sort({ createdAt: -1 });

  return users;
};

export const getAdminStaffListService = async () => {
  const staffMembers = await User.find({ role: 'staff' })
    .select('-password')
    .populate('franchise', 'name city status')
    .sort({ createdAt: -1 });

  return staffMembers;
};

export const getAdminProductsService = async () => {
  const products = await Product.find()
    .populate('franchise', 'name city status')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  return products;
};
