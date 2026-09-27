import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  FileDown, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  ShoppingCart, 
  Boxes, 
  FileText,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { 
  generateExecutiveReport, 
  generateOrdersReport, 
  generateInventoryReport, 
  generateLowStockReport 
} from '../utils/pdfGenerator';

const Reports = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Parallel fetch summary, orders, and parts for accurate PDF generation
      const [summaryRes, ordersRes, partsRes] = await Promise.all([
        axiosInstance.get('/reports/summary'),
        axiosInstance.get('/orders').catch(() => ({ data: [] })),
        axiosInstance.get('/parts?size=100').catch(() => ({ data: { content: [] } }))
      ]);

      setData(summaryRes.data);
      setOrders(ordersRes.data || []);
      setParts(partsRes.data?.content || partsRes.data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Could not load report data. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async (type) => {
    try {
      setPdfGenerating(true);
      // Small timeout to allow UI to show loading spinner
      await new Promise(r => setTimeout(r, 200));

      if (type === 'executive') {
        generateExecutiveReport({ summaryData: data, orders, parts, user });
      } else if (type === 'orders') {
        generateOrdersReport({ orders, user });
      } else if (type === 'inventory') {
        generateInventoryReport({ parts, user });
      } else if (type === 'low_stock') {
        generateLowStockReport({ parts, user });
      }
      setPdfModalOpen(false);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setPdfGenerating(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        {error ? (
          <div className="text-center">
            <p className="text-rose-500 font-medium">{error}</p>
            <button onClick={fetchReportData} className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg">Retry</button>
          </div>
        ) : (
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        )}
      </div>
    );
  }

  // Transform sales data for Recharts
  const salesChartData = Object.keys(data.salesData || {}).map(key => ({
    name: key,
    revenue: data.salesData[key]
  }));

  const COLORS = ['#0891b2', '#14b8a6', '#6366f1', '#f59e0b'];
  const pieData = [
    { name: 'Completed Orders', value: 75 },
    { name: 'Pending Orders', value: 15 },
    { name: 'Cancelled', value: 10 },
  ]; // Mocked pie data for now

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Reports</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Key performance metrics, business intelligence, and downloadable PDF reports.</p>
        </div>

        {/* Generate PDF Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPdfModalOpen(true)}
            disabled={pdfGenerating}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white rounded-xl transition-all font-semibold shadow-md shadow-cyan-500/20 cursor-pointer disabled:opacity-50 text-sm"
          >
            {pdfGenerating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <FileDown size={18} />
                <span>Download PDF Report</span>
                <ChevronDown size={14} className="opacity-80" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* PDF Export Modal */}
      {pdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <FileText size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Generate PDF Report</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Select the report format to download</p>
                </div>
              </div>
              <button
                onClick={() => setPdfModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-3">
              {/* Option 1: Executive Summary */}
              <button
                onClick={() => handleDownloadPdf('executive')}
                disabled={pdfGenerating}
                className="w-full text-left p-4 rounded-xl border border-gray-200/80 dark:border-gray-700 hover:border-cyan-500 dark:hover:border-cyan-500 bg-gray-50/60 dark:bg-gray-900/40 hover:bg-cyan-50/40 dark:hover:bg-cyan-950/20 transition-all flex items-start gap-3.5 group cursor-pointer"
              >
                <div className="p-2.5 rounded-lg bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
                  <TrendingUp size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      Executive Business Summary Report
                    </h3>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Key performance indicators, total revenue, monthly sales trends, order status breakdown, and executive metrics.
                  </p>
                </div>
              </button>

              {/* Option 2: Sales & Orders */}
              <button
                onClick={() => handleDownloadPdf('orders')}
                disabled={pdfGenerating}
                className="w-full text-left p-4 rounded-xl border border-gray-200/80 dark:border-gray-700 hover:border-cyan-500 dark:hover:border-cyan-500 bg-gray-50/60 dark:bg-gray-900/40 hover:bg-cyan-50/40 dark:hover:bg-cyan-950/20 transition-all flex items-start gap-3.5 group cursor-pointer"
              >
                <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
                  <ShoppingCart size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Sales & Customer Orders Report
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Itemized list of customer orders with quantities, unit prices, totals, transaction dates, and fulfillment status.
                  </p>
                </div>
              </button>

              {/* Option 3: Inventory Valuation */}
              <button
                onClick={() => handleDownloadPdf('inventory')}
                disabled={pdfGenerating}
                className="w-full text-left p-4 rounded-xl border border-gray-200/80 dark:border-gray-700 hover:border-cyan-500 dark:hover:border-cyan-500 bg-gray-50/60 dark:bg-gray-900/40 hover:bg-cyan-50/40 dark:hover:bg-cyan-950/20 transition-all flex items-start gap-3.5 group cursor-pointer"
              >
                <div className="p-2.5 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 shrink-0 group-hover:scale-105 transition-transform">
                  <Boxes size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    Spare Parts Catalog & Inventory Valuation
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Complete inventory valuation in landscape format, showing stock levels, cost prices, retail values, vehicle models, and bin locations.
                  </p>
                </div>
              </button>

              {/* Option 4: Low Stock Alert Warning */}
              <button
                onClick={() => handleDownloadPdf('low_stock')}
                disabled={pdfGenerating}
                className="w-full text-left p-4 rounded-xl border border-gray-200/80 dark:border-gray-700 hover:border-rose-500 dark:hover:border-rose-500 bg-gray-50/60 dark:bg-gray-900/40 hover:bg-rose-50/40 dark:hover:bg-rose-950/20 transition-all flex items-start gap-3.5 group cursor-pointer"
              >
                <div className="p-2.5 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 shrink-0 group-hover:scale-105 transition-transform">
                  <AlertTriangle size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    Low Stock Reorder Warning Report
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Immediate replenishment list of critical spare parts currently at or below minimum threshold with recommended reorder amounts.
                  </p>
                </div>
              </button>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900/60 border-t border-gray-100 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setPdfModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-semibold cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-xl">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">${Number(data.totalRevenue || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{data.totalOrders}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Customers</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{data.totalCustomers}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 rounded-xl">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Low Stock Alerts</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{data.lowStockCount}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Revenue Trend (YTD)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-700" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} tickFormatter={(value) => `$${value}`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#14b8a6', fontWeight: 600 }}
                  formatter={(value) => [`$${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Pie Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Order Status Distribution</h2>
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
