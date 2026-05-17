import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './Menu.css';

const Menu = () => {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const storedUser = savedUser ? JSON.parse(savedUser) : null;

    if (storedUser && storedUser.FullName) {
      setStudentName(storedUser.FullName);
    } else {
      navigate('/login');
    }

    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('en-US', options);
    setCurrentDate(today);
  }, [navigate]);

  return (
    <div className="menu-page">
      <Header />

      <main className="menu-container">
        <section className="welcome-section">
          <h1>Welcome back, {studentName || 'Student'}! 👋</h1>
          <p className="current-date">{currentDate}</p>
        </section>

        <div className="academic-hub-banner">
          <div className="banner-content">
            <h2>Academic Hub</h2>
            <p>
              Access your grades, enrollment status, financial aid, and official documents all in one place.
            </p>
            <button
              className="portal-btn"
              onClick={() => navigate('/student-portal')}
            >
              Go to Student Portal
            </button>
          </div>
        </div>

        <div className="menu-grid">
          <div className="menu-card">
            <div className="card-image rewards-bg"></div>
            <div className="card-body">
              <h3>Check-in & Rewards</h3>
              <p>Scan in, track visits, and earn rewards.</p>
              <button
                className="card-action-btn"
                onClick={() => navigate('/reward')}
              >
                View Rewards
              </button>
            </div>
          </div>

          <div className="menu-card">
            <div className="card-image clubs-bg"></div>
            <div className="card-body">
              <h3>Campus Clubs Connector</h3>
              <p>Discover clubs, join events, and connect with students.</p>
              <button
                className="card-action-btn"
                onClick={() => navigate('/campus-clubs')}
              >
                Explore Community
              </button>
            </div>
          </div>

          <div className="menu-card">
            <div className="card-image transit-bg"></div>
            <div className="card-body">
              <h3>Transit & Navigation</h3>
              <p>Live routes, directions, and campus maps.</p>
              <button
                className="card-action-btn"
                onClick={() => navigate('/transit')}
              >
                View Routes
              </button>
            </div>
          </div>

          <div className="menu-card">
            <div className="card-image events-bg"></div>
            <div className="card-body">
              <h3>Facility & Event Updates</h3>
              <p>Latest announcements, schedules, and campus events.</p>
              <button
                className="card-action-btn"
                onClick={() => navigate('/events')}
              >
                Explore Events
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Menu;