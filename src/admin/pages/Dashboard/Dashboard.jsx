import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Dashboard.css';
import axios from 'axios';
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

  const [liveStats, setLiveStats] = useState({
    totalClubs: 0,
    pendingRequests: 0,
    activeEvents: 0,
    totalStudents: 0
  });

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dashboard/stats');

        setLiveStats(res.data);
        setNotifications(res.data.notifications || []);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };

    fetchDashboardData();

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const statsDisplay = [
    { id: 1, label: 'Total Clubs', value: liveStats.totalClubs, icon: ClubsIcon, color: '#1e3a5f' },
    { id: 2, label: 'Pending Requests', value: liveStats.pendingRequests, icon: RequestsIcon, color: '#f59e0b' },
    { id: 3, label: 'Active Events', value: liveStats.activeEvents, icon: EventsIcon, color: '#10b981' },
    { id: 4, label: 'Total Students', value: liveStats.totalStudents, icon: StudentsIcon, color: '#6366f1' },
  ];

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
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </header>

        <div className="stats-grid">
          {statsDisplay.map(stat => (
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
              {notifications.length > 0 ? (
                notifications.map((notif, index) => (
                  <div key={index} className="notif-item">
                    <div className={`notif-dot ${notif.type}`}></div>
                    <p>{notif.message}</p>
                  </div>
                ))
              ) : (
                <div className="notif-item">
                  <div className="notif-dot blue"></div>
                  <p>System overview is up to date.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;