import React, { useState  } from "react";
import { motion } from "framer-motion";
import { FaExclamationCircle, FaCheckCircle, FaSpinner, FaEllipsisV } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {useNavigate} from "react-router-dom"

const IssueCard = ({ issue }) => {
  const { _id, title, description, location, images, category, status, createdAt, createdBy } = issue;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const isAuthorized = user && (user.role === "admin" || user._id === createdBy?._id);

  // Fetch all comments
  const getCommentsOfPost = async () => {
    try {
      const response = await axios.get(`https://community-problem-tracker-3.onrender.com/api/v1/comment/get-all-comments/${_id}`);
      setComments(response.data.comments);
      setShowComments(true);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Add a new comment
  const addComment = async () => {
    if (!newComment.trim()) return;
    try {
      if(!user) {
        toast.error("You must be logged in to comment!")
        navigate('/login')
      } 
      await axios.post(
        `https://community-problem-tracker-3.onrender.com/api/v1/comment/add-comment/${_id}`,
        { content: newComment },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      setNewComment("");
      getCommentsOfPost();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Delete issue
  const deleteIssue = async () => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;
    try {
      const res = await axios.delete(`https://community-problem-tracker-3.onrender.com/api/v1/issues/delete/${_id}`, { withCredentials: true });
      if (res.data.success) {
        toast.success("Issue deleted successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting issue:", error);
    }
  };

  // Image navigation
  const handleNextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const handlePrevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  // Status helper functions
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "reported":
        return "bg-yellow-500";
      case "in progress":
        return "bg-blue-500";
      case "resolved":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "reported":
        return <FaExclamationCircle className="text-yellow-500" size={18} />;
      case "in progress":
        return <FaSpinner className="text-blue-500 animate-spin" size={18} />;
      case "resolved":
        return <FaCheckCircle className="text-green-500" size={18} />;
      default:
        return <FaExclamationCircle className="text-gray-500" size={18} />;
    }
  };

  // Truncate description if too long
  const MAX_DESCRIPTION_LENGTH = 100;
  const truncatedDescription = description.length > MAX_DESCRIPTION_LENGTH
    ? description.slice(0, MAX_DESCRIPTION_LENGTH) + "..."
    : description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-lg rounded-lg overflow-hidden p-4 border border-gray-200 w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto"
    >
      {/* Image Section with Delete Options */}
      <div className="relative w-full h-48 md:h-56 overflow-hidden rounded-lg">
        <img src={images[currentImageIndex]?.url} alt={title} className="w-full h-full object-cover" />
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-full opacity-50 hover:opacity-100 transition"
            >
              &lt;
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-full opacity-50 hover:opacity-100 transition"
            >
              &gt;
            </button>
          </>
        )}

        {/* Three-dot menu for delete option */}
        {isAuthorized && (
          <div className="absolute top-2 right-2">
            <button onClick={() => setShowOptions(!showOptions)}>
              <FaEllipsisV className="text-gray-600 hover:text-gray-900" />
            </button>
            {showOptions && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-300 shadow-md rounded-lg p-2">
                <button onClick={deleteIssue} className="text-red-600 text-sm w-full text-left px-2 py-1 hover:bg-red-100">
                  Delete 
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Issue Details with Labels */}
      <div className="p-3 space-y-2">
        <h2 className="text-lg font-semibold text-gray-800">🔴 Problem: {title}</h2>
        <p className="text-gray-600 text-sm">
          <strong>Description:</strong> {showFullDescription ? description : truncatedDescription}
          {description.length > MAX_DESCRIPTION_LENGTH && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-blue-600 text-xs ml-1 hover:underline"
            >
              {showFullDescription ? "Show Less" : "Show More"}
            </button>
          )}
        </p>
        <p className="text-gray-600 text-sm">
          <strong>📍 Location:</strong> {location}
        </p>
        <p className="text-gray-600 text-sm">
          <strong>Category:</strong> <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">{category}</span>
        </p>
        <p className="text-gray-500 text-sm">
          <strong>🕒 Created On:</strong> {new Date(createdAt).toLocaleDateString()}
        </p>
        <p className="text-gray-600 text-sm">
          <strong>👤 Author:</strong> {createdBy?.name}
        </p>
        <div className="flex items-center gap-2">
          {getStatusIcon(status)}
          <span className={`text-white text-xs px-2 py-1 rounded-full ${getStatusColor(status)}`}>{status}</span>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-3">
        <h3 className="text-sm font-semibold text-gray-800">Comments</h3>
        <div className="mt-2 flex items-center space-x-2">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-3/4 p-2 text-xs border border-gray-300 rounded-lg"
            placeholder="Add a comment..."
          />
          <button onClick={addComment} className="bg-blue-600 text-white text-xs px-3 py-2 rounded-lg">
            Add
          </button>
        </div>

        {!showComments ? (
          <button onClick={getCommentsOfPost} className="text-blue-600 text-xs mt-2">View all comments</button>
        ) : (
          <button onClick={() => setShowComments(false)} className="text-red-600 text-xs mt-2">Hide comments</button>
        )}

        {showComments && comments.length > 0 && (
          <div className="mt-2 space-y-2 max-h-32 overflow-y-auto border-t pt-2">
            {comments.map((comment, index) => (
              <p key={index} className="bg-gray-100 p-2 rounded-lg text-xs text-gray-700">- {comment.content}</p>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default IssueCard;
