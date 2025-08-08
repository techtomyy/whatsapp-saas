import React from "react";
import {
  MessageCircle,
  Send,
  Users,
  BarChart3,
  FileImage,
  Clock,
  Shield,
  CheckCircle,
} from "lucide-react";
import feature from "../assets/feature.png";

const Features = () => {
  const features = [
    {
      id: 1,
      title: "Bulk Messaging",
      icon: <Send className="w-6 h-6" />,
      color: "bg-green-500",
      details: [
        "Instantly send personalized messages to thousands of customers.",
        "Schedule messages, segment your lists, and automate follow-ups.",
      ],
    },
    {
      id: 2,
      title: "Contact Management",
      icon: <Users className="w-6 h-6" />,
      color: "bg-green-500",
      details: [
        "Organize contacts with tags and filters.",
        "Import/export customer lists easily.",
      ],
    },
    {
      id: 3,
      title: "Real-time Analytics",
      icon: <BarChart3 className="w-6 h-6" />,
      color: "bg-green-500",
      details: [
        "Track message delivery, read rates, and click-throughs.",
        "View detailed reports to optimize campaigns.",
      ],
    },
    {
      id: 4,
      title: "Media & File Support",
      icon: <FileImage className="w-6 h-6" />,
      color: "bg-green-500",
      details: [
        "Share images, videos, documents, and PDFs with zero compression.",
        "Engage your audience with rich media for better clarity and interaction.",
      ],
    },
    {
      id: 5,
      title: "Message Scheduling",
      icon: <Clock className="w-6 h-6" />,
      color: "bg-green-500",
      details: [
        "Pre-schedule your messages for specific times and dates to save time.",
        "Automate recurring reminders, offers, and updates effortlessly.",
      ],
    },
    {
      id: 6,
      title: "Privacy & Security",
      icon: <Shield className="w-6 h-6" />,
      color: "bg-green-500",
      details: [
        "End-to-end encryption ensures your chats and data are fully secure.",
        "GDPR-compliant platform that keeps user trust at the forefront.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-green-500">All-in-One</span> WhatsApp
            Broadcast Tool
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Automate your communication, manage contacts, and analyze engagement
            from one simple dashboard.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Core Features
              </h2>
            </div>

            <div className="space-y-8">
              {features.map((feature) => (
                <div key={feature.id} className="group">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-8 h-8 ${feature.color} rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm`}
                    >
                      {feature.id}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="text-gray-700">{feature.icon}</div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {feature.title}
                        </h3>
                      </div>

                      <div className="space-y-2 text-gray-600">
                        {feature.details.map((detail, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <p className="leading-relaxed">{detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="  flex flex-col mt-0  items-center">
              <img
                src={feature}
                alt="App Preview"
                className="h-90 w-270  hover:scale-105 transition-transform duration-300"
              />

              <div className="text-center mt-8">
                <button className="px-8 py-4 bg-green-500 text-white font-bold text-lg rounded-xl hover:bg-green-600 transform hover:scale-105 transition-all duration-200 shadow-lg">
                  Try for Free
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500">© 2025 WhatsBroadcast</div>
            <div className="flex space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-700 transition-colors">
                Terms of Service
              </a>
              <span className="text-gray-300">•</span>
              <a href="#" className="hover:text-gray-700 transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Features;
