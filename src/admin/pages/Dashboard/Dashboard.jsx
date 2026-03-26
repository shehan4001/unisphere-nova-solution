import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Dashboard.css';
import dashboardBg from '../../../assets/images/banner-bg.png';

// --- අයිකන රූප 7 මෙහිදී Import කරන්න ---
import ClubsIcon from '../../../assets/images/clubs-icon.png';
import RequestsIcon from '../../../assets/images/requests-icon.png';
import EventsIcon from '../../../assets/images/events-icon.png';
import StudentsIcon from '../../../assets/images/students-icon.png';
import NewEventIcon from '../../../assets/images/new-event.png';
import ManageClubsIcon from '../../../assets/images/manage-clubs.png';
import ReportsIcon from '../../../assets/images/reports-icon.png';

const Dashboard = () => {
  const navigate = useNavigate();

  // --- Stats Grid සඳහා දත්ත (Icons 4) ---
  const [stats] = useState([
    { id: 1, label: 'Total Clubs', value: 12, icon: ClubsIcon, color: '#1e3a5f', path: '/admin/clubs' },
    { id: 2, label: 'Pending Requests', value: 8, icon: RequestsIcon, color: '#f59e0b', path: '/admin/requests' },
    { id: 3, label: 'Active Events', value: 5, icon: EventsIcon, color: '#10b981', path: '/admin/events' },
    { id: 4, label: 'Total Students', value: 1250, icon: StudentsIcon, color: '#6366f1', path: '/admin/students' },
  ]);

  const [notifications] = useState([
    { id: 1, message: "5 new club requests pending review.", type: "blue" },
    { id: 2, message: "Campus wifi maintenance update posted.", type: "green" }
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

        {/* --- Stats Grid --- */}
        <div className="stats-grid">
          {stats.map(stat => (
            <div key={stat.id} className="stat-card animate-fade">
              <div className="stat-icon-wrapper" style={{ backgroundColor: `${stat.color}15` }}>
                <img src={stat.icon} alt={stat.label} className="dashboard-stat-img" />
              </div>
              <div className="stat-info">
                <h3>{stat.value < 10 ? `0${stat.value}` : stat.value.toLocaleString()}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-main-content">
          {/* --- Quick Actions (Icons 3) --- */}
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

          {/* --- System Notifications --- */}
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