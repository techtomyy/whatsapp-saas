import React from "react";

const Footer = () => {
  return (
    <div >
      <footer className="bg-white py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500">© 2025 WhatsBroadcast</div>
            <div className="flex space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-700">
                Terms of Service
              </a>
              <a href="#" className="hover:text-gray-700">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
