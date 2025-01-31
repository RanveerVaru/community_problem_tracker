import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const DashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [issues, setIssues] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalIssues, setTotalIssues] = useState(0);
  const navigate = useNavigate(); // Initialize navigation

  const issues_ = useSelector((state) => state.issue.issues);
  console.log("issues from redux", issues);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const usersRes = await axios.get("https://community-problem-tracker-3.onrender.com/api/v1/user/all-users", {
        withCredentials: true,
      });
      const issuesRes = issues_;
      setUsers(usersRes.data.users);
      setIssues(issuesRes);
      setTotalUsers(usersRes.data.users.length);
      setTotalIssues(issuesRes.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`https://community-problem-tracker-3.onrender.com/api/v1/user/delete-user/${userId}`, { withCredentials: true });
      setUsers(users.filter((user) => user._id !== userId));
      setTotalUsers((prev) => prev - 1);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const deleteIssue = async (issueId) => {
    try {
      await axios.delete(`https://community-problem-tracker-3.onrender.com/api/v1/issues/delete/${issueId}`, { withCredentials: true });
      setIssues(issues.filter((issue) => issue._id !== issueId));
      setTotalIssues((prev) => prev - 1);
    } catch (error) {
      console.error("Error deleting issue:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-200 p-4 rounded-lg text-center">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-xl font-bold">{totalUsers}</p>
        </div>
        <div className="bg-green-200 p-4 rounded-lg text-center">
          <h2 className="text-lg font-semibold">Total Issues</h2>
          <p className="text-xl font-bold">{totalIssues}</p>
        </div>
      </div>

      {/* Users List */}
      <h2 className="text-xl font-semibold mb-2">Users</h2>
      <div className="overflow-y-auto max-h-72">
        <div className="grid grid-cols-1 gap-4">
          {users.map((user) => (
            <div key={user._id} className="bg-gray-100 p-4 rounded-lg flex justify-between items-center hover:bg-gray-200 transition duration-300">
              <div className="flex flex-col">
                <span className="font-semibold">{user.name}</span>
                <span className="text-sm text-gray-500">{user.email}</span>
              </div>
              <button
                className="text-red-600 font-semibold"
                onClick={() => deleteUser(user._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
   {/* Issues List */}
<h2 className="text-xl font-semibold mt-6 mb-2">Issues</h2>
<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {issues.map((issue) => (
    <div key={issue._id} className="bg-gray-100 p-4 rounded-lg flex flex-col md:flex-row justify-between">
      <div>
        <span className="block font-semibold">{issue.title}</span>
        <span className="text-sm text-gray-600">By: {issue.author?.name}</span>
        <span className="block text-sm">Status: {issue.status}</span>
      </div>
      <div className="flex gap-2 mt-2 md:mt-0"> {/* Add spacing on mobile */}
        <button
          className="text-blue-600 font-semibold"
          onClick={() => navigate(`/issue-form/${issue._id}`)} // Navigate to update form
        >
          Update
        </button>
        <button
          className="text-red-600 font-semibold"
          onClick={() => deleteIssue(issue._id)}
        >
          Delete
        </button>
      </div>
    </div>
  ))}
</div>

    </div>
  );
};

export default DashboardPage;
