import React, { useEffect } from 'react';
import './StudentPortal.css';
import logoImg from '../../assets/images/logo.png';
import splashBg from '../../assets/images/banner-bg.png';
import { markTaskVisited } from "../../utils/taskProgress";

const StudentPortal = () => {
  useEffect(() => {
    markTaskVisited("visit_student_portal");
  }, []);

  return (
    <div
      className="portal-splash-wrapper"
      style={{ backgroundImage: `url(${splashBg})` }}
    >
      <div className="portal-splash-content">
        <div className="brand-section">
          <img src={logoImg} alt="UniSphere Logo" className="static-logo" />
          <h1 className="brand-name">UniSphere</h1>
        </div>

        <div className="loading-container">
          <p className="loading-text">LOADING...</p>

          <div className="loading-track">
            <div className="loading-bar-fill"></div>
          </div>

          <p className="status-msg">Initializing secure environment</p>
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;