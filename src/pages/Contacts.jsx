import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import AddPeopleToGroup from "../components/AddPeopleToGroup";

import {
  Search,
  Plus,
  Download,
  Upload,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  User,
} from "lucide-react";

export default function Contacts() {

  
  
  const [selectedContacts, setSelectedContacts] = useState([
    "Sarah Johnson",
    "Michael Brown",
  ]);
  const [groupName, setGroupName] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState(["", "", "", ""]);

  const contacts = [
    {
      name: "Sarah Johnson",
      phone: "+1 (555) 123-4567",
      type: "Individual",
      tags: ["Customer", "VIP"],
      created: "May 12, 2025",
    },
    {
      name: "Michael Brown",
      phone: "+1 (555) 321-7654",
      type: "Individual",
      tags: ["Lead"],
      created: "April 14, 2025",
    },
    {
      name: "Marketing Team",
      phone: "+1 (555) 234-5678",
      type: "Group",
      tags: ["Internal"],
      created: "June 20, 2025",
    },
    {
      name: "David Wilson",
      phone: "+1 (555) 246-1357",
      type: "Individual",
      tags: ["Customer"],
      created: "July 5, 2025",
    },
    {
      name: "Amanda Rodriguez",
      phone: "+1 (555) 122-4545",
      type: "Individual",
      tags: ["Lead"],
      created: "June 10, 2024",
    },
  ];

  const handleContactSelection = (contactName) => {
    if (selectedContacts.includes(contactName)) {
      setSelectedContacts(
        selectedContacts.filter((name) => name !== contactName)
      );
    } else {
      setSelectedContacts([...selectedContacts, contactName]);
    }
  };

  const handleSelectAll = () => {
    setSelectedContacts(contacts.map((contact) => contact.name));
  };

  const handleClearSelection = () => {
    setSelectedContacts([]);
  };

  const addPhoneNumberField = () => {
    setPhoneNumbers([...phoneNumbers, ""]);
  };

  const updatePhoneNumber = (index, value) => {
    const newNumbers = [...phoneNumbers];
    newNumbers[index] = value;
    setPhoneNumbers(newNumbers);
  };

  const getTagColor = (tag) => {
    switch (tag) {
      case "Customer":
        return "bg-blue-100 text-blue-800";
      case "VIP":
        return "bg-purple-100 text-purple-800";
      case "Lead":
        return "bg-yellow-100 text-yellow-800";
      case "Internal":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
            <p className="text-gray-600">Manage your WhatsApp contacts</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium">
              <Plus className="w-4 h-4 inline mr-2" />
              Add Contact
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              <Upload className="w-4 h-4 inline mr-2" />
              Import
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              <Download className="w-4 h-4 inline mr-2" />
              Export
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search contacts..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg   text-gray-600"
              />
            </div>
            <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-700">
              <option>All Types</option>
              <option>Individual</option>
              <option>Group</option>
            </select>
            <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-700">
              <option>All Tags</option>
              <option>Customer</option>
              <option>VIP</option>
              <option>Lead</option>
              <option>Internal</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contacts.map((contact, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {contact.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {contact.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          contact.type === "Group"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {contact.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTagColor(
                              tag
                            )}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {contact.created}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button className="text-gray-400 hover:text-gray-600">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing 1-5 of 50 contacts
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg">
                  1
                </button>
                <button className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 rounded-lg">
                  2
                </button>
                <button className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 rounded-lg">
                  3
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <AddPeopleToGroup />
        </div>
      </div>
    </DashboardLayout>
  );
}
