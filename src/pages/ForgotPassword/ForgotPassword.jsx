import React from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Link එක import කරන්න
import './ForgotPassword.css';
import bgImage from '../../assets/images/background.png'; 
import resetIcon from '../../assets/images/reset-icon.png'; 
import contactIcon from '../../assets/images/contact-icon.png'; 
import returnArrow from '../../assets/images/return-arrow.png'; 

const ForgotPassword = () => {
  const navigate = useNavigate();

  return (
    <div className="reset-screen">
      <div className="background-container">
        <img src={bgImage} alt="background" className="bg-image" />
      </div>

      <div className="reset-main-content">
        <div className="reset-card">
          <div className="reset-header">
            <div className="icon-circle">
              <img src={resetIcon} alt="Reset" />
            </div>
          </div>

          <div className="reset-body">
            <h2>Reset Your Password</h2>
            <p>
              For security reasons, password resets are handled centrally. Please contact the <Link to="/help-Center" className="help-link-text">UniSphere Help Service</Link> to verify your identity and restore access to your account.
            </p>

            <button className="contact-btn" onClick={() => navigate('/help-Center')}>
              <img src={contactIcon} alt="Contact" className="btn-png-icon" /> 
              Contact Help Service
            </button>

            <div className="back-to-login-container">
              <img src={returnArrow} alt="Return" className="return-png-icon" />
              <button className="back-to-login" onClick={() => navigate('/')}>
                Return to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;