import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react"; // Icon for back button
import { useSelector, useDispatch } from "react-redux";
import { admin, login, logout } from "../redux/slices/authSlice.js";


const AuthForm = ({ type }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });


  const dispatch = useDispatch();
  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // API call for Login or Register
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = type === "login" 
        ? "http://localhost:4000/api/v1/user/login" 
        : "http://localhost:4000/api/v1/user/signup";
      
      const { data } = await axios.post(url, formData , {withCredentials: true});

      if (data.success) {
        if(type === "login") {
          dispatch(login(data.user)); // Dispatch login action with user data
          if(data.user.role === "admin") {
            dispatch(admin());
          }
        }
        toast.success(data.message || `${type === "login" ? "Logged in" : "Registered"} successfully!`);
        setFormData({name : "" , email : "" , password : ""});
        // Redirect after successful action
        setTimeout(() => {
          if (type === "login") {
            navigate("/"); // Redirect to home after login
          } else {
            navigate("/login"); // Redirect to login after signup
          }
        }, 1500);
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error, please try again!");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="flex items-center justify-center min-h-screen bg-gray-100 px-4"
    >
      <Toaster position="top-center" />
      
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm"> {/* Reduced width */}
        
        {/* Back to Home Button */}
        <button 
          onClick={() => navigate("/")} 
          className="flex items-center text-blue-600 hover:text-blue-700 font-semibold mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Home
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          {type === "login" ? "Login" : "Register"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field (Only for Register) */}
          {type === "register" && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
              required
            />
          )}

          {/* Email Field */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
            required
          />

          {/* Password Field */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {type === "login" ? "Login" : "Register"}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <p className="text-sm text-center mt-4">
          {type === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <a href={type === "login" ? "/signup" : "/login"} className="text-blue-600 font-semibold">
            {type === "login" ? "Register" : "Login"}
          </a>
        </p>
      </div>
    </motion.div>
  );
};

export default AuthForm;
