import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Header.css';
import logoutIcon from '../../assets/images/logout.png';
import logoImg from '../../assets/images/logo.png';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const menuRef = useRef(null);

  const [user, setUser] = useState({
    dbId: "",      
    displayId: "", 
    name: "",
    email: "",
    role: "Student"
  });

  const [formData, setFormData] = useState({ name: "", email: "" });

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      const savedUser = JSON.parse(saved);

      setUser({
        dbId: savedUser.ID || "",
        displayId: savedUser.CustomID || "N/A", 
        name: savedUser.FullName || "User",
        email: savedUser.Email || "",
        role: savedUser.Role || "User"
      });
      setFormData({ 
        name: savedUser.FullName || "", 
        email: savedUser.Email || "" 
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

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return "U";
    const nameArray = name.trim().split(/\s+/); 
    if (nameArray.length >= 2) {
      return (nameArray[0].charAt(0) + nameArray[1].charAt(0)).toUpperCase();
    }
    return nameArray[0].charAt(0).toUpperCase();
  };

  const handleSave = async () => {
    if (!user.dbId) {
      alert("Error: User session expired. Please Logout and Login again.");
      return;
    }

    try {
      
      await axios.put(`http://localhost:5000/api/students/update/${user.dbId}`, {
        FullName: formData.name,
        Email: formData.email
      });

      const stored = JSON.parse(localStorage.getItem('user'));
      const updatedUser = { ...stored, FullName: formData.name, Email: formData.email };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setUser(prev => ({ ...prev, name: formData.name, email: formData.email }));
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Update failed! Please check backend console.");
    }
  };

  return (
    <header className="main-header">
      <div className="header-left">
      
        <div className="logo-section" onClick={() => navigate('/menu')} style={{cursor: 'pointer', gap: '8px'}}>
          <img src={logoImg} alt="UniSphere Logo" className="header-logo" style={{width: '60px'}} />
          <span className="header-brand-name">UniSphere</span>
        </div>
      </div>

      <div className="header-right">
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <span className="user-role">{user.role}</span>
        </div>
        <div className="profile-container" ref={menuRef}>
          <div className="user-initials-circle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {getInitials(user.name)}
          </div>
          {isMenuOpen && (
            <div className="dropdown-menu">
              <div className="menu-item" onClick={() => { setIsProfileOpen(true); setIsMenuOpen(false); }}>
                <span className="menu-icon">👤</span> View Profile
              </div>
              <div className="menu-divider"></div>
              <div className="menu-item logout" onClick={() => { localStorage.clear(); navigate('/login'); }}>
                <img src={logoutIcon} alt="Logout" className="logout-icon-small" /> Logout
              </div>
            </div>
          )}
        </div>
      </div>

      {isProfileOpen && (
        <div className="modal-overlay">
          <div className="profile-popup-card">
            <button className="close-x-btn" onClick={() => {setIsProfileOpen(false); setIsEditing(false);}}>&times;</button>
            <div className="popup-header">
              <div className="popup-avatar-circle">{getInitials(user.name)}</div>
              <h3>{isEditing ? "Edit Profile" : "User Profile"}</h3>
            </div>
            <div className="popup-body">
              <div className="popup-input-group">
                <label>User ID</label>
                <input type="text" value={user.displayId} disabled className="input-read-only" />
              </div>
              <div className="popup-input-group">
                <label>Full Name</label>
                <input type="text" value={formData.name} disabled={!isEditing}
                  onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="popup-input-group">
                <label>Email Address</label>
                <input type="email" value={formData.email} disabled={!isEditing}
                  onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>
            <div className="popup-footer">
              {!isEditing ? (
                <button className="btn-edit-mode" onClick={() => setIsEditing(true)}>Edit Profile</button>
              ) : (
                <div className="edit-btn-container">
                  <button className="btn-save-action" onClick={handleSave}>Save Changes</button>
                  <button className="btn-cancel-action" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;