import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  Search,
  Users,
  Type,
  Image,
  Video,
  File,
  Link,
  Send,
  X,
} from "lucide-react";

export default function Composer() {
  const [selectedRecipients, setSelectedRecipients] = useState([
    "Sarah Jhonson",
    "David Wilson",
    "Marketing Team",
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [activeTab, setActiveTab] = useState("text");
  const [generatePreview, setGeneratePreview] = useState(false);
  const [scheduleForLater, setScheduleForLater] = useState(false);
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const previewMessage =
    "Hello! Just checking in to see if you have any questions about our new product line. Let me know if you'd like more information.";

  const removeRecipient = (recipient) => {
    setSelectedRecipients((prev) => prev.filter((r) => r !== recipient));
  };

  const tabs = [
    { id: "text", icon: Type, label: "Text" },
    { id: "image", icon: Image, label: "Image" },
    { id: "video", icon: Video, label: "Video" },
    { id: "file", icon: File, label: "File" },
    { id: "link", icon: Link, label: "Link" },
  ];

  const handleSendMessage = () => {
    console.log("Sending message:", {
      recipients: selectedRecipients,
      message: messageText || previewMessage,
      scheduled: scheduleForLater,
      date: scheduleDate,
      time: scheduleTime,
    });
    alert("Message sent successfully!");
  };

  return (
    <DashboardLayout>
      <div className="w-full bg-white px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Header */}
        <div className="bg-white py-4 lg:py-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Message Composer
          </h1>
          <p className="text-gray-600 text-sm lg:text-base mt-1">
            Create and send WhatsApp messages
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Recipients */}
            <div className="rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
              <label className="block text-sm lg:text-base font-medium text-gray-700 mb-3">
                Select Recipients
              </label>

              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5" />
                <input
                  type="text"
                  placeholder="Search contacts or groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm lg:text-base"
                />
              </div>

              {/* Selected Recipients */}
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedRecipients.map((recipient, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm lg:text-base"
                  >
                    {recipient}
                    <button
                      onClick={() => removeRecipient(recipient)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3 lg:w-4 lg:h-4" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Recipients Count */}
              <div className="flex items-center gap-2 text-gray-600 text-sm lg:text-base">
                <Users className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>{selectedRecipients.length} recipients selected</span>
              </div>
            </div>

            {/* Message Type Tabs */}
            <div className="rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
              <div className="mb-6 border-b border-gray-200 flex flex-wrap">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 lg:px-6 lg:py-3 text-sm lg:text-base font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? "border-green-500 text-green-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Message Content */}
              <textarea
                placeholder="Type your message here..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full h-32 lg:h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none text-sm lg:text-base"
              />
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 text-sm lg:text-base text-gray-500 gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={generatePreview}
                    onChange={(e) => setGeneratePreview(e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  Generate preview links
                </label>
                <span>{messageText.length}/1000 characters</span>
              </div>
            </div>

            {/* Schedule Section */}
            <div className="rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
              <label className="flex items-center gap-2 text-sm lg:text-base font-medium text-gray-700 mb-3">
                <input
                  type="checkbox"
                  checked={scheduleForLater}
                  onChange={(e) => setScheduleForLater(e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                Scheduled for later
              </label>

              {scheduleForLater && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full px-3 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm lg:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full px-3 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm lg:text-base"
                    />
                  </div>
                </div>
              )}

              {/* Save as Template */}
              <div className="mt-6">
                <label className="flex items-center gap-2 text-sm lg:text-base font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={saveAsTemplate}
                    onChange={(e) => setSaveAsTemplate(e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  Save as template
                </label>
              </div>
            </div>
          </div>

          {/* Preview Sidebar */}
          <div className="w-full lg:w-96 xl:w-[30rem] p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-md">
            <h3 className="text-lg lg:text-xl font-medium text-gray-900 mb-4">
              Preview
            </h3>

            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm text-sm lg:text-base">
              <div className="mb-2">{messageText || previewMessage}</div>
              <div className="text-xs lg:text-sm text-gray-500 text-right">
                12:45 PM
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm lg:text-base text-green-600 mb-2">
                <div className="w-2 h-2 lg:w-3 lg:h-3 bg-green-500 rounded-full"></div>
                WhatsApp connected
              </div>
              <div className="text-sm lg:text-base text-gray-600">
                Estimated delivery: Instant
              </div>
            </div>

            <button
              onClick={handleSendMessage}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm lg:text-base"
            >
              <Send className="w-4 h-4 lg:w-5 lg:h-5" />
              Send Message
            </button>

            <div className="text-xs lg:text-sm text-gray-500 text-center mt-3">
              Message will be sent from your connected WhatsApp account
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
