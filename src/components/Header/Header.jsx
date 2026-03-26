import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import logoutIcon from '../../assets/images/logout.png';
import logoImg from '../../assets/images/logo.png'; 

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); 
  
  const [user, setUser] = useState({ 
    name: "Student", 
    role: "Student", 
  });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    
    if (savedUser) {
      setUser({
        name: savedUser.FullName || "Student",
        role: savedUser.Role || "Student",
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

  // --- නමේ මුල් අකුරු ලබාගැනීමේ Function එක ---
  const getInitials = (name) => {
    if (!name) return "S";
    const nameArray = name.trim().split(" ");
    if (nameArray.length >= 2) {
      // නමේ කොටස් දෙකක් හෝ වැඩි ගණනක් ඇත්නම් මුල් අකුරු දෙකම ගනී (උදා: Kamal Perera -> KP)
      return (nameArray[0].charAt(0) + nameArray[1].charAt(0)).toUpperCase();
    }
    // එක නමක් පමණක් ඇත්නම් එහි මුල් අකුර පමණක් ගනී
    return nameArray[0].charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    localStorage.clear(); 
    navigate('/login'); 
  };

  return (
    <header className="main-header">
      
      <div className="header-left">
        <div className="logo-section" onClick={() => navigate('/menu')} style={{cursor: 'pointer'}}>
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
          {/* පින්තූරයක් වෙනුවට මුල් අකුරු සහිත රවුම පෙන්වීම */}
          <div 
            className="user-initials-circle" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {getInitials(user.name)}
          </div>

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