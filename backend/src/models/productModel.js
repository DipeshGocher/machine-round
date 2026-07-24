import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      minlength: [2, 'Product name must be at least 2 characters'],
      maxlength: [100, 'Product name cannot exceed 100 characters'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Pizza', 'Burger', 'Beverages', 'Dessert', 'Other'],
        message: 'Category must be one of: Pizza, Burger, Beverages, Dessert, Other'
      }
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0.01, 'Price must be a positive number greater than zero']
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      trim: true,
      default: ''
    },
    imageUrl: {
      type: String,
      trim: true,
      default: ''
    },
    availability: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'createdBy user reference is required']
    },
    franchise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Franchise',
      required: [true, 'Franchise reference is required']
    }
  },
  {
    timestamps: true
  }
);

export const Product = mongoose.model('Product', productSchema);
