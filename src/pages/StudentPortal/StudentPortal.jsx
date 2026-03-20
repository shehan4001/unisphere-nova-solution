import React from 'react';
import './StudentPortal.css';
import logoImg from '../../assets/images/logo.png'; 
// ඔයාගේ පසුබිම් පින්තූරය මෙතැනින් Import කරන්න
import splashBg from '../../assets/images/banner-bg.png'; 

const StudentPortal = () => {
  return (
    <div 
      className="portal-splash-wrapper"
      style={{ backgroundImage: `url(${splashBg})` }} // පින්තූරය පසුබිමට එක් කිරීම
    >
      <div className="portal-splash-content">
        {/* මැදට කළ ස්ථාවර ලෝගෝව */}
        <div className="brand-section">
          <img src={logoImg} alt="UniSphere Logo" className="static-logo" />
          <h1 className="brand-name">UniSphere</h1>
        </div>

        {/* ලෝඩින් ඉර ඇතුළත් කොටස */}
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