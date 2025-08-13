import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import { Plus, Edit, Trash2, BarChart2 } from "lucide-react";

const Automations = () => {
  const campaigns = [
    {
      name: "Welcome Sequence",
      type: "Drip",
      status: "Running",
      audience: "New Customers",
      lastRun: "15 min ago",
      created: "July 10, 2025",
    },
    {
      name: "Follow-up Reminder",
      type: "Scheduled",
      status: "Running",
      audience: "Active Leads",
      lastRun: "1h ago",
      created: "July 15, 2025",
    },
    {
      name: "Birthday Wishes",
      type: "Triggered",
      status: "Running",
      audience: "All Customers",
      lastRun: "6h ago",
      created: "June 20, 2025",
    },
    {
      name: "Feedback Request",
      type: "Scheduled",
      status: "Paused",
      audience: "Recent Purchases",
      lastRun: "2d ago",
      created: "July 5, 2024",
    },
    {
      name: "Reengagement Campaign",
      type: "Drip",
      status: "Paused",
      audience: "Inactive Customers",
      lastRun: "5d ago",
      created: "June 28, 2024",
    },
  ];

  const getStatusClasses = (status) => {
    if (status === "Running")
      return "bg-green-100 text-green-600 px-2 py-1 rounded text-sm";
    if (status === "Paused")
      return "bg-yellow-100 text-yellow-600 px-2 py-1 rounded text-sm";
    return "";
  };

  return (
    <DashboardLayout>
    <div className="p-6 w-full bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Automations</h1>
          <p className="text-gray-500">
            Set up automated messaging workflows
          </p>
        </div>
        <button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
          <Plus className="w-5 h-5" />
          Add Campaign
        </button>
      </div>

      {/* Table */}
      <div className=" mt-6 shadow-lg  border-gray-400 rounded-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4">Compaign Name</th>
              <th className="p-4">Type</th>
              <th className="p-4">Status</th>
              <th className="p-4">Audience</th>
              <th className="p-4">Last Run</th>
              <th className="p-4">Created</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="p-4">{campaign.name}</td>
                <td className="p-4">{campaign.type}</td>
                <td className="p-4">
                  <span className={getStatusClasses(campaign.status)}>
                    {campaign.status}
                  </span>
                </td>
                <td className="p-4">{campaign.audience}</td>
                <td className="p-4">{campaign.lastRun}</td>
                <td className="p-4">{campaign.created}</td>
                <td className="p-4 flex gap-2">
                  <Edit className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
                  <Trash2 className="w-5 h-5 text-gray-600 cursor-pointer hover:text-red-500" />
                  <BarChart2 className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Campaign Types */}
      <div className="mt-6 p-4 shadow-lg  border-gray-400 rounded-lg overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">Campaign Types</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white  rounded-lg p-4 shadow hover:shadow-lg transition">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-green-100 p-2 rounded">
                🌊
              </span>
              <h3 className="font-bold">Drip Campaign</h3>
            </div>
            <p className="text-gray-500 mb-2 text-sm">
              Send a series of messages over time to nurture contacts.
            </p>
            <a href="#" className="text-green-500 font-medium">
              Create Drip →
            </a>
          </div>

          <div className="bg-white  rounded-lg p-4 shadow hover:shadow-lg transition">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-100 p-2 rounded">
                📅
              </span>
              <h3 className="font-bold">Schedule Campaign</h3>
            </div>
            <p className="text-gray-500 mb-2 text-sm">
              Schedule messages to be sent at specific dates and times.
            </p>
            <a href="#" className="text-green-500 font-medium">
              Create Schedule →
            </a>
          </div>

          <div className="bg-white  rounded-lg p-4 shadow hover:shadow-lg transition">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-purple-100 p-2 rounded">
                ⚡
              </span>
              <h3 className="font-bold">Triggered Campaign</h3>
            </div>
            <p className="text-gray-500 mb-2 text-sm">
              Send messages automatically when specific events occur.
            </p>
            <a href="#" className="text-green-500 font-medium">
              Create Trigger →
            </a>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default Automations;
