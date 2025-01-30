import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa'; // Importing the social media icons from react-icons

const Footer = () => {
  return (
    <footer className="w-full bg-gray-200 text-black shadow-md py-10 mt-10">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start">
          {/* Logo Section */}
          <div className="flex items-center gap-3 mb-6 sm:mb-0">
            <img 
              src="web-page-logo.jpg" 
              alt="Logo" 
              className="w-10 h-10 rounded-full border-2 border-gray-300 shadow-md"
            />
            <span className="text-lg font-semibold">Community Tracker</span>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center sm:items-start mb-6 sm:mb-0">
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-blue-500">Home</a></li>
              <li><a href="/about" className="hover:text-blue-500">About Us</a></li>
              <li><a href="/contact" className="hover:text-blue-500">Contact</a></li>
              <li><a href="/privacy-policy" className="hover:text-blue-500">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="flex space-x-6 mb-6 sm:mb-0">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-black-300 hover:text-blue-500">
              <FaFacebook size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-black-300 hover:text-blue-500">
              <FaTwitter size={24} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-black-300 hover:text-blue-500">
              <FaLinkedin size={24} />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-black-300 hover:text-blue-500">
              <FaGithub size={24} />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-sm text-black">
          <p>&copy; 2025 Community Tracker. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;