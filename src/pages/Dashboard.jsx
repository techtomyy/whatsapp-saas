import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/client";
import {
  collection,
  onSnapshot,
  doc,
  onSnapshot as onDocSnapshot,
} from "firebase/firestore";
import { TrendingUp, TrendingDown, Send, UserPlus, File } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { format } from "date-fns"; // npm install date-fns

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
  const navigate = useNavigate();
  const { user } = useAuth();

  const [contacts, setContacts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [automations, setAutomations] = useState([]);
  const [plan, setPlan] = useState("Pro");
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    if (!user?.uid) return;

    // 🔹 Contacts
    const unsubContacts = onSnapshot(
      collection(db, "users", user.uid, "contacts"),
      (snap) => setContacts(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => {
        console.warn("dashboard contacts listener error", err?.code || err);
        setContacts([]);
      }
    );

    // 🔹 Logs
    const unsubLogs = onSnapshot(
      collection(db, "users", user.uid, "logs"),
      (snap) => setLogs(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => {
        console.warn("dashboard logs listener error", err?.code || err);
        setLogs([]);
      }
    );

    // 🔹 Campaigns
    const unsubCamps = onSnapshot(
      collection(db, "users", user.uid, "campaigns"),
      (snap) => setCampaigns(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => {
        console.warn("dashboard campaigns listener error", err?.code || err);
        setCampaigns([]);
      }
    );
    // 🔹 Automations are actually campaigns
    const unsubAutos = onSnapshot(
      collection(db, "users", user.uid, "campaigns"),
      (snap) =>
        setAutomations(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
            statusColor:
              d.data().status === "Active"
                ? "bg-green-100 text-green-600"
                : "bg-yellow-100 text-yellow-600",
          }))
        ),
      (err) => {
        console.warn("dashboard automations listener error", err?.code || err);
        setAutomations([]);
      }
    );

    // 🔹 User Plan
    const unsubUser = onDocSnapshot(
      doc(db, "users", user.uid),
      (snap) => setPlan((snap.data() || {}).currentPlan || "Pro"),
      (err) => {
        console.warn("dashboard user listener error", err?.code || err);
        setPlan("Pro");
      }
    );

    return () => {
      unsubContacts();
      unsubLogs();
      unsubCamps();
      unsubAutos();
      unsubUser();
    };
  }, [user?.uid]);

  // 🔹 Generate chart from logs
  useEffect(() => {
    if (!logs.length) {
      setChartData({ labels: [], datasets: [] });
      return;
    }

    const days = Array.from({ length: 7 }).map((_, i) =>
      format(new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000), "EEE")
    );

    const sentPerDay = days.map(
      (d) =>
        logs.filter(
          (l) => format(l.timestamp?.toDate?.() || new Date(), "EEE") === d
        ).length
    );
    const deliveredPerDay = days.map(
      (d) =>
        logs.filter(
          (l) =>
            l.status === "Delivered" &&
            format(l.timestamp?.toDate?.() || new Date(), "EEE") === d
        ).length
    );
    const readPerDay = days.map(
      (d) =>
        logs.filter(
          (l) =>
            l.status === "Read" &&
            format(l.timestamp?.toDate?.() || new Date(), "EEE") === d
        ).length
    );
    const failedPerDay = days.map(
      (d) =>
        logs.filter(
          (l) =>
            l.status === "Failed" &&
            format(l.timestamp?.toDate?.() || new Date(), "EEE") === d
        ).length
    );

    setChartData({
      labels: days,
      datasets: [
        {
          label: "Sent",
          data: sentPerDay,
          borderColor: "#3b82f6",
          backgroundColor: "#3b82f6",
        },
        {
          label: "Delivered",
          data: deliveredPerDay,
          borderColor: "#22c55e",
          backgroundColor: "#22c55e",
        },
        {
          label: "Read",
          data: readPerDay,
          borderColor: "#facc15",
          backgroundColor: "#facc15",
        },
        {
          label: "Failed",
          data: failedPerDay,
          borderColor: "#ef4444",
          backgroundColor: "#ef4444",
        },
      ],
    });
  }, [logs]);

  // Stats
  const sentCount = logs.length;
  const activeContacts = contacts.length;
  const delivered = logs.filter((l) => l.status === "Delivered").length;
  const read = logs.filter((l) => l.status === "Read").length;
  const openRate = sentCount ? Math.round((read / sentCount) * 100) : 0;

  const stats = [
    {
      title: "Message Sent",
      value: String(sentCount),
      change: "",
      period: "All time",
      trend: "up",
    },
    {
      title: "Active Contacts",
      value: String(activeContacts),
      change: "",
      period: "All time",
      trend: "up",
    },
    {
      title: "Open Rate",
      value: `${openRate}%`,
      change: "",
      period: "All time",
      trend: "up",
    },
    {
      title: "Campaigns",
      value: String(campaigns.length),
      change: "",
      period: "All time",
      trend: "up",
    },
  ];

  // Recent messages (last 5 logs)
  const recentMessages = logs
    .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0))
    .slice(0, 5)
    .map((l) => ({
      contact: l.contactName || "Unknown",
      message: l.message || "",
      status: l.status || "Pending",
      time: l.timestamp?.toDate?.().toLocaleString() || "",
      statusColor:
        l.status === "Delivered"
          ? "bg-green-100 text-green-600"
          : l.status === "Read"
          ? "bg-blue-100 text-blue-600"
          : l.status === "Failed"
          ? "bg-red-100 text-red-600"
          : "bg-yellow-100 text-yellow-600",
    }));

  // Button Handlers
  const handleCompose = () => navigate("/composer");
  const handleAddContact = () => navigate("/contacts");
  const handleCreateTemplate = () => navigate("/templates");
  const handleManagePlan = () => navigate("/billing");
  const handleViewMessages = () => navigate("/logs");
  const handleViewAutomations = () => navigate("/automations");

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { usePointStyle: true, pointStyle: "circle" },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: "#e5e7eb" },
        beginAtZero: true,
        ticks: { stepSize: 20 },
      },
    },
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600">Welcome back, {user?.name || "User"}!</p>
        </div>

        {/* Stats */}
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

        {/* Chart + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Message Activity
            </h3>
            <Line data={chartData} options={options} />
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={handleCompose}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Send className="w-4 h-4" /> <span>Compose Message</span>
              </button>
              <button
                onClick={handleAddContact}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <UserPlus className="w-4 h-4" /> <span>Add Contact</span>
              </button>
              <button
                onClick={handleCreateTemplate}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <File className="w-4 h-4" /> <span>Create Template</span>
              </button>
            </div>

            {/* Current Plan */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Current Plan
              </h4>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{plan} Plan</span>
                <button
                  onClick={handleManagePlan}
                  className="text-sm text-green-600 hover:text-green-700"
                >
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
                <span>
                  {delivered}/{Math.max(delivered, sentCount)} messages
                </span>{" "}
                <span>
                  {sentCount ? Math.round((delivered / sentCount) * 100) : 0}%
                  delivered
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Messages & Automations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Messages */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Messages
              </h3>
              <button
                onClick={handleViewMessages}
                className="text-sm text-green-600 hover:text-green-700"
              >
                View All
              </button>
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
                  {recentMessages.map((msg, i) => (
                    <tr key={i} className="hover:bg-gray-50">
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

          {/* Automations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Active Automations
              </h3>
              <button
                onClick={handleViewAutomations}
                className="text-sm text-green-600 hover:text-green-700"
              >
                View All
              </button>
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
                  {automations.map((auto) => (
                    <tr key={auto.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {auto.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {auto.type}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${auto.statusColor}`}
                        >
                          {auto.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {auto.lastRun || ""}
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
