import React from 'react';
import { FaSadTear } from 'react-icons/fa'; // Importing a sad face icon
import { Link } from 'react-router-dom'; // For navigation back to home
import { motion } from 'framer-motion'; // For animations

const NotFoundPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-black"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-8xl mb-6"
      >
        <FaSadTear />
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-5xl font-bold mb-4 text-center"
      >
        404 - Page Not Found
      </motion.h1>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-xl mb-8 text-center"
      >
        Oops! The page you're looking for doesn't exist.
      </motion.p>

      {/* Back to Home Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Link
          to="/"
          className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-indigo-100 transition duration-300 shadow-lg"
        >
          Go Back Home
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default NotFoundPage;