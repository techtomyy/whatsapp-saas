import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  TrendingUp,
  TrendingDown,
  Send,
  UserPlus,
  File,
} from "lucide-react";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function WhatsAppDashboard() {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const data = {
    labels,
    datasets: [
      {
        label: "Sent",
        data: [],
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        tension: 0.4,
        fill: false,
        pointStyle: "circle",
      },
      {
        label: "Opened",
        data: [85, 98, 100, 92, 125, 140, 142],
        borderColor: "#22c55e",
        backgroundColor: "#22c55e",
        tension: 0.4,
        fill: false,
        pointBackgroundColor: "#22c55e",
        pointBorderColor: "#22c55e",
        pointRadius: 4,
      },
      {
        label: "Clicked",
        data: [],
        borderColor: "#facc15",
        backgroundColor: "#facc15",
        tension: 0.4,
        fill: false,
        pointStyle: "circle",
      },
      {
        label: "Bounced",
        data: [],
        borderColor: "#ef4444",
        backgroundColor: "#ef4444",
        tension: 0.4,
        fill: false,
        pointStyle: "circle",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "#e5e7eb",
        },
        beginAtZero: true,
        ticks: {
          stepSize: 20,
        },
      },
    },
  };

  const stats = [
    {
      title: "Message Sent",
      value: "1,248",
      change: "+12%",
      period: "Last 30 days",
      trend: "up",
    },
    {
      title: "Active Contacts",
      value: "357",
      change: "+5%",
      period: "Last 30 days",
      trend: "up",
    },
    {
      title: "Open Rate",
      value: "92%",
      change: "+2%",
      period: "Last 30 days",
      trend: "up",
    },
    {
      title: "Message Sent",
      value: "64%",
      change: "-3%",
      period: "Last 30 days",
      trend: "down",
    },
  ];

  const recentMessages = [
    {
      contact: "Sarah Johnson",
      message: "Just confirming our m...",
      status: "Delivered",
      time: "Just now",
      statusColor: "bg-green-100 text-green-600",
    },
    {
      contact: "Marketing Group",
      message: "New Campaign Update...",
      status: "Pending",
      time: "1h ago",
      statusColor: "bg-yellow-100 text-yellow-600",
    },
    {
      contact: "Michael Brown",
      message: "Please check the atta...",
      status: "Failed",
      time: "3h ago",
      statusColor: "bg-red-100 text-red-600",
    },
    {
      contact: "David Willson",
      message: "Please check the atta...",
      status: "Delivered",
      time: "3h ago",
      statusColor: "bg-green-100 text-green-600",
    },
  ];

  const automations = [
    {
      name: "Welcome Sequence",
      type: "Drip",
      status: "Active",
      lastRun: "15 min ago",
      statusColor: "bg-green-100 text-green-600",
    },
    {
      name: "Follow-up Reminder",
      type: "Scheduled",
      status: "Active",
      lastRun: "1h ago",
      statusColor: "bg-green-100 text-green-600",
    },
    {
      name: "Birthday Wishes",
      type: "Triggered",
      status: "Active",
      lastRun: "6h ago",
      statusColor: "bg-green-100 text-green-600",
    },
    {
      name: "Feedback Request",
      type: "Scheduled",
      status: "Paused",
      lastRun: "2d ago",
      statusColor: "bg-yellow-100 text-yellow-600",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, John!</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">
                  {stat.title}
                </h3>
                {stat.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500">{stat.period}</p>
                </div>
                <span
                  className={`text-sm font-medium ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Message Activity
            </h3>
            <div className="">
              <Line data={data} options={options} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                <Send className="w-4 h-4" />
                <span>Compose Message</span>
              </button>
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <UserPlus className="w-4 h-4" />
                <span>Add Contact</span>
              </button>
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <File className="w-4 h-4" />
                <span>Create Template</span>
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Current Plan
              </h4>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Pro Plan</span>
                <button className="text-sm text-green-600 hover:text-green-700">
                  Manage
                </button>
              </div>
              <div className="bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "65%" }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>819/1,250 messages</span>
                <span>65% used</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Messages
                </h3>
                <button className="text-sm text-green-600 hover:text-green-700">
                  View All
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentMessages.map((msg, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {msg.contact}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {msg.message}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${msg.statusColor}`}
                        >
                          {msg.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {msg.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Active Automations
                </h3>
                <button className="text-sm text-green-600 hover:text-green-700">
                  View All
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Last Run
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {automations.map((automation, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {automation.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {automation.type}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${automation.statusColor}`}
                        >
                          {automation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {automation.lastRun}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
