import React from "react";
import { Link } from "react-router-dom";
import whatImg from "../assets/what.png";
import logo from "../assets/logo.jpg";
import { Check, MessageCircle } from "lucide-react";
import TrustedBySection from "../components/TrustedSection.jsx";
const Landingpage = () => {
  return (
    <>
      <div className="min-h-screen bg-white">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img src={logo} alt="WhatsApp logo" />
                </div>
                <span className="text-xl font-semibold text-green-500">
                  WhatsBroadcast
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <button className="px-5 py-2 border-2 border-green-500 text-green-500 font-semibold rounded-lg hover:bg-green-50 transition-colors">
                    Sign in
                  </button>
                </Link>

                <Link to="/signup">
                  <button className="px-5 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-lg">
                    Sign up
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <h1 className="text-4xl lg:text-5xl font-bold text-green-500 leading-tight">
                  Streamline Your WhatsApp Broadcasts
                </h1>

                <p className="text-lg text-gray-800 font-medium">
                  Easily manage bulk messaging, contacts, and analytics — all in
                  one powerful platform.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6   flex items-center justify-center">
                      <Check
                        className="w-6 h-6   text-green-500"
                        strokeWidth={5}
                      />
                    </div>
                    <span className="text-gray-800 font-medium">
                      Bulk Messaging
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6   flex items-center justify-center">
                      <Check
                        className="w-6 h-6 text-green-500"
                        strokeWidth={5}
                      />
                    </div>
                    <span className="text-gray-800 font-medium">
                      Contact Management
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6  flex items-center justify-center">
                      <Check
                        className="w-6 h-6 text-green-500"
                        strokeWidth={5}
                      />
                    </div>
                    <span className="text-gray-800 font-medium">
                      Real-time Analytics
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/signup">
                    <button className="px-8 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-lg">
                      Get Started
                    </button>
                  </Link>
                  <Link to="/features">
                  <button className="px-8 py-3 border-2 border-green-500 text-green-500 font-semibold rounded-lg hover:bg-green-50 transition-colors">
                    Learn More
                  </button>
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="relative z-10">
                  <img
                    src={whatImg}
                    alt="WhatsApp Interface"
                    width={600}
                    height={700}
                    className="mx-auto"
                  />
                </div>

                <div className="absolute top-0 left-0 w-32 h-32 bg-green-100 rounded-full opacity-50 -z-10"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-green-200 rounded-full opacity-30 -z-10"></div>
              </div>
            </div>
          </div>
        </section>

        <div>
          <TrustedBySection />
        </div>

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
    </>
  );
};

export default Landingpage;
