import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react"; // Icons
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { logout } from "../redux/slices/authSlice";
import { setSearchResults, clearSearchResults } from "../redux/slices/issueSlice";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Search input state
  const location = useLocation();
  const dispatch = useDispatch();

  // Get authentication state
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const is_admin = useSelector((state) => state.auth.isAdmin);

  // Logout function
  const handleLogout = () => {
    dispatch(logout());
  };

  // Function to check if the current path is active
  const isActive = (path) => (location.pathname === path ? "text-blue-600" : "text-gray-700");

  // Fetch search results when `searchQuery` changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim() === "") {
        dispatch(clearSearchResults()); // Clear search results if input is empty
        return;
      }
      try {
        const encodedQuery = encodeURIComponent(searchQuery.trim());
        const { data } = await axios.get(`http://localhost:4000/api/v1/issues/search?title=${encodedQuery}`);
        dispatch(setSearchResults(data.issues)); // Update Redux store with search results
      } catch (error) {
        console.error("Error searching issues:", error);
      }
    };

    // Debounce search requests
    const delayDebounce = setTimeout(fetchSearchResults, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, dispatch]);

  return (
    <nav className="w-full bg-gray-200 shadow-md fixed top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-2 flex justify-between items-center">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
          <img src="web-page-logo.jpg" alt="Logo" className="w-12 h-12 rounded-full border-2 border-gray-300 shadow-md" />
          <span className="text-lg font-semibold text-gray-800">Community Tracker</span>
        </motion.div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-6">
          <li className={`hover:text-blue-600 transition ${isActive("/")}`}>
            <Link to="/">Home</Link>
          </li>

          {isAuthenticated && (
            <li className={`hover:text-blue-600 transition ${isActive("/my-issues")}`}>
              <Link to="/my-issues">My Issues</Link>
            </li>
          )}

          {/* Show Dashboard if user is an admin */}
          {is_admin && (
            <li className={`hover:text-blue-600 transition ${isActive("/admin-dashboard")}`}>
              <Link to="/admin-dashboard">Dashboard</Link>
            </li>
          )}

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {isAuthenticated ? (
            <li>
              <button onClick={handleLogout} className="text-red-600 font-semibold hover:text-red-700 transition">
                Logout
              </button>
            </li>
          ) : (
            <>
              <li className={`hover:text-blue-600 transition ${isActive("/login")}`}>
                <Link to="/login">Login</Link>
              </li>
              <li className={`hover:text-blue-600 transition ${isActive("/signup")}`}>
                <Link to="/signup">Signup</Link>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden bg-white shadow-md">
          <ul className="flex flex-col items-center gap-4 py-4 text-gray-700">
            <li className={`hover:text-blue-600 transition ${isActive("/")}`}>
              <Link to="/">Home</Link>
            </li>

            {isAuthenticated && (
              <li className={`hover:text-blue-600 transition ${isActive("/my-issues")}`}>
                <Link to="/my-issues">My Issues</Link>
              </li>
            )}

            {/* Show Dashboard if user is an admin */}
            {is_admin && (
              <li className={`hover:text-blue-600 transition ${isActive("/admin-dashboard")}`}>
                <Link to="/admin-dashboard">Dashboard</Link>
              </li>
            )}

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {isAuthenticated ? (
              <li>
                <button onClick={handleLogout} className="text-red-600 font-semibold hover:text-red-700 transition">
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li className={`hover:text-blue-600 transition ${isActive("/login")}`}>
                  <Link to="/login">Login</Link>
                </li>
                <li className={`hover:text-blue-600 transition ${isActive("/signup")}`}>
                  <Link to="/signup">Signup</Link>
                </li>
              </>
            )}
          </ul>
        </motion.div>
      )}
    </nav>
  );
};

export default Header;
