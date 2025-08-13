import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { Search, ChevronLeft, ChevronRight, Edit, Send, Trash } from "lucide-react";

const MessageTemplates = () => {
  const allTemplates = [
    {
      name: "Welcome Message",
      type: "Text",
      preview: "Welcome to our service! We're excited to ...",
      created: "July 10, 2023",
      lastUsed: "July 28, 2023",
    },
    {
      name: "Product Inquiry Response",
      type: "Text",
      preview: "Thank you for your interest in our produc ...",
      created: "July 15, 2023",
      lastUsed: "July 27, 2023",
    },
    {
      name: "Weekly Newsletter",
      type: "Image",
      preview: "Here's your weekly update with all the lat ...",
      created: "July 5, 2023",
      lastUsed: "July 25, 2023",
    },
    {
      name: "Appointment Reminder",
      type: "Text",
      preview: "This is a friendly reminder about your ap ...",
      created: "July 20, 2023",
      lastUsed: "July 26, 2023",
    },
    {
      name: "Product Demo",
      type: "Video",
      preview: "Check out our latest product features in a ...",
      created: "July 18, 2023",
      lastUsed: "July 27, 2023",
    },
    // Add more rows for pagination example
    {
      name: "Special Offer",
      type: "Text",
      preview: "Don't miss our special discounts this week ...",
      created: "July 8, 2023",
      lastUsed: "July 20, 2023",
    },
    {
      name: "Survey Request",
      type: "Text",
      preview: "We'd love your feedback on our services ...",
      created: "July 2, 2023",
      lastUsed: "July 19, 2023",
    },
  ];

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All Types");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const filteredTemplates = allTemplates.filter((t) => {
    return (
      (filterType === "All Types" || t.type === filterType) &&
      t.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredTemplates.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredTemplates.slice(startIndex, startIndex + rowsPerPage);

  return (
    <DashboardLayout>
    <div className="p-4 md:p-8 w-full bg-white ">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Message Templates</h1>
          <p className="text-gray-500 text-sm md:text-base">
            Create and use reusable message templates
          </p>
        </div>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2">
          + Create Template
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mt-6 flex flex-col md:flex-row justify-between p-4 shadow-lg  border-gray-400 rounded-lg overflow-x-auto">
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full md:w-1/2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            className="ml-2 flex-1 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="border border-gray-300 rounded-lg px-3 py-2 w-full md:w-40"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option>All Types</option>
          <option>Text</option>
          <option>Image</option>
          <option>Video</option>
        </select>
      </div>

      {/* Table */}
      <div className="mt-6 p-4 shadow-lg  border-gray-400 rounded-lg overflow-x-auto">
        <table className="w-full text-sm md:text-base">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-3">Templates Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Content Preview</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Last Used</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((t, i) => (
              <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3">{t.name}</td>
                <td className="px-4 py-3">{t.type}</td>
                <td className="px-4 py-3">{t.preview}</td>
                <td className="px-4 py-3">{t.created}</td>
                <td className="px-4 py-3">{t.lastUsed}</td>
                <td className="px-4 py-3 flex gap-2">
                  <Edit className="w-4 h-4 cursor-pointer text-gray-600 hover:text-blue-500" />
                  <Send className="w-4 h-4 cursor-pointer text-gray-600 hover:text-green-500" />
                  <Trash className="w-4 h-4 cursor-pointer text-gray-600 hover:text-red-500" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>
            Showing {startIndex + 1}-{startIndex + currentRows.length} of {filteredTemplates.length} templates
          </p>
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-1 border rounded disabled:opacity-50"
            >
              <ChevronLeft />
            </button>
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === idx + 1 ? "bg-gray-100" : ""
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-1 border rounded disabled:opacity-50"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default MessageTemplates;
