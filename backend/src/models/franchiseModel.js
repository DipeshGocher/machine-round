import mongoose from 'mongoose';

const franchiseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Franchise name is required'],
      unique: true,
      minlength: [3, 'Franchise name must be at least 3 characters'],
      maxlength: [60, 'Franchise name cannot exceed 60 characters'],
      trim: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner user reference is required']
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      maxlength: [50, 'City cannot exceed 50 characters'],
      trim: true
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active'
    }
  },
  {
    timestamps: true
  }
);

export const Franchise = mongoose.model('Franchise', franchiseSchema);
