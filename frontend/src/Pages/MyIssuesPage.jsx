import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import IssueCard from "../Component/IssueCard";
import { motion } from "framer-motion";
import { Plus } from "lucide-react"; // Add icon

const MyIssuesPage = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyIssues = async () => {
      try {
        const response = await axios.get("https://community-problem-tracker-3.onrender.com/api/v1/issues/get-my-issues", {
          withCredentials: true,
        });
        console.log("response:", response.data.issues);
        setIssues(response.data.issues);
      } catch (err) {
        setError("Failed to fetch issues. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyIssues();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="p-6 min-h-screen bg-gray-100 relative" // Add relative for positioning
    >
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">My Reported Issues</h1>

      {loading ? (
        <p className="text-gray-600 text-center">Loading issues...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : issues.length === 0 ? (
        <p className="text-gray-600 text-center">No issues reported yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((issue) => (
            <IssueCard key={issue._id} issue={issue} />
          ))}
        </div>
      )}

      {/* Floating Add Button */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate("/issue-form")}
        className="fixed bottom-10 right-10 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center justify-center"
      >
        <Plus size={24} />
      </motion.button>
    </motion.div>
  );
};

export default MyIssuesPage;
