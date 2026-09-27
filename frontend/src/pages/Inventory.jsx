import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Package, Search, Filter, AlertCircle, RefreshCw } from 'lucide-react';

const Inventory = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, LOW_STOCK, OUT_OF_STOCK

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/parts?size=100');
      setParts(response.data.content || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async (part, newQty) => {
    try {
      // Build a clean SparePartRequest (no 'id' field)
      const requestBody = {
        partNumber: part.partNumber,
        name: part.name,
        description: part.description,
        categoryId: part.categoryId,
        brand: part.brand,
        vehicleBrand: part.vehicleBrand,
        vehicleModel: part.vehicleModel,
        manufactureYear: part.manufactureYear,
        quantity: newQty,
        minimumStockLevel: part.minimumStockLevel,
        buyingPrice: part.buyingPrice,
        sellingPrice: part.sellingPrice,
        supplierId: part.supplierId,
        location: part.location,
        status: part.status,
        partImageUrl: part.partImageUrl,
        carImageUrl: part.carImageUrl,
        partSpecifications: part.partSpecifications,
        carSpecifications: part.carSpecifications,
      };
      await axiosInstance.put(`/parts/${part.id}`, requestBody);
      fetchInventory();
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock');
    }
  };

  const filteredParts = parts.filter(part => {
    if (filter === 'LOW_STOCK') return part.quantity > 0 && part.quantity <= part.minimumStockLevel;
    if (filter === 'OUT_OF_STOCK') return part.quantity === 0;
    return true;
  });

  const promptRestock = (part) => {
    const amount = prompt('Enter quantity to add to stock:', '10');
    if (amount && !isNaN(amount) && parseInt(amount, 10) > 0) {
      handleRestock(part, part.quantity + parseInt(amount, 10));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Warehouse Inventory</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage stock levels and track low-stock items.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative max-w-md w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by part number or name..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all dark:text-white"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <select 
              className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm rounded-lg px-3 py-2 outline-none dark:text-white"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="ALL">All Items</option>
              <option value="LOW_STOCK">Low Stock Warning</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 font-medium">
              <tr>
                <th className="px-6 py-4">Part Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-center">Stock Level</th>
                <th className="px-6 py-4 text-center">Min Level</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading inventory...</td>
                </tr>
              ) : filteredParts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">No inventory items match your criteria.</td>
                </tr>
              ) : (
                filteredParts.map((part) => {
                  const isOutOfStock = part.quantity === 0;
                  const isLowStock = !isOutOfStock && part.quantity <= part.minimumStockLevel;
                  const stockPercentage = Math.min(100, Math.max(0, (part.quantity / (part.minimumStockLevel * 3)) * 100));

                  return (
                    <tr key={part.id} className={`transition-colors ${
                      isOutOfStock ? 'bg-rose-50/50 dark:bg-rose-900/10' : 
                      isLowStock ? 'bg-amber-50/50 dark:bg-amber-900/10' : 
                      'hover:bg-gray-50 dark:hover:bg-gray-700/30'
                    }`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                            {part.partImageUrl ? (
                              <img src={part.partImageUrl} alt="" className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <Package size={20} className="text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{part.name}</p>
                            <p className="text-xs text-gray-500">{part.partNumber} • {part.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {part.categoryId}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-lg font-bold ${
                            isOutOfStock ? 'text-rose-600 dark:text-rose-400' : 
                            isLowStock ? 'text-amber-600 dark:text-amber-400' : 
                            'text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {part.quantity}
                          </span>
                          {/* Progress bar visual */}
                          <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                isOutOfStock ? 'bg-rose-500' : 
                                isLowStock ? 'bg-amber-500' : 
                                'bg-emerald-500'
                              }`} 
                              style={{ width: `${stockPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-gray-500">
                        {part.minimumStockLevel}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                            <AlertCircle size={12} /> Out of Stock
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            <AlertCircle size={12} /> Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            Healthy
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => promptRestock(part)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors text-xs font-medium"
                        >
                          <RefreshCw size={14} />
                          Restock
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
