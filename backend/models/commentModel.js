import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    issueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true },
    commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  });
  
export const Comment = mongoose.model('Comment', commentSchema);
  