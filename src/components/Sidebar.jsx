import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Edit,
  FileText,
  File,
  Settings,
  BarChart3,
  Shield,
  CreditCard,
  UserCheck,
  Settings as LucideSettings,
  Menu,
  X,
} from "lucide-react";
import logo from "../assets/logo.jpg";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    {
      id: "dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Dashboard",
      path: "/dashboard",
    },
    { 
      id: "contacts", 
      icon: <Users className="w-5 h-5" />, 
      label: "Contacts",
      path: "/contacts"
    },
    { 
      id: "composer", 
      icon: <Edit className="w-5 h-5" />, 
      label: "Composer",
      path: "/composer"
    },
    { 
      id: "logs", 
      icon: <FileText className="w-5 h-5" />, 
      label: "Logs",
      path: "/logs"
    },
    { 
      id: "templates", 
      icon: <File className="w-5 h-5" />, 
      label: "Templates",
      path: "/templates"
    },
    {
      id: "automations",
      icon: <Settings className="w-5 h-5" />,
      label: "Automations",
      path: "/automations"
    },
    {
      id: "analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      label: "Analytics",
      path: "/analytics"
    },
    { 
      id: "security", 
      icon: <Shield className="w-5 h-5" />, 
      label: "Security",
      path: "/security"
    },
    {
      id: "billing",
      icon: <CreditCard className="w-5 h-5" />,
      label: "Billing",
      path: "/billing"
    },
    {
      id: "settings",
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      path: "/settings"
    },
    {
      id: "admin",
      icon: <UserCheck className="w-5 h-5" />,
      label: "Admin",
      path: "/admin"
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div className={`
        fixed md:static inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col
      `}>
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={logo}
              alt="WhatsBroadcast Logo"
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold text-gray-800">
              WhatsBroadcast
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="md:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-green-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Connected</span>
          </div>
        </div>
      </div>
    </>
  );
}