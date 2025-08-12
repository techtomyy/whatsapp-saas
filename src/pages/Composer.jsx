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
      <div className="max-w-7xl  bg-white ">
        {/* Header */}
        <div className="bg-white px-6 py-4 ">
          <h1 className="text-2xl font-bold text-gray-900">Message Composer</h1>
          <p className="text-gray-600 text-sm mt-1">
            Create and send WhatsApp messages
          </p>
        </div>

        <div className="flex">
          {/* Main Content */}
          <div className="flex-1 p-6">
            <div className="mb-6 rounded-lg  shadow-md p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Recipients
              </label>

              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search contacts or groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Selected Recipients */}
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedRecipients.map((recipient, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {recipient}
                    <button
                      onClick={() => removeRecipient(recipient)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Recipients Count */}
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Users className="w-4 h-4" />
                <span>{selectedRecipients.length} recipients selected</span>
              </div>
            </div>

            {/* Message Type Tabs */}
            <div className="mb-6 rounded-lg shadow-md p-6">
              <div className="mb-6 ">
                <div className="flex border-b border-gray-200">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === tab.id
                            ? "border-green-500 text-green-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message Content */}
              <div className="mb-6">
                <textarea
                  placeholder="Type your message here..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                />
                <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
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
            </div>

            {/* Schedule Section */}
            <div className="mb-6 rounded-lg  shadow-md p-6">
              <div className="mb-6 ">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <input
                    type="checkbox"
                    checked={scheduleForLater}
                    onChange={(e) => setScheduleForLater(e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  Scheduled for later
                </label>

                {scheduleForLater && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Save as Template */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
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
          <div className=" mb-6 mr-6 w-100 bg-white  p-7 rounded-lg  shadow-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>

            {/* Message Preview */}
            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <div className="text-sm text-gray-900 mb-2">
                {messageText || previewMessage}
              </div>
              <div className="text-xs text-gray-500 text-right">12:45 PM</div>
            </div>

            {/* Status */}
            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm text-green-600 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                WhatsApp connected
              </div>
              <div className="text-sm text-gray-600">
                Estimated delivery: Instant
              </div>
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>

            <div className="text-xs text-gray-500 text-center mt-3">
              Message will be sent from your connected WhatsApp account
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
