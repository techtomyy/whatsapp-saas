import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  Search,
  Download,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Upload,
} from "lucide-react";

const MessageLogs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Example data
  const messages = [
    {
      recipient: "Sarah Johnson",
      content: "Hello! Just confirming our meeting ...",
      type: "Text",
      status: "Delivered",
      timestamp: "2025-08-10 12:45",
    },
    {
      recipient: "Michael Brown",
      content: "Thanks for your inquiry about our p...",
      type: "Text",
      status: "Read",
      timestamp: "2025-08-10 22:00",
    },
    {
      recipient: "Marketing Team",
      content: "New campaign update: [Image]",
      type: "Image",
      status: "Pending",
      timestamp: "2025-08-09 09:10",
    },
    {
      recipient: "David Wilson",
      content: "Please check the attachment for t...",
      type: "File",
      status: "Failed",
      timestamp: "2025-08-01 23:59",
    },
    {
      recipient: "Amanda Rodriguez",
      content: "Here's the product demo you requ...",
      type: "Video",
      status: "Delivered",
      timestamp: "2025-07-30 16:30",
    },
    {
      recipient: "Ali Khan",
      content: "Follow-up on your request",
      type: "Text",
      status: "Delivered",
      timestamp: "2025-07-28 11:20",
    },
    {
      recipient: "Zara Ahmed",
      content: "Invoice attached",
      type: "File",
      status: "Read",
      timestamp: "2025-07-25 09:05",
    },
    {
      recipient: "Dev Team",
      content: "Deploy scheduled at midnight",
      type: "Text",
      status: "Pending",
      timestamp: "2025-07-20 18:00",
    },
    {
      recipient: "Client XYZ",
      content: "Can we reschedule?",
      type: "Text",
      status: "Failed",
      timestamp: "2025-07-18 14:00",
    },
    {
      recipient: "Naima",
      content: "Thanks for the demo!",
      type: "Text",
      status: "Read",
      timestamp: "2025-07-15 10:10",
    },
    {
      recipient: "Support",
      content: "Ticket closed",
      type: "Text",
      status: "Delivered",
      timestamp: "2025-07-10 08:40",
    },
    {
      recipient: "Partners",
      content: "Monthly report attached",
      type: "File",
      status: "Delivered",
      timestamp: "2025-07-01 07:00",
    },
  ];

  // badge helper
  const getStatusBadge = (status) => {
    const statusStyles = {
      Delivered: "bg-green-100 text-green-800",
      Read: "bg-blue-100 text-blue-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Failed: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusStyles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  const exportLogs = () => {
    // use Upload icon (arrow up) for export
    alert("Exported (demo)");
  };

  // --- Pagination / filtering logic ---
  const rowsPerPage = 5;

  // Basic filtering: search by recipient or content, and filter by status
  const filteredMessages = messages.filter((m) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q || (m.recipient + " " + m.content).toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === "All Statuses" || m.status === statusFilter;
    // Note: fromDate/toDate filtering requires timestamps in ISO or comparable format.
    // If you store actual Date strings, parse them here. For now we ignore date filters.
    return matchesQuery && matchesStatus;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMessages.length / rowsPerPage)
  );

  // Ensure currentPage is within bounds whenever filteredMessages or totalPages change
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredMessages.slice(indexOfFirstRow, indexOfLastRow);

  // helper to render page numbers (keeps it simple)
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <DashboardLayout>
      <div className="w-full bg-white">
        {/* Full-width container for large screens */}
        <div className="w-full px-2 sm:px-4 lg:px-6">
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 bg-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Message Logs
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  View history of all sent messages
                </p>
              </div>
              <button
                onClick={exportLogs}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                <Upload className="w-4 h-4" />
                Export logs
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white shadow-lg rounded-xl my-4 overflow-hidden border border-gray-200 w-full">
            {/* Filters */}
            <div className="px-4 sm:px-6 py-5 bg-gray-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                  >
                    <option>All Statuses</option>
                    <option>Delivered</option>
                    <option>Read</option>
                    <option>Pending</option>
                    <option>Failed</option>
                  </select>
                </div>

                {/* From Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>
                </div>

                {/* To Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Recipient",
                      "Content",
                      "Type",
                      "Status",
                      "Timestamp",
                      "Actions",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentRows.map((message, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {message.recipient}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 max-w-[150px] lg:max-w-xs truncate">
                        {message.content}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {message.type}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(message.status)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-pre-line text-sm text-gray-900">
                        {message.timestamp}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 sm:px-6 py-4 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-sm text-gray-700">
                Showing {indexOfFirstRow + 1}-
                {Math.min(indexOfLastRow, messages.length)} of {messages.length}{" "}
                messages
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from(
                  { length: Math.ceil(messages.length / rowsPerPage) },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm rounded-md transition-colors ${
                      currentPage === page
                        ? "bg-gray-400 text-white"
                        : "border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(
                        Math.ceil(messages.length / rowsPerPage),
                        prev + 1
                      )
                    )
                  }
                  disabled={
                    currentPage === Math.ceil(messages.length / rowsPerPage)
                  }
                  className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MessageLogs;
