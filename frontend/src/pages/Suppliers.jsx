import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Plus, Search, Edit, Trash2, Mail, Phone, MapPin, Truck, X } from 'lucide-react';

const emptyForm = { name: '', contactPerson: '', email: '', phone: '', address: '', specializedBrands: '', rating: 4.0 };

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchSuppliers(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(suppliers.filter(s =>
      s.name?.toLowerCase().includes(q) ||
      s.contactPerson?.toLowerCase().includes(q) ||
      s.specializedBrands?.toLowerCase().includes(q)
    ));
  }, [search, suppliers]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/suppliers');
      setSuppliers(res.data);
      setFiltered(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setModalOpen(true); };
  const openEdit = (s) => { setForm({ ...s }); setEditingId(s.id); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingId(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingId) {
        await axiosInstance.put(`/suppliers/${editingId}`, form);
      } else {
        await axiosInstance.post('/suppliers', form);
      }
      await fetchSuppliers();
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save supplier');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete supplier "${name}"? This cannot be undone.`)) return;
    try {
      await axiosInstance.delete(`/suppliers/${id}`);
      fetchSuppliers();
    } catch (e) { alert('Failed to delete supplier'); }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Supplier Directory</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage parts suppliers and manufacturers.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-teal-500 hover:from-primary-700 hover:to-teal-600 text-white rounded-lg transition-all font-medium shadow-md shadow-primary-500/20">
          <Plus size={20} /> Add Supplier
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search suppliers by name or brand..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all dark:text-white" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 font-medium">
              <tr>
                <th className="px-6 py-4">Company Details</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Specialties</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading suppliers...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No suppliers found.</td></tr>
              ) : (
                filtered.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                          <Truck size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{supplier.name}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={12} />{supplier.address}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <p className="text-gray-900 dark:text-gray-300">{supplier.contactPerson}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500"><Mail size={12} /> {supplier.email}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-500"><Phone size={12} /> {supplier.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(supplier.specializedBrands || '').split(',').map((brand, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">{brand.trim()}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="font-medium text-gray-900 dark:text-white">{Number(supplier.rating || 0).toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(supplier)} className="p-2 text-gray-400 hover:text-primary-600 transition-colors" title="Edit Supplier"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(supplier.id, supplier.name)} className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Delete Supplier"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editingId ? 'Edit Supplier' : 'Add Supplier'}</h2>
              <button onClick={closeModal} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Company Name *</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 dark:text-white" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Person</label>
                  <input value={form.contactPerson} onChange={e => setForm({...form, contactPerson: e.target.value})}
                    className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 dark:text-white" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 dark:text-white" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                  <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                    className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 dark:text-white" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Rating (1-5)</label>
                  <input type="number" min="1" max="5" step="0.1" value={form.rating} onChange={e => setForm({...form, rating: Number(e.target.value)})}
                    className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 dark:text-white" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                  <input value={form.address} onChange={e => setForm({...form, address: e.target.value})}
                    className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 dark:text-white" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Specialized Brands (comma-separated)</label>
                  <input value={form.specializedBrands} onChange={e => setForm({...form, specializedBrands: e.target.value})} placeholder="BMW, Mercedes-Benz"
                    className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 dark:text-white" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="px-5 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2 bg-gradient-to-r from-primary-600 to-teal-500 text-white rounded-lg font-medium disabled:opacity-50">
                  {saving ? 'Saving...' : editingId ? 'Update' : 'Add Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
