import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { Search, ChevronLeft, ChevronRight, Edit, Send, Trash } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";

const MessageTemplates = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const sampleTemplates = [
    { id: 1, name: "Welcome Message", type: "Text", preview: "Welcome to our service! We're excited to ...", created: "2025-07-10", lastUsed: "2025-07-28" },
    { id: 2, name: "Product Inquiry Response", type: "Text", preview: "Thank you for your interest in our produc ...", created: "2025-07-15", lastUsed: "2025-07-27" },
    { id: 3, name: "Weekly Newsletter", type: "Image", preview: "Here's your weekly update with all the lat ...", created: "2025-07-05", lastUsed: "2025-07-25" },
    { id: 4, name: "Appointment Reminder", type: "Text", preview: "This is a friendly reminder about your ap ...", created: "2025-07-20", lastUsed: "2025-07-26" },
  ];

  const [templates, setTemplates] = useState(() => {
    try {
      const stored = localStorage.getItem('wb_templates');
      if (stored) return JSON.parse(stored);
      return sampleTemplates;
    } catch (_) {
      return sampleTemplates;
    }
  });

  useEffect(() => {
    try { localStorage.setItem('wb_templates', JSON.stringify(templates)); } catch (_) {}
  }, [templates]);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All Types");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const filteredTemplates = useMemo(() => templates.filter((t) => (
    (filterType === "All Types" || t.type === filterType) &&
    t.name.toLowerCase().includes(search.toLowerCase())
  )), [templates, filterType, search]);

  const totalPages = Math.max(1, Math.ceil(filteredTemplates.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredTemplates.slice(startIndex, startIndex + rowsPerPage);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // template or null
  const [form, setForm] = useState({ name: "", type: "Text", preview: "" });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", type: "Text", preview: "" });
    setModalOpen(true);
  };

  const openEdit = (tpl) => {
    setEditing(tpl);
    setForm({ name: tpl.name, type: tpl.type, preview: tpl.preview || "" });
    setModalOpen(true);
  };

  const saveTemplate = (e) => {
    e.preventDefault();
    if (!form.name.trim()) { showToast('Please enter a template name', 'warning'); return; }
    if (editing) {
      setTemplates(templates.map(t => t.id === editing.id ? { ...t, name: form.name.trim(), type: form.type, preview: form.preview } : t));
      showToast('Template updated', 'success');
    } else {
      const newTpl = {
        id: Date.now(),
        name: form.name.trim(),
        type: form.type,
        preview: form.preview,
        created: new Date().toISOString().slice(0,10),
        lastUsed: "-",
      };
      setTemplates([newTpl, ...templates]);
      showToast('Template created', 'success');
    }
    setModalOpen(false);
    setEditing(null);
  };

  const confirmDelete = (id) => setConfirmDeleteId(id);
  const performDelete = () => {
    setTemplates(templates.filter(t => t.id !== confirmDeleteId));
    setConfirmDeleteId(null);
    showToast('Template deleted', 'success');
  };

  const sendFromTemplate = (tpl) => {
    try {
      localStorage.setItem('wb_composer_prefill', JSON.stringify({ type: tpl.type, content: tpl.preview || '' }));
    } catch (_) {}
    setTemplates(templates.map(t => t.id === tpl.id ? { ...t, lastUsed: new Date().toISOString().slice(0,10) } : t));
    navigate('/composer');
  };

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
        <button onClick={openCreate} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2">
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
            {currentRows.map((t) => (
              <tr key={t.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3">{t.name}</td>
                <td className="px-4 py-3">{t.type}</td>
                <td className="px-4 py-3">{t.preview}</td>
                <td className="px-4 py-3">{t.created}</td>
                <td className="px-4 py-3">{t.lastUsed}</td>
                <td className="px-4 py-3 flex gap-2">
                  <Edit onClick={() => openEdit(t)} className="w-4 h-4 cursor-pointer text-gray-600 hover:text-blue-500" />
                  <Send onClick={() => sendFromTemplate(t)} className="w-4 h-4 cursor-pointer text-gray-600 hover:text-green-500" />
                  <Trash onClick={() => confirmDelete(t.id)} className="w-4 h-4 cursor-pointer text-gray-600 hover:text-red-500" />
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">{editing ? 'Edit Template' : 'Create Template'}</h3>
            <form onSubmit={saveTemplate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option>Text</option>
                    <option>Image</option>
                    <option>Video</option>
                    <option>Link</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content / Preview</label>
                  <input value={form.preview} onChange={(e) => setForm({ ...form, preview: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g. Welcome to our service... or https://example.com" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setModalOpen(false); setEditing(null); }} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Delete Template</h3>
            <p className="text-sm text-gray-700 mb-6">Are you sure you want to delete this template?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDeleteId(null)} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={performDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
};

export default MessageTemplates;
