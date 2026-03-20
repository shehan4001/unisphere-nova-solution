import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header'; 
import Footer from '../../components/Footer/Footer';
import './Menu.css';

const Menu = () => {
  const navigate = useNavigate();

  return (
    <div className="menu-page">
      <Header />
      
      <main className="menu-container">
        {/* Welcome Section */}
        <section className="welcome-section">
          <h1>Welcome back, Alex! 👋</h1>
          <p className="current-date">Monday, October 23rd</p>
        </section>

        {/* Academic Hub Banner */}
        <div className="academic-hub-banner">
          <div className="banner-content">
            <h2>Academic Hub</h2>
            <p>Access your grades, enrollment status, financial aid, and official documents all in one place.</p>
            <button 
              className="portal-btn" 
              onClick={() => navigate('/student-portal')}
            >
              Go to Student Portal
            </button>
          </div>
        </div>

        {/* Grid Cards - Navigation එක් කළ කොටස */}
        <div className="menu-grid">
          
          {/* Card 1: Rewards */}
          <div className="menu-card">
            <div className="card-image rewards-bg"></div>
            <div className="card-body">
              <h3>Check-in & Rewards</h3>
              <p>Scan in, track visits, and earn rewards.</p>
              <button 
                className="card-action-btn" 
                onClick={() => navigate('/reward')} // /reward path එකට යොමු කරයි
              >
                View Rewards
              </button>
            </div>
          </div>

          {/* Card 2: Campus Clubs */}
          <div className="menu-card">
            <div className="card-image clubs-bg"></div>
            <div className="card-body">
              <h3>Campus Clubs Connector</h3>
              <p>Discover clubs, join events, and connect with students.</p>
              <button 
                className="card-action-btn" 
                onClick={() => navigate('/campus-clubs')} // /campus-clubs path එකට යොමු කරයි
              >
                Explore Community
              </button>
            </div>
          </div>

          {/* Card 3: Transit */}
          <div className="menu-card">
            <div className="card-image transit-bg"></div>
            <div className="card-body">
              <h3>Transit & Navigation</h3>
              <p>Live routes, directions, and campus maps.</p>
              <button 
                className="card-action-btn" 
                onClick={() => navigate('/transit')} // /transit path එකට යොමු කරයි
              >
                View Routes
              </button>
            </div>
          </div>

          {/* Card 4: Events */}
          <div className="menu-card">
            <div className="card-image events-bg"></div>
            <div className="card-body">
              <h3>Facility & Event Updates</h3>
              <p>Latest announcements, schedules, and campus events.</p>
              <button 
                className="card-action-btn" 
                onClick={() => navigate('/events')} // /events path එකට යොමු කරයි
              >
                Explore Events
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
};

export default Menu;