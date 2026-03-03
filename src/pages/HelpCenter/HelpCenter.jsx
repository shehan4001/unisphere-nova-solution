import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HelpCenter.css';
import Footer from '../../components/Footer/Footer'; 


import phoneIcon from '../../assets/images/phone-icon.png';
import emailIcon from '../../assets/images/mail-icon.png';
import returnArrow from '../../assets/images/return-arrow.png';
import bgImage from '../../assets/images/background.png'; 

const HelpCenter = () => {
  const navigate = useNavigate();

  return (

 <div className="reset-screen">
          
          <div className="background-container">
            <img src={bgImage} alt="background" className="bg-image" />
          </div>

    <div className="help-center-container">
      
      <div className="help-header">
        <h1>Unisphere Support Center</h1>
        <p>Search our knowledge base for guides, tutorials, and troubleshooting tips to make the most of your learning experience.</p>
      </div>

      
      <div className="help-content-wrapper">
        <div className="help-main-card">
          <h2>Need help?</h2>
          <p className="help-subtext">Our support team is available around the clock to assist you with any questions or issues you might have.</p>
          
          <div className="support-cards-container">
            
            <div className="support-item-card">
              <div className="icon-circle">
                <img src={phoneIcon} alt="Phone" />
              </div>
              <h3>Campus Hotline</h3>
              <p>Available 24/7 for urgent technical assistance.</p>
              <a href="tel:18005550199" className="contact-link">1-800-555-0199</a>
            </div>

            
            <div className="support-item-card">
              <div className="icon-circle">
                <img src={emailIcon} alt="Email" />
              </div>
              <h3>Email Support</h3>
              <p>Get a response from our agents within 2 hours.</p>
              <a href="mailto:support@campushub.edu" className="contact-link">support@campushub.edu</a>
            </div>
          </div>
        </div>


      </div>

      <Footer />
    </div>
  </div>

  );
};

export default HelpCenter;