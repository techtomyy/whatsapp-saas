import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChevronDown, Download } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/client";
import { collection, onSnapshot } from "firebase/firestore";

const AnalyticsDashboard = () => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("Last 7 days");
  const [selectedMetric, setSelectedMetric] = useState("Total Messages");

  const generateChartData = (period) => {
    if (period === 'Last 7 days') {
      const labels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
      return labels.map((day, i) => ({
        day,
        totalMessages: 80 + i * 10,
        deliveryRate: 75 + i,
        readRate: 70 + i,
        responseRate: 60 + Math.max(0, 6 - i),
      }));
    }
    if (period === 'Last 30 days') {
      return Array.from({ length: 30 }, (_, i) => ({
        day: `${i + 1}`,
        totalMessages: 70 + Math.round(20 * Math.sin(i / 5) + 20 * Math.random()),
        deliveryRate: 80 + Math.round(5 * Math.sin(i / 7)),
        readRate: 75 + Math.round(5 * Math.cos(i / 6)),
        responseRate: 55 + Math.round(8 * Math.sin(i / 4)),
      }));
    }
    return Array.from({ length: 12 }, (_, i) => ({
      day: `W${i + 1}`,
      totalMessages: 400 + Math.round(100 * Math.sin(i / 2)),
      deliveryRate: 90 + Math.round(4 * Math.cos(i / 3)),
      readRate: 82 + Math.round(4 * Math.sin(i / 3)),
      responseRate: 60 + Math.round(6 * Math.cos(i / 2)),
    }));
  };

  // Pull logs and compute metrics from Firestore
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    if (!user?.uid) return;
    const unsub = onSnapshot(
      collection(db, 'users', user.uid, 'logs'),
      (snap) => {
        const rows = snap.docs.map((d) => {
          const data = d.data();
          const ts = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
          return { ts, status: data.status || 'Delivered', type: data.type || 'Text' };
        });
        setLogs(rows);
      },
      (err) => {
        console.warn('analytics logs listener error', err?.code || err);
        setLogs([]);
      }
    );
    return () => unsub();
  }, [user?.uid]);

  const filteredLogs = useMemo(() => {
    const now = new Date();
    const days = selectedPeriod === 'Last 7 days' ? 7 : selectedPeriod === 'Last 30 days' ? 30 : 90;
    const cutoff = new Date(now);
    cutoff.setDate(now.getDate() - (days - 1));
    return logs.filter(l => l.ts >= cutoff);
  }, [logs, selectedPeriod]);

  const chartData = useMemo(() => {
    // build day labels for the selected period
    const days = selectedPeriod === 'Last 7 days' ? 7 : selectedPeriod === 'Last 30 days' ? 30 : 90;
    const labels = [];
    const fmt = (d) => `${d.getMonth() + 1}/${d.getDate()}`;
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      labels.push(fmt(d));
    }

    const countBy = new Map(labels.map(l => [l, { total: 0, delivered: 0, read: 0 }]));
    filteredLogs.forEach((l) => {
      const label = fmt(l.ts);
      if (!countBy.has(label)) countBy.set(label, { total: 0, delivered: 0, read: 0 });
      const o = countBy.get(label);
      o.total += 1;
      if (l.status === 'Delivered') o.delivered += 1;
      if (l.status === 'Read') o.read += 1;
    });

    return labels.map((label) => {
      const { total, delivered, read } = countBy.get(label) || { total: 0, delivered: 0, read: 0 };
      return {
        day: label,
        totalMessages: total,
        deliveryRate: total ? Math.round((delivered / total) * 100) : 0,
        readRate: total ? Math.round((read / total) * 100) : 0,
        responseRate: 0,
      };
    });
  }, [filteredLogs, selectedPeriod]);

  const kpis = useMemo(() => {
    const total = filteredLogs.length;
    const delivered = filteredLogs.filter(l => l.status === 'Delivered').length;
    const read = filteredLogs.filter(l => l.status === 'Read').length;
    const deliveryRate = total ? Math.round((delivered / total) * 100) : 0;
    const readRate = total ? Math.round((read / total) * 100) : 0;
    const responseRate = 0;
    return { total, deliveryRate, readRate, responseRate };
  }, [filteredLogs]);

  // Template performance data
  const templateData = [
    { template: "Welcome Message", sent: 324, delivered: "99%", read: "95%", response: "72%" },
    { template: "Appointment Reminder", sent: 246, delivered: "98%", read: "92%", response: "68%" },
    { template: "Product Inquiry Response", sent: 189, delivered: "97%", read: "90%", response: "65%" },
    { template: "Weekly Newsletter", sent: 152, delivered: "96%", read: "85%", response: "42%" },
  ];

  // Contact engagement heatmap data
  const heatmapData = [
    { name: "Active Contacts", value: 85, color: "#22c55e" },
    { name: "Moderately Active", value: 65, color: "#84cc16" },
    { name: "Low Activity", value: 45, color: "#eab308" },
    { name: "Inactive", value: 25, color: "#f97316" },
    { name: "Unresponsive", value: 10, color: "#ef4444" },
  ];

  const getMetricKey = (metric) => {
    const keyMap = {
      "Total Messages": "totalMessages",
      "Delivery Rate": "deliveryRate",
      "Read Rate": "readRate",
      "Response Rate": "responseRate",
    };
    return keyMap[metric] || "totalMessages";
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
            <p className="text-gray-600">
              Track and analyze your message performance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
            <button onClick={() => {
              const headers = ['Label', selectedMetric];
              const key = getMetricKey(selectedMetric);
              const rows = chartData.map(d => [d.day, d[key]]);
              const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; a.setAttribute('download', 'analytics.csv');
              document.body.appendChild(a); a.click(); document.body.removeChild(a);
              URL.revokeObjectURL(url);
              showToast('Exported analytics.csv', 'success');
            }} className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-gray-600 text-sm mb-2">Total Messages</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{kpis.total}</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-gray-600 text-sm mb-2">Delivery Rate</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{kpis.deliveryRate}%</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-gray-600 text-sm mb-2">Read Rate</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{kpis.readRate}%</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-gray-600 text-sm mb-2">Response Rate</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{kpis.responseRate}%</div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Message Volume
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedMetric("Total Messages")}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedMetric === "Total Messages"
                      ? "bg-green-100 text-green-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Total Messages
                </button>
                <button
                  onClick={() => setSelectedMetric("Delivery Rate")}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedMetric === "Delivery Rate"
                      ? "bg-orange-100 text-orange-700"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Delivery Rate
                </button>
                <button
                  onClick={() => setSelectedMetric("Read Rate")}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedMetric === "Read Rate"
                      ? "bg-red-100 text-red-700"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Read Rate
                </button>
                <button
                  onClick={() => setSelectedMetric("Response Rate")}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedMetric === "Response Rate"
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <div className="w-2 h-2 bg-purple-500 rounded_full"></div>
                  Response Rate
                </button>
              </div>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  domain={["dataMin - 10", "dataMax + 10"]}
                />
                <Line
                  type="monotone"
                  dataKey={getMetricKey(selectedMetric)}
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ fill: "#22c55e", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: "#22c55e" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Template Performance */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Top Performing Templates
            </h2>

            <div className="space-y-1 mb-4">
              <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-600 pb-2 border-b border-gray-200">
                <div>Template</div>
                <div className="text-center">Sent</div>
                <div className="text-center">Delivered</div>
                <div className="text-center">Read</div>
                <div className="text-center">Response</div>
              </div>
            </div>

            <div className="space-y-4">
              {templateData.map((template, index) => (
                <div
                  key={index}
                  className="grid grid-cols-5 gap-4 items-center py-2 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
                >
                  <div className="font-medium text-gray-900 text-sm">
                    {template.template}
                  </div>
                  <div className="text-center text-gray-700 font-semibold">
                    {template.sent}
                  </div>
                  <div className="text-center text-gray-700">
                    {template.delivered}
                  </div>
                  <div className="text-center text-gray-700">
                    {template.read}
                  </div>
                  <div className="text-center text-gray-700">
                    {template.response}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Engagement Heatmap */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Contact Engagement
            </h2>

            <div className="relative">
              <div className="text-center mb-4">
                <div className="text-sm font-medium text-gray-600 mb-2">
                  Weekly Engagement (Last 8 Weeks)
                </div>
              </div>

              {/* Heatmap Grid */}
              <div className="grid grid-cols-8 gap-1 mb-4">
                {Array.from({ length: 56 }, (_, i) => {
                  const intensity = Math.random();

                  let bgColor = "#ef4444";
                  if (intensity > 0.8) bgColor = "#22c55e";
                  else if (intensity > 0.6) bgColor = "#84cc16";
                  else if (intensity > 0.4) bgColor = "#eab308";
                  else if (intensity > 0.2) bgColor = "#f97316";
                  else bgColor = "#ef4444";

                  return (
                    <button
                      key={i}
                      className="aspect-square rounded-sm hover:ring-2 hover:ring-blue-500 cursor-pointer transition-all"
                      style={{ backgroundColor: bgColor }}
                      title={`Day ${i + 1}: ${Math.floor(
                        intensity * 100
                      )}% engagement`}
                      onClick={() => showToast(`Day ${i + 1} engagement ${Math.floor(intensity * 100)}%`, 'success')}
                    />
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-6">
                <div>Less</div>
                <div className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: "#ef4444" }}
                  ></div>
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: "#f97316" }}
                  ></div>
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: "#eab308" }}
                  ></div>
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: "#84cc16" }}
                  ></div>
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: "#22c55e" }}
                  ></div>
                </div>
                <div>More</div>
              </div>

              {/* Engagement Categories */}
              <div className="grid grid-cols-2 gap-4">
                {heatmapData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-gray-700">{item.name}</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {item.value}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsDashboard;
