import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  Laptop,
  Smartphone,
  Tablet,
  Plus,
  AlertTriangle,
  Shield,
} from "lucide-react";

const SecurityDashboard = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [ipInput, setIpInput] = useState("");
  const [ipRestrictions, setIpRestrictions] = useState([]);

  // Login activity data
  const [loginActivity] = useState([
    {
      type: "success",
      location: "New York, USA",
      time: "Now",
      id: 1,
    },
    {
      type: "success",
      location: "New York, USA",
      time: "Yesterday, 3:24 PM",
      id: 2,
    },
    {
      type: "failed",
      location: "London, UK",
      time: "July 26, 2025",
      id: 3,
    },
    {
      type: "success",
      location: "New York, USA",
      time: "July 25, 2025",
      id: 4,
    },
  ]);

  // Active devices data
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: "MacBook Pro",
      type: "laptop",
      location: "New York USA",
      ip: "192.168.1.1",
      lastActive: "Now",
      current: true,
    },
    {
      id: 2,
      name: "iPhone 15",
      type: "phone",
      location: "New York USA",
      ip: "192.168.1.2",
      lastActive: "2 hours ago",
      current: false,
    },
    {
      id: 3,
      name: "iPad air",
      type: "tablet",
      location: "New York USA",
      ip: "192.168.1.2",
      lastActive: "3 days ago",
      current: false,
    },
  ]);

  const getDeviceIcon = (type) => {
    switch (type) {
      case "laptop":
        return <Laptop className="w-5 h-5 text-gray-600" />;
      case "phone":
        return <Smartphone className="w-5 h-5 text-gray-600" />;
      case "tablet":
        return <Tablet className="w-5 h-5 text-gray-600" />;
      default:
        return <Laptop className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleLogout = (deviceId) => {
    if (devices.find((d) => d.id === deviceId)?.current) {
      alert("Cannot logout from current device");
      return;
    }
    setDevices(devices.filter((device) => device.id !== deviceId));
  };

  const handleLogoutAll = () => {
    setDevices(devices.filter((device) => device.current));
  };

  const addIpRestriction = () => {
    if (ipInput.trim() && !ipRestrictions.includes(ipInput.trim())) {
      setIpRestrictions([...ipRestrictions, ipInput.trim()]);
      setIpInput("");
    }
  };

  const removeIpRestriction = (ip) => {
    setIpRestrictions(
      ipRestrictions.filter((restriction) => restriction !== ip)
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addIpRestriction();
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Security</h1>
          <p className="text-gray-600">Manage your account security</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Two-Factor Authentication */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Two-Factor Authentication
                </h2>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={twoFactorEnabled}
                    onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    className={`w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${
                      twoFactorEnabled ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 mt-0.5 ${
                        twoFactorEnabled
                          ? "translate-x-6 ml-0.5"
                          : "translate-x-0.5"
                      }`}
                    />
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Add an extra layer of security to your account by requiring a
                verification code along with your password when signing in.
              </p>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  twoFactorEnabled
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {twoFactorEnabled ? "Configure 2FA" : "Set Up 2FA"}
              </button>
            </div>

            {/* Active Devices */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Active Devices
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-600">
                        Device
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">
                        Location
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">
                        IP Address
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">
                        Last Active
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {devices.map((device) => (
                      <tr
                        key={device.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            {getDeviceIcon(device.type)}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">
                                  {device.name}
                                </span>
                                {device.current && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                    Current
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-gray-700">
                          {device.location}
                        </td>
                        <td className="py-4 text-gray-700">{device.ip}</td>
                        <td className="py-4 text-gray-700">
                          {device.lastActive}
                        </td>
                        <td className="py-4">
                          <button
                            onClick={() => handleLogout(device.id)}
                            disabled={device.current}
                            className={`text-sm ${
                              device.current
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-red-600 hover:text-red-800"
                            }`}
                          >
                            Logout
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={handleLogoutAll}
                className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm mt-4 transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
                Logout from all devices
              </button>
            </div>

            {/* IP Restrictions */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                IP Restrictions
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Limit access to your account to specific IP addresses or ranges.
              </p>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={ipInput}
                  onChange={(e) => setIpInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter IP Address"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                />
                <button
                  onClick={addIpRestriction}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              <div className="text-xs text-gray-500 mb-4">
                Example: 192.168.1.1 or 192.168.1.0/24
              </div>

              {ipRestrictions.length > 0 ? (
                <div className="space-y-2">
                  {ipRestrictions.map((ip, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                    >
                      <span className="text-sm text-gray-700">{ip}</span>
                      <button
                        onClick={() => removeIpRestriction(ip)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No IP restrictions added yet
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Login Activity */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Login Activity
              </h2>

              <div className="space-y-3 mb-4">
                {loginActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === "success"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {activity.type === "success"
                          ? "Successful login"
                          : "Failed login attempt"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {activity.location} • {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                View all activity
              </button>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-red-200">
              <h2 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </h2>

              <div className="space-y-6">
                {/* Reset Password */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Reset Password
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Change your account password.
                  </p>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                    Reset Password
                  </button>
                </div>

                {/* Deactivate Account */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Deactivate Account
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Temporarily disable your account.
                  </p>
                  <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors">
                    Deactivate
                  </button>
                </div>

                {/* Delete Account */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Delete Account
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Permanently delete your account and all data.
                  </p>
                  <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SecurityDashboard;
