import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper to draw standard header on any report
const drawHeader = (doc, title, subtitle, user) => {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Top Accent Banner
  doc.setFillColor(14, 116, 144); // Cyan-700
  doc.rect(0, 0, pageWidth, 24, 'F');

  // Second accent line
  doc.setFillColor(20, 184, 166); // Teal-500
  doc.rect(0, 24, pageWidth, 2, 'F');

  // Company Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('AUTOPARTS PRO', 14, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Vehicle Spare Parts Management System', 14, 20);

  // Date and Time (Right aligned)
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  doc.setFontSize(8);
  doc.text(`Generated: ${dateStr} at ${timeStr}`, pageWidth - 14, 15, { align: 'right' });
  if (user?.name) {
    doc.text(`By: ${user.name} (${user.role || 'Staff'})`, pageWidth - 14, 20, { align: 'right' });
  }

  // Report Title
  doc.setTextColor(17, 24, 39); // Gray-900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(title, 14, 35);

  if (subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128); // Gray-500
    doc.text(subtitle, 14, 40);
  }

  return 46; // Next Y position
};

// Helper for Footer with page numbers
const drawFooter = (doc) => {
  const pageCount = doc.internal.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(229, 231, 235); // Gray-200
    doc.setLineWidth(0.5);
    doc.line(14, pageHeight - 14, pageWidth - 14, pageHeight - 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175); // Gray-400
    doc.text('AutoParts Pro Management System • Confidential & Proprietary Report', 14, pageHeight - 8);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, pageHeight - 8, { align: 'right' });
  }
};

/**
 * 1. Executive Summary Business Report
 */
export const generateExecutiveReport = ({ summaryData, orders = [], parts = [], user }) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const startY = drawHeader(
    doc,
    'EXECUTIVE BUSINESS INTELLIGENCE REPORT',
    'Comprehensive business KPIs, sales performance, and operational status.',
    user
  );

  const pageWidth = doc.internal.pageSize.getWidth();

  // Draw 4 Metric Cards
  const totalRevenue = Number(summaryData?.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const totalOrders = summaryData?.totalOrders || orders.length || 0;
  const totalCustomers = summaryData?.totalCustomers || 0;
  const lowStockCount = summaryData?.lowStockCount || 0;

  const cardWidth = (pageWidth - 28 - 9) / 4;
  const cardHeight = 20;
  const metrics = [
    { label: 'TOTAL REVENUE', value: `$${totalRevenue}`, color: [16, 185, 129] }, // Emerald
    { label: 'TOTAL ORDERS', value: `${totalOrders}`, color: [14, 116, 144] },   // Cyan
    { label: 'TOTAL CUSTOMERS', value: `${totalCustomers}`, color: [99, 102, 241] }, // Indigo
    { label: 'LOW STOCK ALERTS', value: `${lowStockCount}`, color: [244, 63, 94] },  // Rose
  ];

  metrics.forEach((m, idx) => {
    const x = 14 + idx * (cardWidth + 3);
    const y = startY;

    // Background
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(x, y, cardWidth, cardHeight, 2, 2, 'F');

    // Left Accent Bar
    doc.setFillColor(m.color[0], m.color[1], m.color[2]);
    doc.roundedRect(x, y, 2.5, cardHeight, 1, 1, 'F');

    // Label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(m.label, x + 5, y + 6);

    // Value
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(m.value, x + 5, y + 15);
  });

  let currentY = startY + cardHeight + 8;

  // Monthly Sales Performance Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('Monthly Revenue Trend Breakdown', 14, currentY);
  currentY += 3;

  const salesData = summaryData?.salesData || {};
  const salesRows = Object.keys(salesData).map((month) => [
    month,
    `$${Number(salesData[month] || 0).toLocaleString()}`,
    salesData[month] >= 3000 ? 'High Performance' : 'Standard',
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Month / Period', 'Recorded Revenue', 'Performance Level']],
    body: salesRows.length > 0 ? salesRows : [['No data', '$0.00', '-']],
    theme: 'grid',
    headStyles: { fillColor: [14, 116, 144], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.5 },
    styles: { fontSize: 8, cellPadding: 2.5 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 },
  });

  currentY = doc.lastAutoTable.finalY + 8;

  // Recent Orders Table
  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('Recent Orders Overview', 14, currentY);
  currentY += 3;

  const orderRows = orders.slice(0, 10).map((o) => [
    o.orderNumber || 'ORD-' + o.id?.slice(-4),
    o.customerName || 'Walk-in Customer',
    o.sparePartName || 'Part #' + (o.sparePartId?.slice(-4) || ''),
    o.quantity || 1,
    `$${Number(o.totalAmount || 0).toFixed(2)}`,
    o.status || 'PENDING',
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Order #', 'Customer', 'Spare Part', 'Qty', 'Total ($)', 'Status']],
    body: orderRows.length > 0 ? orderRows : [['No orders recorded yet.', '-', '-', '-', '-', '-']],
    theme: 'striped',
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.5 },
    styles: { fontSize: 8, cellPadding: 2.5 },
    margin: { left: 14, right: 14 },
  });

  drawFooter(doc);
  doc.save(`AutoParts-Executive-Summary-${new Date().toISOString().slice(0, 10)}.pdf`);
};

/**
 * 2. Detailed Orders & Sales PDF Report
 */
