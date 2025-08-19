import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { Plus, Edit, Trash2, BarChart2 } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";

const Automations = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const seed = [
    { id: 1, name: "Welcome Sequence", type: "Drip", status: "Running", audience: "New Customers", lastRun: "15 min ago", created: "2025-07-10" },
    { id: 2, name: "Follow-up Reminder", type: "Scheduled", status: "Running", audience: "Active Leads", lastRun: "1h ago", created: "2025-07-15" },
    { id: 3, name: "Birthday Wishes", type: "Triggered", status: "Running", audience: "All Customers", lastRun: "6h ago", created: "2025-06-20" },
    { id: 4, name: "Feedback Request", type: "Scheduled", status: "Paused", audience: "Recent Purchases", lastRun: "2d ago", created: "2024-07-05" },
  ];
  const [campaigns, setCampaigns] = useState(() => {
    try { const s = localStorage.getItem('wb_campaigns'); return s ? JSON.parse(s) : seed; } catch (_) { return seed; }
  });
  useEffect(() => { try { localStorage.setItem('wb_campaigns', JSON.stringify(campaigns)); } catch (_) {} }, [campaigns]);

  const getStatusClasses = (status) => {
    if (status === "Running")
      return "bg-green-100 text-green-600 px-2 py-1 rounded text-sm";
    if (status === "Paused")
      return "bg-yellow-100 text-yellow-600 px-2 py-1 rounded text-sm";
    return "";
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", type: "Drip", audience: "All Contacts", status: "Paused", schedule: "" });
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All Types");
  const [filterStatus, setFilterStatus] = useState("All Statuses");

  const filtered = useMemo(() => campaigns.filter(c =>
    (filterType === 'All Types' || c.type === filterType) &&
    (filterStatus === 'All Statuses' || c.status === filterStatus) &&
    c.name.toLowerCase().includes(search.toLowerCase())
  ), [campaigns, search, filterType, filterStatus]);

  const openCreate = () => { setEditing(null); setForm({ name: "", type: "Drip", audience: "All Contacts", status: "Paused", schedule: "" }); setModalOpen(true); };
  const openEdit = (c) => { setEditing(c); setForm({ name: c.name, type: c.type, audience: c.audience, status: c.status, schedule: c.schedule || "" }); setModalOpen(true); };
  const saveCampaign = (e) => {
    e.preventDefault();
    if (!form.name.trim()) { showToast('Please enter a campaign name', 'warning'); return; }
    if (editing) {
      setCampaigns(campaigns.map(c => c.id === editing.id ? { ...c, ...form, name: form.name.trim() } : c));
      showToast('Campaign updated', 'success');
    } else {
      setCampaigns([{ id: Date.now(), ...form, name: form.name.trim(), lastRun: '—', created: new Date().toISOString().slice(0,10) }, ...campaigns]);
      showToast('Campaign created', 'success');
    }
    setModalOpen(false); setEditing(null);
  };
  const removeCampaign = (id) => { setCampaigns(campaigns.filter(c => c.id !== id)); showToast('Campaign deleted', 'success'); };
  const viewAnalytics = () => navigate('/analytics');
  const toggleStatus = (c) => {
    const next = c.status === 'Running' ? 'Paused' : 'Running';
    setCampaigns(campaigns.map(x => x.id === c.id ? { ...x, status: next } : x));
    showToast(`Campaign ${next.toLowerCase()}`, 'success');
  };

  return (
    <DashboardLayout>
    <div className="p-4 sm:p-6 w-full bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Automations</h1>
          <p className="text-gray-500">
            Set up automated messaging workflows
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" className="hidden md:block px-3 py-2 border rounded-lg" />
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2 border rounded-lg">
            <option>All Types</option>
            <option>Drip</option>
            <option>Scheduled</option>
            <option>Triggered</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border rounded-lg">
            <option>All Statuses</option>
            <option>Running</option>
            <option>Paused</option>
          </select>
          <button onClick={openCreate} className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
            <Plus className="w-5 h-5" />
            Add Campaign
          </button>
        </div>
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
            {filtered.map((campaign) => (
              <tr
                key={campaign.id}
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
                  <button title="Toggle Status" onClick={() => toggleStatus(campaign)} className="px-2 py-1 border rounded text-xs">{campaign.status === 'Running' ? 'Pause' : 'Run'}</button>
                  <Edit onClick={() => openEdit(campaign)} className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
                  <Trash2 onClick={() => removeCampaign(campaign.id)} className="w-5 h-5 text-gray-600 cursor-pointer hover:text-red-500" />
                  <BarChart2 onClick={viewAnalytics} className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
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
            <button onClick={() => { setForm({ ...form, type: 'Drip' }); openCreate(); }} className="text-green-500 font-medium">
              Create Drip →
            </button>
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
            <button onClick={() => { setForm({ ...form, type: 'Scheduled' }); openCreate(); }} className="text-green-500 font-medium">
              Create Schedule →
            </button>
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
            <button onClick={() => { setForm({ ...form, type: 'Triggered' }); openCreate(); }} className="text-green-500 font-medium">
              Create Trigger →
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">{editing ? 'Edit Campaign' : 'Create Campaign'}</h3>
            <form onSubmit={saveCampaign} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option>Drip</option>
                    <option>Scheduled</option>
                    <option>Triggered</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option>Running</option>
                    <option>Paused</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Audience</label>
                <input value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              {form.type === 'Scheduled' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Schedule (YYYY-MM-DD HH:MM)</label>
                  <input value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} placeholder="2025-08-01 10:00" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setModalOpen(false); setEditing(null); }} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
};

export default Automations;
