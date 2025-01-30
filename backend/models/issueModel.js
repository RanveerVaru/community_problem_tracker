import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String , required: true},
  images: [
    {
      public_id: { type: String, required: true }, // Cloudinary or other storage public ID
      url: { type: String, required: true }, // Image URL
    },
  ],
  category: { type: String, required: true },
  status: { type: String, enum: ['reported', 'in progress', 'resolved'], default: 'reported' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
} , {timestamps :true});

export const Issue = mongoose.model('Issue', issueSchema);
