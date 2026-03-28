import React, { useState, useEffect } from 'react'; // useEffect එක් කළා
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Dashboard.css';
import axios from 'axios'; // axios එක් කළා
import dashboardBg from '../../../assets/images/banner-bg.png';

import ClubsIcon from '../../../assets/images/clubs-icon.png';
import RequestsIcon from '../../../assets/images/requests-icon.png';
import EventsIcon from '../../../assets/images/events-icon.png';
import StudentsIcon from '../../../assets/images/students-icon.png';
import NewEventIcon from '../../../assets/images/new-event.png';
import ManageClubsIcon from '../../../assets/images/manage-clubs.png';
import ReportsIcon from '../../../assets/images/reports-icon.png';

const Dashboard = () => {
  const navigate = useNavigate();

  // 1. Stats සඳහා මුලින් බින්දුව (0) අගයන් ලබා දෙනවා
  const [liveStats, setLiveStats] = useState({
    totalClubs: 0,
    pendingRequests: 0,
    activeEvents: 0,
    totalStudents: 0
  });

  // 2. Backend එකෙන් දත්ත ලබා ගැනීම
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // ඔබ සකස් කළ අලුත් API එක මෙතැනදී Call කරනවා
        const res = await axios.get('http://localhost:5000/api/dashboard/stats');
        setLiveStats(res.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };
    fetchDashboardData();
  }, []);

  // 3. Stats Grid එකට අදාළ දත්ත සකස් කිරීම
  const statsDisplay = [
    { id: 1, label: 'Total Clubs', value: liveStats.totalClubs, icon: ClubsIcon, color: '#1e3a5f' },
    { id: 2, label: 'Pending Requests', value: liveStats.pendingRequests, icon: RequestsIcon, color: '#f59e0b' },
    { id: 3, label: 'Active Events', value: liveStats.activeEvents, icon: EventsIcon, color: '#10b981' },
    { id: 4, label: 'Total Students', value: liveStats.totalStudents, icon: StudentsIcon, color: '#6366f1' },
  ];

  const [notifications] = useState([
    { id: 1, message: "System overview is up to date.", type: "blue" },
    { id: 2, message: "Check pending club requests for approval.", type: "green" }
  ]);

  return (
    <div className="admin-layout-wrapper">
      <Sidebar />
      <div className="admin-page-content" style={{ '--bg-image': `url(${dashboardBg})` }}>
        
        <header className="page-header-simple">
          <div className="welcome-text">
            <h1>Admin Dashboard</h1>
            <p>Welcome back! Here's what's happening in UniSphere today.</p>
          </div>
          <div className="current-date">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        {/* --- Stats Grid (දැන් මෙහි Live Data පෙන්වයි) --- */}
        <div className="stats-grid">
          {statsDisplay.map(stat => (
            <div key={stat.id} className="stat-card animate-fade">
              <div className="stat-icon-wrapper" style={{ backgroundColor: `${stat.color}15` }}>
                <img src={stat.icon} alt={stat.label} className="dashboard-stat-img" />
              </div>
              <div className="stat-info">
                {/* 10ට අඩු අගයන් වලට ඉදිරියෙන් 0 එකතු කරයි (उदा: 08) */}
                <h3>{stat.value < 10 ? `0${stat.value}` : stat.value.toLocaleString()}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-main-content">
          <section className="requests-section flex-2">
            <h3 className="section-title">Quick Actions</h3>
            <div className="action-cards-container">
              <button className="quick-action-card" onClick={() => navigate('/admin/facility')}>
                <img src={NewEventIcon} alt="New Event" className="action-icon-img" />
                <p>New Event</p>
              </button>
              <button className="quick-action-card" onClick={() => navigate('/admin/clubs')}>
                <img src={ManageClubsIcon} alt="Manage Clubs" className="action-icon-img" />
                <p>Manage Clubs</p>
              </button>
              <button className="quick-action-card" onClick={() => navigate('/admin/reports')}>
                <img src={ReportsIcon} alt="Reports" className="action-icon-img" />
                <p>Reports</p>
              </button>
            </div>
          </section>

          <section className="requests-section flex-1">
            <h3 className="section-title">System Notifications</h3>
            <div className="notification-list">
              {notifications.map(notif => (
                <div key={notif.id} className="notif-item">
                  <div className={`notif-dot ${notif.type}`}></div>
                  <p>{notif.message}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;