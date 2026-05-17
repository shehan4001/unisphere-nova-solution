import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Reports.css';
import bannerBg from '../../../assets/images/banner-bg.png';

const Reports = () => {
  const [reportData, setReportData] = useState({
    clubDistribution: [],
    eventGrowth: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dashboard/analytics-data');
        
        
        const colorPalette = { 
          Academic: '#1e3a5f', Social: '#f59e0b', Sports: '#10b981', 
          Volunteering: '#6366f1', Default: '#8884d8' 
        };

        const formattedClubs = res.data.clubDistribution.map(item => ({
          name: item.name.trim(), 
          value: Number(item.value), 
          color: colorPalette[item.name.trim()] || colorPalette.Default
        }));

        setReportData({
          clubDistribution: formattedClubs,
          eventGrowth: res.data.eventGrowth,
          recentActivity: res.data.recentActivity
        });
        setLoading(false);
      } catch (err) {
        console.error("Fetch Error:", err);
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

 
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("UniSphere Analytics Report", 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [['Date', 'Category', 'Action', 'Status']],
      body: reportData.recentActivity.map(log => [
        new Date(log.Date).toLocaleDateString(), log.Category, log.Action, log.Status
      ]),
    });
    doc.save("Report.pdf");
  };

  return (
    <div className="admin-layout-wrapper">
      <Sidebar />
      <div className="admin-page-content" style={{ '--bg-image': `url(${bannerBg})` }}>
        <header className="page-header-simple">
          <h1>System Analytics & Reports</h1>
        </header>

        <div className="reports-charts-grid">
         
          <div className="analytics-card">
            <h3>Club Distribution</h3>
            <div className="chart-area" style={{ height: '300px', width: '100%', position: 'relative' }}>
              {reportData.clubDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportData.clubDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%" cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                    >
                      {reportData.clubDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                  <p>No Club Data Found</p>
                </div>
              )}
            </div>
          </div>

        
          <div className="analytics-card">
            <h3>Monthly Event Growth</h3>
            <div className="chart-area" style={{ height: '300px', width: '100%' }}>
              {reportData.eventGrowth.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reportData.eventGrowth}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tick={{fontSize: 12}} />
                    <YAxis tick={{fontSize: 12}} />
                    <Tooltip />
                    <Line type="monotone" dataKey="events" stroke="#a855f7" strokeWidth={3} dot={{ r: 6, fill: '#a855f7' }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                  <p>Not enough event data yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

       
        <section className="activity-log-container">
          <div className="log-header">
            <h3>Recent Activity Log</h3>
            <button className="download-pdf-btn" onClick={downloadPDF}>Download PDF</button>
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
                {reportData.recentActivity.map((log, index) => (
                  <tr key={index}>
                    <td>{new Date(log.Date).toLocaleDateString()}</td>
                    <td>{log.Category}</td>
                    <td>{log.Action}</td>
                    <td><span className={`badge-status ${log.Status.toLowerCase()}`}>{log.Status}</span></td>
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