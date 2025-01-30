import { Comment } from "../models/commentModel.js";

export const addComment = async (req, res) => {
  try {
    const user_id = req.user_token.id;
    if (!user_id) {
      return res.status(401).json({success : false , message: "Unauthorized" });
    }

    const issue_id = req.params.id;
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({success : false , message: "Content is required" });
    }

    const comment = new Comment({issueId : issue_id , commentedBy : user_id , content : content});

    await comment.save();

    res.status(200).json({success : true , message: "Comment added successfully", comment });

  } catch (error) {
    res.status(500).json({success : false , message: "Server Error" });
  }
};

export const getAllComments = async (req, res) => {
    try {
      const issue_id = req.params.id;
      const comments = await Comment.find({ issueId : issue_id }).sort({ createdAt: -1 });
      res.status(200).json({success : true , message: "Comments fetched successfully", comments });
      
    } catch (error) {
        res.status(500).json({success : false , message: "Server Error" });
    }
}

export const deleteComment = async (req, res) => {
    try {
        
      const user = req.user_token;
      const comment_id = req.params.id;
      const comment = await Comment.findById(comment_id);
      if (!comment) {
        return res.status(404).json({ success : false , message: "Comment not found" });
      }

      if(user.isAdmin || comment.commentedBy.toString() === req.user_token.id) {
        await comment.remove();
        res.status(200).json({ success : true , message: "Comment deleted successfully" });
        return;
      }

    return res.status(401).json({ success : false , message: "Unauthorized" });
      
    } catch (error) {
        res.status(500).json({success : false , message: "Server Error" });
    }
}
