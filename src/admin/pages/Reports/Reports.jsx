import React from 'react';
// Recharts සහ PDF Libraries import කිරීම
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Reports.css';
import bannerBg from '../../../assets/images/banner-bg.png';

const Reports = () => {

  // --- 1. Charts සහ Table සඳහා දත්ත (Data) ---
  const clubData = [
    { name: 'Academic', value: 6, color: '#1e3a5f' },
    { name: 'Social', value: 4, color: '#f59e0b' },
    { name: 'Sports', value: 2, color: '#10b981' },
  ];

  const eventGrowthData = [
    { month: 'Jan', events: 12 },
    { month: 'Feb', events: 20 },
    { month: 'Mar', events: 35 },
    { month: 'Apr', events: 28 },
    { month: 'May', events: 50 },
    { month: 'Jun', events: 62 },
  ];

  const activityLog = [
    ['Oct 24, 2026', 'Event', 'Guest Speaker Series Added', 'Completed'],
    ['Oct 22, 2026', 'Club', 'New Request: Robotics Club', 'Pending'],
    ['Oct 20, 2026', 'Facility', 'Main Hall Maintenance', 'Completed'],
  ];

  // --- 2. PDF එක Generate කරන Function එක ---
  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // PDF එකට මාතෘකාවක් එකතු කිරීම
    doc.setFontSize(18);
    doc.text("UniSphere System Analytics Report", 14, 20);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    // Table එක PDF එකට ඇතුළත් කිරීම
    autoTable(doc, {
      startY: 40,
      head: [['Date', 'Category', 'Action', 'Status']],
      body: activityLog,
      theme: 'striped',
      headStyles: { fillStyle: '#1e3a5f' }
    });

    // PDF එක Save කිරීම
    doc.save("UniSphere_Activity_Report.pdf");
  };

  return (
    <div className="admin-layout-wrapper">
      <Sidebar />
      <div className="admin-page-content" style={{ '--bg-image': `url(${bannerBg})` }}>
        
        <header className="page-header-simple">
          <div className="welcome-text">
            <h1>System Analytics & Reports</h1>
          </div>
        </header>

        <div className="reports-charts-grid">
          {/* --- Pie Chart (Club Distribution) --- */}
          <div className="analytics-card">
            <h3>Club Distribution</h3>
            <div className="chart-area recharts-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={clubData}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={90}
                    paddingAngle={5} dataKey="value"
                  >
                    {clubData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* --- Line Chart (Event Growth) --- */}
          <div className="analytics-card">
            <h3>Monthly Event Growth</h3>
            <div className="chart-area recharts-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={eventGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="events" stroke="#a855f7" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* --- 3. Recent Activity Log Table Section --- */}
        <section className="activity-log-container">
          <div className="log-header">
            <h3>Recent Activity Log</h3>
            {/* PDF බටන් එක මෙතන තියෙනවා */}
            <button className="download-pdf-btn" onClick={downloadPDF}>
              Download PDF
            </button>
          </div>
          
          <div className="table-wrapper">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Action</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {activityLog.map((row, index) => (
                  <tr key={index}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                    <td>
                      <span className={`badge-status ${row[3].toLowerCase()}`}>
                        {row[3]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Reports;