export const generateOrdersReport = ({ orders = [], user }) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const startY = drawHeader(
    doc,
    'SALES & ORDERS DETAILED REPORT',
    'Full log of customer sales orders, items sold, unit prices, and completion status.',
    user
  );

  let currentY = startY;

  // Calculate order totals
  const totalAmount = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const completedCount = orders.filter(o => o.status === 'COMPLETED').length;
  const pendingCount = orders.filter(o => o.status === 'PENDING').length;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Total Orders: ${orders.length}  |  Completed: ${completedCount}  |  Pending: ${pendingCount}  |  Total Sales Value: $${totalAmount.toFixed(2)}`, 14, currentY);
  currentY += 4;

  const rows = orders.map((o) => [
    o.orderNumber || 'N/A',
    o.customerName || 'N/A',
    o.sparePartName || 'N/A',
    o.quantity || 1,
    `$${Number(o.unitPrice || 0).toFixed(2)}`,
    `$${Number(o.totalAmount || 0).toFixed(2)}`,
    o.status || 'PENDING',
    o.orderDate ? new Date(o.orderDate).toLocaleDateString() : 'N/A'
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Order No', 'Customer Name', 'Part Purchased', 'Qty', 'Unit Price', 'Total ($)', 'Status', 'Date']],
    body: rows.length > 0 ? rows : [['No orders found', '-', '-', '-', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: [14, 116, 144], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
    styles: { fontSize: 7.5, cellPadding: 2 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 },
  });

  drawFooter(doc);
  doc.save(`AutoParts-Sales-Orders-Report-${new Date().toISOString().slice(0, 10)}.pdf`);
};

/**
 * 3. Inventory & Spare Parts Stock PDF Report
 */
export const generateInventoryReport = ({ parts = [], user }) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const startY = drawHeader(
    doc,
    'INVENTORY & SPARE PARTS VALUATION REPORT',
    'Catalog of all spare parts, stock levels, buying/selling prices, and shelf locations.',
    user
  );

  let currentY = startY;

  // Valuation calculation
  const totalStockQuantity = parts.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
  const totalInventoryValue = parts.reduce((sum, p) => sum + ((Number(p.buyingPrice) || 0) * (Number(p.quantity) || 0)), 0);
  const totalRetailValue = parts.reduce((sum, p) => sum + ((Number(p.sellingPrice) || 0) * (Number(p.quantity) || 0)), 0);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Total Catalog Items: ${parts.length}  |  Total Units in Stock: ${totalStockQuantity}  |  Inventory Asset Value: $${totalInventoryValue.toFixed(2)}  |  Potential Retail: $${totalRetailValue.toFixed(2)}`, 14, currentY);
  currentY += 4;

  const rows = parts.map((p) => {
    const isLow = (p.quantity || 0) <= (p.minimumStockLevel || 0);
    return [
      p.partNumber || 'N/A',
      p.name || 'N/A',
      p.brand || 'N/A',
      `${p.vehicleBrand || ''} ${p.vehicleModel || ''}`.trim() || 'Universal',
      p.categoryId || 'General',
      p.quantity || 0,
      p.minimumStockLevel || 0,
      `$${Number(p.buyingPrice || 0).toFixed(2)}`,
      `$${Number(p.sellingPrice || 0).toFixed(2)}`,
      p.location || 'Warehouse',
      isLow ? 'LOW STOCK' : 'IN STOCK'
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [['Part #', 'Part Name', 'Brand', 'Vehicle Compatibility', 'Category', 'Stock', 'Min', 'Cost', 'Sell Price', 'Location', 'Status']],
    body: rows.length > 0 ? rows : [['No inventory found', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: [15, 118, 110], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
    styles: { fontSize: 7.5, cellPadding: 2 },
    didParseCell: function(data) {
      if (data.column.index === 10 && data.cell.raw === 'LOW STOCK') {
        data.cell.styles.textColor = [225, 29, 72];
        data.cell.styles.fontStyle = 'bold';
      }
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 },
  });

  drawFooter(doc);
  doc.save(`AutoParts-Inventory-Report-${new Date().toISOString().slice(0, 10)}.pdf`);
};

/**
 * 4. Low Stock Alert PDF Report
 */
export const generateLowStockReport = ({ parts = [], user }) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const startY = drawHeader(
    doc,
    'LOW STOCK REORDER WARNING REPORT',
    'Critical spare parts currently at or below minimum inventory reorder thresholds.',
    user
  );

  let currentY = startY;

  const lowStockParts = parts.filter(p => (p.quantity || 0) <= (p.minimumStockLevel || 0));

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(225, 29, 72); // Rose
  doc.text(`Action Required: ${lowStockParts.length} parts need replenishment.`, 14, currentY);
  currentY += 4;

  const rows = lowStockParts.map((p) => [
    p.partNumber || 'N/A',
    p.name || 'N/A',
    p.brand || 'N/A',
    p.quantity || 0,
    p.minimumStockLevel || 0,
    Math.max(0, (p.minimumStockLevel || 0) * 2 - (p.quantity || 0)), // Recommended reorder qty
    `$${Number(p.buyingPrice || 0).toFixed(2)}`,
    p.supplierId || 'Default Supplier'
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Part #', 'Part Name', 'Brand', 'Current Stock', 'Min Threshold', 'Suggested Reorder', 'Unit Cost', 'Supplier Ref']],
    body: rows.length > 0 ? rows : [['All inventory levels are healthy. No items below minimum threshold.', '-', '-', '-', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: [225, 29, 72], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
    styles: { fontSize: 7.5, cellPadding: 2 },
    alternateRowStyles: { fillColor: [255, 241, 242] },
    margin: { left: 14, right: 14 },
  });

  drawFooter(doc);
  doc.save(`AutoParts-Low-Stock-Warning-${new Date().toISOString().slice(0, 10)}.pdf`);
};
