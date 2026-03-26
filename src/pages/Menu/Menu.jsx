import React, { useState, useEffect } from "react";
import Footer from '../../components/Footer/Footer'; 
import { useNavigate } from "react-router-dom";
import "./Menu.css";

import rewardIcon from "../../assets/images/Vector.svg";
import clubIcon from "../../assets/images/club.svg";
import transitIcon from "../../assets/images/transist.svg";
import eventIcon from "../../assets/images/event.svg";
import portal from "../../assets/images/portal.svg";

const Menu = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      
      const options = { weekday: 'long', month: 'long', day: 'numeric' };
      let dateString = now.toLocaleDateString('en-US', options);
      
      
      const day = now.getDate();
      let suffix = "th";
      if (day === 1 || day === 21 || day === 31) suffix = "st";
      else if (day === 2 || day === 22) suffix = "nd";
      else if (day === 3 || day === 23) suffix = "rd";
      
      setCurrentDate(`${dateString}${suffix}`);
    };

    updateDate();
  }, []);

  return (
    <div className="menu-wrapper">
      <div className="menu-container">
        
        
        <header className="menu-header">
          <div className="welcome-texts">
            <h2 className="welcome-title">Welcome back, Alex! 👋</h2>
            <p className="welcome-date">{currentDate}</p>
          </div>
        </header>

        
        <section className="academic-banner">
          <div className="academic-content">
            <h3 className="academic-title">Academic Hub</h3>
            <p className="academic-description">
              Access your grades, enrollment status, financial aid, and official
              documents all in one place.
            </p>
            <button 
              className="portal-btn" 
              onClick={() => navigate("/student-portal")}
            >
              <img src={portal} alt="portal icon" className="portal-icon"/>
              Go to Student Portal
            </button>
          </div>
        </section>

      
        <div className="menu-grid">
         
          <div className="menu-card">
            <div className="card-img rewards-bg"></div>
            <div className="card-info">
              <h4>Check-in & Rewards</h4>
              <p>Scan in, track visits, and earn rewards.</p>
              <button className="view-btn" onClick={() => navigate("/reward")}>
                <img src={rewardIcon} className="btn-icon" alt="reward" />
                View Rewards
              </button>
            </div>
          </div>

          
          <div className="menu-card">
            <div className="card-img clubs-bg"></div>
            <div className="card-info">
              <h4>Campus Clubs Connector</h4>
              <p>Discover clubs, join events, and connect with students.</p>
              <button className="view-btn" onClick={() => navigate("/campus-clubs")}>
                <img src={clubIcon} className="btn-icon" alt="club" />
                Explore Community
              </button>
            </div>
          </div>

          
          <div className="menu-card">
            <div className="card-img transit-bg"></div>
            <div className="card-info">
              <h4>Transit & Navigation</h4>
              <p>Live routes, directions, and campus maps.</p>
              <button className="view-btn" onClick={() => navigate("/transit")}>
                <img src={transitIcon} className="btn-icon" alt="transit" />
                View Routes
              </button>
            </div>
          </div>

          
          <div className="menu-card">
            <div className="card-img events-bg"></div>
            <div className="card-info">
              <h4>Facility & Event Updates</h4>
              <p>Latest announcements, schedules, and campus events.</p>
              <button className="view-btn" onClick={() => navigate("/events")}>
                <img src={eventIcon} className="btn-icon" alt="event" />
                Explore Events
              </button>
            </div>
          </div>
        </div>
      
        <Footer/>
      </div>
    </div>
  );
};

export default Menu;
