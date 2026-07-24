import { ApiError } from './apiError.js';
import { HTTP_STATUS } from './statusCodes.js';

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email.trim());
};

export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  if (password.length < 8 || password.length > 20) return false;

  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const numberRegex = /[0-9]/;
  const specialCharRegex = /[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]/;

  return (
    uppercaseRegex.test(password) &&
    lowercaseRegex.test(password) &&
    numberRegex.test(password) &&
    specialCharRegex.test(password)
  );
};

export const validateUrl = (url) => {
  if (!url || typeof url !== 'string' || url.trim() === '') return true; // Optional
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export const validateCreateFranchiseInput = (data) => {
  const { name, ownerName, ownerEmail, ownerPassword, city } = data;

  if (!name || typeof name !== 'string' || name.trim().length < 3 || name.trim().length > 60) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Franchise name is required (3 to 60 characters)');
  }

  if (!ownerName || typeof ownerName !== 'string' || ownerName.trim().length < 3 || ownerName.trim().length > 40) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Owner name is required (3 to 40 characters)');
  }

  if (!ownerEmail || !validateEmail(ownerEmail)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'A valid owner email is required');
  }

  if (!ownerPassword || !validatePassword(ownerPassword)) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      'Password must be 8-20 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character'
    );
  }

  if (!city || typeof city !== 'string' || city.trim().length === 0 || city.trim().length > 50) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'City is required (up to 50 characters)');
  }
};

export const validateUpdateFranchiseInput = (data) => {
  const { name, ownerName, ownerEmail, city, status } = data;

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length < 3 || name.trim().length > 60) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Franchise name must be between 3 and 60 characters');
    }
  }

  if (ownerName !== undefined) {
    if (typeof ownerName !== 'string' || ownerName.trim().length < 3 || ownerName.trim().length > 40) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Owner name must be between 3 and 40 characters');
    }
  }

  if (ownerEmail !== undefined) {
    if (!validateEmail(ownerEmail)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Please provide a valid owner email');
    }
  }

  if (city !== undefined) {
    if (typeof city !== 'string' || city.trim().length === 0 || city.trim().length > 50) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'City must be non-empty and up to 50 characters');
    }
  }

  if (status !== undefined) {
    if (!['Active', 'Inactive'].includes(status)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Status must be either Active or Inactive');
    }
  }
};

export const validateAddStaffInput = (data) => {
  const { name, email, password, designation } = data;

  if (!name || typeof name !== 'string' || name.trim().length < 3 || name.trim().length > 40) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Staff name is required (3 to 40 characters)');
  }

  if (!email || !validateEmail(email)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'A valid email is required');
  }

  if (!password || !validatePassword(password)) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      'Password must be 8-20 characters long and include uppercase, lowercase, number, and special character'
    );
  }

  if (!designation || typeof designation !== 'string' || designation.trim().length === 0 || designation.trim().length > 50) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Designation is required (up to 50 characters)');
  }
};

export const validateUpdateStaffInput = (data) => {
  const { name, email, designation } = data;

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length < 3 || name.trim().length > 40) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Staff name must be between 3 and 40 characters');
    }
  }

  if (email !== undefined) {
    if (!validateEmail(email)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Please provide a valid email');
    }
  }

  if (designation !== undefined) {
    if (typeof designation !== 'string' || designation.trim().length === 0 || designation.trim().length > 50) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Designation must be up to 50 characters');
    }
  }
};

export const validateAddProductInput = (data) => {
  const { name, category, price, description, imageUrl } = data;

  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Product name is required (2 to 100 characters)');
  }

  const validCategories = ['Pizza', 'Burger', 'Beverages', 'Dessert', 'Other'];
  if (!category || !validCategories.includes(category)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Category must be one of: ${validCategories.join(', ')}`);
  }

  const numericPrice = Number(price);
  if (isNaN(numericPrice) || numericPrice <= 0) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Price must be a positive number greater than zero');
  }

  if (description && (typeof description !== 'string' || description.length > 500)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Description cannot exceed 500 characters');
  }

  if (imageUrl && !validateUrl(imageUrl)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Image URL must be a valid URL');
  }
};

export const validateUpdateProductInput = (data) => {
  const { name, category, price, description, imageUrl, availability } = data;

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Product name must be between 2 and 100 characters');
    }
  }

  if (category !== undefined) {
    const validCategories = ['Pizza', 'Burger', 'Beverages', 'Dessert', 'Other'];
    if (!validCategories.includes(category)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Category must be one of: ${validCategories.join(', ')}`);
    }
  }

  if (price !== undefined) {
    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Price must be a positive number greater than zero');
    }
  }

  if (description !== undefined && description !== null) {
    if (typeof description !== 'string' || description.length > 500) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Description cannot exceed 500 characters');
    }
  }

  if (imageUrl !== undefined && imageUrl !== null && imageUrl !== '') {
    if (!validateUrl(imageUrl)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Image URL must be a valid URL');
    }
  }

  if (availability !== undefined) {
    if (typeof availability !== 'boolean') {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Availability must be a boolean');
    }
  }
};
