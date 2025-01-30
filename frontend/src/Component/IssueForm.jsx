import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from 'react-hot-toast';

const IssueForm = () => {
  const { id } = useParams(); // Get issue ID from URL
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState([]);
  
  const navigate = useNavigate();

  // Fetch issue details if editing
  useEffect(() => {
    if (id) {
      axios.get(`https://community-problem-tracker-3.onrender.com/api/v1/issues/get-issue/${id}`, { withCredentials: true })
        .then((res) => {
          const issue = res.data.issue;
          setTitle(issue.title);
          setDescription(issue.description);
          setCategory(issue.category);
          setLocation(issue.location);
        })
        .catch((err) => console.error("Error fetching issue:", err));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('location', location);
    Array.from(images).forEach((image) => formData.append('images', image));

    try {
      if (id) {
        // Update issue if id exists
        const response = await axios.put(`https://community-problem-tracker-3.onrender.com/api/v1/issues/update/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
        toast.success(response.data.message);
        
      } else {
        // Create new issue
        const response = await axios.post('https://community-problem-tracker-3.onrender.com/api/v1/issues/create', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
        toast.success(response.data.message);
      }
      navigate('/');
      window.location.reload();
      
    } catch (error) {
      console.error('Error submitting the issue:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 pt-16">
      <form 
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg space-y-5"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-gray-700 text-center">
          {id ? "Update Issue" : "Report an Issue"}
        </h2>

        {/* Title & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            rows="3"
            required
          />
        </div>

        {/* Category & Image Upload */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Category</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Safety">Safety</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Upload Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setImages(e.target.files)}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition focus:ring-2 focus:ring-blue-500"
        >
          {id ? "Update Issue" : "Submit Issue"}
        </button>
      </form>
    </div>
  );
};

export default IssueForm;
