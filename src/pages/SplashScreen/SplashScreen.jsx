import React from 'react';
import './SplashScreen.css';
import logoImg from '../../assets/images/logo.png'; 

const SplashScreen = () => {
  return (
    <div className="splash-container">
      
      <div className="bg-circle top-left"></div>
      <div className="bg-circle bottom-right"></div>
      
      <div className="logo-content-box">
        
        <div className="logo-wrapper">
          <img src={logoImg} alt="UniSphere Logo" className="spinning-logo" />
        </div>
        
        
        <h1 className="brand-text">UniSphere</h1>
      </div>
    </div>
  );
};

export default SplashScreen;