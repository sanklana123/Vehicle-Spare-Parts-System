import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { Plus, Search, Edit, Trash2, Eye, X, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const PartsList = () => {
  const [parts, setParts] = useState([]);
  const [filteredParts, setFilteredParts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [selectedPart, setSelectedPart] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchParts();
  }, []);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFilteredParts(
      parts.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.partNumber?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.vehicleBrand?.toLowerCase().includes(q) ||
        p.vehicleModel?.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, parts]);

  const fetchParts = async () => {
    try {
      setLoading(true);
      // Fetch up to 100 parts so all seeded data appears
      const response = await axiosInstance.get('/parts?size=100');
      const data = response.data.content || [];
      setParts(data);
      setFilteredParts(data);
    } catch (error) {
      console.error('Error fetching parts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this spare part?')) {
      try {
        await axiosInstance.delete(`/parts/${id}`);
        fetchParts();
      } catch (error) {
        console.error('Error deleting part:', error);
        alert('Failed to delete part');
      }
    }
  };

  const openDetails = (part) => {
    setSelectedPart(part);
    setIsModalOpen(true);
  };

  const closeDetails = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedPart(null), 200); // clear after animation
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Spare Parts</h1>
        <Link 
          to="/parts/new" 
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
        >
          <Plus size={20} />
          Add Part
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, number, brand..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Part Number</th>
                <th className="px-6 py-4">Name & Vehicle</th>
                <th className="px-6 py-4">Brand</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    Loading parts...
                  </td>
                </tr>
              ) : parts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <ImageIcon className="text-gray-400" size={24} />
                      </div>
                      <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">No spare parts found</p>
                      <p className="text-gray-500 dark:text-gray-400">Start by adding your first spare part.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredParts.map((part) => (
                  <tr key={part.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{part.partNumber}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {part.partImageUrl ? (
                          <img src={part.partImageUrl} alt={part.name} className="w-10 h-10 rounded-md object-cover border border-gray-200 dark:border-gray-600" />
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                            <ImageIcon size={16} className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{part.name}</p>
                          <p className="text-xs text-gray-500">{part.vehicleBrand} {part.vehicleModel} {part.manufactureYear}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{part.brand}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        part.quantity === 0 
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                          : part.quantity <= part.minimumStockLevel
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {part.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4">${part.sellingPrice?.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        part.status === 'ACTIVE' 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {part.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openDetails(part)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="View Details">
                          <Eye size={18} />
                        </button>
                        <Link to={`/parts/${part.id}/edit`} className="p-2 text-gray-400 hover:text-primary-600 transition-colors" title="Edit Part">
                          <Edit size={18} />
                        </Link>
                        <button onClick={() => handleDelete(part.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Delete Part">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {isModalOpen && selectedPart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Part Details: {selectedPart.partNumber}</h2>
              <button onClick={closeDetails} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Images Column */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Spare Part Image</h3>
                    <div className="rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 aspect-video border border-gray-200 dark:border-gray-700">
                      {selectedPart.partImageUrl ? (
                        <img src={selectedPart.partImageUrl} alt={selectedPart.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                          <ImageIcon size={48} className="mb-2 opacity-50" />
                          <span>No Image Available</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Compatible Vehicle</h3>
                    <div className="rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 aspect-video border border-gray-200 dark:border-gray-700">
                      {selectedPart.carImageUrl ? (
                        <img src={selectedPart.carImageUrl} alt={`${selectedPart.vehicleBrand} ${selectedPart.vehicleModel}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                          <ImageIcon size={48} className="mb-2 opacity-50" />
                          <span>No Image Available</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Specs Column */}
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{selectedPart.name}</h1>
                    <p className="text-lg text-primary-600 dark:text-primary-400 font-medium mb-4">{selectedPart.brand}</p>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {selectedPart.description || 'No description provided.'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div>
                      <span className="text-xs text-gray-500 block mb-1">Selling Price</span>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">${selectedPart.sellingPrice?.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block mb-1">Current Stock</span>
                      <span className={`text-xl font-bold ${
                        selectedPart.quantity === 0 ? 'text-red-500' : selectedPart.quantity <= selectedPart.minimumStockLevel ? 'text-yellow-500' : 'text-green-500'
                      }`}>{selectedPart.quantity} units</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">Part Specifications</h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      {selectedPart.partSpecifications || 'N/A'}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">Vehicle Specifications</h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <p className="font-medium text-gray-900 dark:text-white mb-2">{selectedPart.vehicleBrand} {selectedPart.vehicleModel} ({selectedPart.manufactureYear})</p>
                      {selectedPart.carSpecifications || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
              <button onClick={closeDetails} className="px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors font-medium">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartsList;
