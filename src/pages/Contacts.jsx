import React, { useEffect, useMemo, useRef, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import AddPeopleToGroup from "../components/AddPeopleToGroup";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/client";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";

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
  const { showToast } = useToast();
  const { user } = useAuth();

  
  
  const [selectedContacts, setSelectedContacts] = useState([
    "Sarah Johnson",
    "Michael Brown",
  ]);
  const [groupName, setGroupName] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState(["", "", "", ""]);

  const [contacts, setContacts] = useState([]);

  // Firestore: subscribe to user's contacts
  useEffect(() => {
    if (!user?.uid) return;
    const colRef = collection(db, 'users', user.uid, 'contacts');
    const unsub = onSnapshot(colRef, (snap) => {
      const rows = snap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          name: data.name || '',
          phone: data.phone || '',
          type: data.type || 'Individual',
          tags: Array.isArray(data.tags) ? data.tags : [],
          created: data.created?.toDate ? data.created.toDate().toLocaleDateString() : (data.created || ''),
        };
      });
      setContacts(rows);
    });
    return () => unsub();
  }, [user?.uid]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All Types");
  const [filterTag, setFilterTag] = useState("All Tags");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const fileInputRef = useRef(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // contact object or null
  const [form, setForm] = useState({ name: "", phone: "", type: "Individual", tags: "" });

  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery = !q || (c.name + " " + c.phone).toLowerCase().includes(q);
      const matchesType = filterType === "All Types" || c.type === filterType;
      const matchesTag = filterTag === "All Tags" || (Array.isArray(c.tags) && c.tags.includes(filterTag));
      return matchesQuery && matchesType && matchesTag;
    });
  }, [contacts, searchQuery, filterType, filterTag]);

  const totalPages = Math.max(1, Math.ceil(filteredContacts.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredContacts.slice(startIndex, startIndex + rowsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const openAddModal = () => {
    setEditing(null);
    setForm({ name: "", phone: "", type: "Individual", tags: "" });
    setModalOpen(true);
  };

  const openEditModal = (contact) => {
    setEditing(contact);
    setForm({
      name: contact.name,
      phone: contact.phone,
      type: contact.type,
      tags: (contact.tags || []).join(", "),
    });
    setModalOpen(true);
  };

  const saveContact = async (e) => {
    e.preventDefault();
    const tags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    if (!user?.uid) return;
    if (editing) {
      await updateDoc(doc(db, 'users', user.uid, 'contacts', String(editing.id)), {
        name: form.name,
        phone: form.phone,
        type: form.type,
        tags,
      });
    } else {
      await addDoc(collection(db, 'users', user.uid, 'contacts'), {
        name: form.name,
        phone: form.phone,
        type: form.type,
        tags,
        created: serverTimestamp(),
      });
    }
    setModalOpen(false);
    setEditing(null);
  };

  const deleteContact = async (id) => {
    if (!user?.uid) return;
    await deleteDoc(doc(db, 'users', user.uid, 'contacts', String(id)));
    showToast('Contact deleted', 'success');
  };

  const handleExport = () => {
    const rows = [
      ['name','phone','type','tags','created'],
      ...filteredContacts.map((c) => [c.name, c.phone, c.type, (c.tags||[]).join('|'), c.created || ''])
    ];
    const csv = rows.map(r => r.map((v) => '"' + String(v ?? '').replace(/"/g, '""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'contacts.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Exported contacts.csv', 'success');
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) return;
    const header = lines[0].split(',').map(h => h.trim().toLowerCase());
    const nameIdx = header.indexOf('name');
    const phoneIdx = header.indexOf('phone');
    const typeIdx = header.indexOf('type');
    const tagsIdx = header.indexOf('tags');
    const createdIdx = header.indexOf('created');
    const importedData = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',');
      if (!cols[nameIdx]) continue;
      importedData.push({
        name: cols[nameIdx]?.replace(/^\"|\"$/g, '') || '',
        phone: cols[phoneIdx]?.replace(/^\"|\"$/g, '') || '',
        type: cols[typeIdx]?.replace(/^\"|\"$/g, '') || 'Individual',
        tags: (cols[tagsIdx]?.replace(/^\"|\"$/g, '') || '').split('|').filter(Boolean),
      });
    }
    if (!user?.uid) return;
    if (importedData.length) {
      await Promise.all(importedData.map(row => addDoc(collection(db, 'users', user.uid, 'contacts'), { ...row, created: serverTimestamp() })));
      showToast(`Imported ${importedData.length} contact(s)`, 'success');
    } else {
      showToast('No contacts found in file', 'warning');
    }
    e.target.value = '';
  };

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
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
            <p className="text-gray-600">Manage your WhatsApp contacts</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={openAddModal} className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium">
              <Plus className="w-4 h-4 inline mr-2" />
              Add Contact
            </button>
            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleImportFile} />
            <button onClick={handleImportClick} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              <Upload className="w-4 h-4 inline mr-2" />
              Import
            </button>
            <button onClick={handleExport} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              <Download className="w-4 h-4 inline mr-2" />
              Export
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => { setCurrentPage(1); setSearchQuery(e.target.value); }}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg   text-gray-600"
              />
            </div>
            <select value={filterType} onChange={(e) => { setCurrentPage(1); setFilterType(e.target.value); }} className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-700">
              <option>All Types</option>
              <option>Individual</option>
              <option>Group</option>
            </select>
            <select value={filterTag} onChange={(e) => { setCurrentPage(1); setFilterTag(e.target.value); }} className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-700">
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
                {currentRows.map((contact, index) => (
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
                        <button onClick={() => openEditModal(contact)} className="text-gray-400 hover:text-gray-600">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteContact(contact.id)} className="text-gray-400 hover:text-red-600">
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
                Showing {filteredContacts.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + currentRows.length, filteredContacts.length)} of {filteredContacts.length} contacts
              </div>
              <div className="flex items-center space-x-2">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50" >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setCurrentPage(p)} className={`px-3 py-2 text-sm font-medium rounded-lg ${currentPage === p ? 'text-green-600 bg-green-50' : 'text-gray-500 hover:text-gray-700'}`}>
                    {p}
                  </button>
                ))}
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {modalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">{editing ? 'Edit Contact' : 'Add Contact'}</h3>
                <form onSubmit={saveContact} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option>Individual</option>
                        <option>Group</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                      <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Customer, VIP" />
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

          <AddPeopleToGroup
            contacts={contacts}
            onCreateGroup={({ groupName, phoneNumbers, selectedContactIds }) => {
              const membersFromSaved = contacts
                .filter(c => selectedContactIds.includes(c.id))
                .map(c => c.name);
              const membersFromNumbers = phoneNumbers
                .map(p => p.number.trim())
                .filter(Boolean);
              const newGroup = {
                id: Date.now(),
                name: groupName,
                phone: membersFromNumbers[0] || '',
                type: 'Group',
                tags: ['Internal'],
                created: new Date().toLocaleDateString(),
              };
              setContacts([newGroup, ...contacts]);
              showToast(`Group "${groupName}" created with ${membersFromSaved.length + membersFromNumbers.length} member(s).`, 'success');
            }}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
