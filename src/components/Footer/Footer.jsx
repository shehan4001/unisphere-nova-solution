import React from 'react';
import './Footer.css';
import logoImg from '../../assets/images/logo.png';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        
        
        <div className="footer-logo">
            <img 
            src={logoImg} 
            alt="UniSphere Logo" 
            className="footer-logo-img" 
          />
          <span className="logo-text">UniSphere</span>
        </div>

        
        <p className="footer-copyright">
          © 2026 Unisphere University Services. All rights reserved.
        </p>

        
        <div className="footer-links">
          <a href="/privacy" className="footer-link">Privacy Policy</a>
          <a href="/terms" className="footer-link">Terms of Service</a>
          <a href="/contact" className="footer-link">Contact Us</a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;