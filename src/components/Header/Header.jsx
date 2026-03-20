import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import defaultProfile from '../../assets/images/default-avatar.png'; 
import logoutIcon from '../../assets/images/logout.png';
import logoImg from '../../assets/images/logo.png'; 

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); 
  
  const [user, setUser] = useState({ 
    name: "Alex Rivera", 
    role: "Student", 
    image: defaultProfile 
  });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser({
        name: savedUser.name || "Alex Rivera",
        role: savedUser.role || "Student",
        image: savedUser.profilePic || defaultProfile
      });
    }

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user'); 
    navigate('/'); 
  };

  return (
    <header className="main-header">
      
      <div className="header-left">
        <div className="logo-section" onClick={() => navigate('/menu')}>
          <img src={logoImg} alt="UniSphere Logo" className="header-logo" />
          <span className="header-brand-name">UniSphere</span>
        </div>
      </div>

      
      <div className="header-right">
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <span className="user-role">{user.role}</span>
        </div>
        
        <div className="profile-container" ref={menuRef}>
          <img 
            src={user.image} 
            alt="Profile" 
            className="profile-pic" 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            onError={(e) => { e.target.src = defaultProfile; }} 
          />

          {isMenuOpen && (
            <div className="dropdown-menu">
              <div className="menu-item logout" onClick={handleLogout}>
                <img src={logoutIcon} alt="Logout" className="logout-icon-small" />
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;