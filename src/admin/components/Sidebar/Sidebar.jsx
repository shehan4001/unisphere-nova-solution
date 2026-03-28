import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // Axios අමතක කරන්න එපා
import './Sidebar.css';

// Icons & Images Imports
import UnisphereLogo from '../../../assets/images/logo.png'; 
import DashboardIcon from '../../../assets/images/dashboard.svg'; 
import FacilityIcon from '../../../assets/images/facility.svg';
import ClubsIcon from '../../../assets/images/clubs.svg';
import StudentIcon from '../../../assets/images/student-registration.png'; 
import ProfileIcon from '../../../assets/images/profile.png'; 
import LogoutIcon from '../../../assets/images/logout.png';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const [showDropdown, setShowDropdown] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state එකක් එකතු කළා
  
  const [adminData, setAdminData] = useState({
    id: "", // Database ID එක අවශ්‍යයි Update කරන්න
    name: "",
    email: "",
    contact: "",
    role: ""
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    
    if (storedUser && storedUser.Role === 'Admin') {
      setAdminData({
        id: storedUser.ID || storedUser.AdminID, // Login එකේදී එන ID එක
        name: storedUser.FullName,
        email: storedUser.Email || "", 
        contact: storedUser.ContactNumber || "",
        role: storedUser.Role
      });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // --- Profile එක Database එකේ Update කරන Function එක ---
  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      // Backend API එකට data යැවීම
      const response = await axios.put(`http://localhost:5000/api/admin/update-profile/${adminData.id}`, {
        name: adminData.name,
        email: adminData.email,
        contact: adminData.contact
      });

      if (response.data.success) {
        alert("Profile Updated Successfully!");
        
        // LocalStorage එකත් Update කරන්න (Refresh කළත් දත්ත පවතින්න)
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const updatedUser = { 
          ...storedUser, 
          FullName: adminData.name, 
          Email: adminData.email, 
          ContactNumber: adminData.contact 
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        setIsEditing(false);
      }
    } catch (error) {
      console.error("Update Error:", error);
      alert(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    setShowDropdown(false);
  };

  const getInitials = (name) => name ? name.charAt(0).toUpperCase() : "A";

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: DashboardIcon }, 
    { name: 'Student Registration', path: '/admin/students', icon: StudentIcon },
    { name: 'Facility & Event', path: '/admin/facility', icon: FacilityIcon },
    { name: 'Campus Clubs', path: '/admin/clubs', icon: ClubsIcon },
  ];

  return (
    <div className="sidebar-container">
      {/* Logo Section */}
      <div className="sidebar-logo-section">
        <img src={UnisphereLogo} alt="UniSphere Logo" className="sidebar-logo-image" />
        <h2 className="logo-text">UniSphere</h2>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-icon"><img src={item.icon} alt={item.name} className="sidebar-icon-image" /></span>
            <span className="nav-text">{item.name}</span>
          </div>
        ))}
      </nav>

      {/* User Profile Footer */}
      <div className="sidebar-footer" ref={dropdownRef}>
        <div className="user-profile-container" onClick={() => setShowDropdown(!showDropdown)}>
          <div className="user-initials-avatar">{getInitials(adminData.name)}</div>
          <div className="user-info">
            <span className="user-name">{adminData.name || "Admin"}</span>
            <span className="user-role">{adminData.role}</span>
          </div>
        </div>

        {showDropdown && (
          <div className="profile-dropdown">
            <div className="dropdown-item" onClick={() => { setIsProfileModalOpen(true); setShowDropdown(false); }}>
              <span className="dropdown-icon"><img src={ProfileIcon} alt="Profile" className="sidebar-icon-image" /></span>
              <span>Profile</span>
            </div>
            <div className="dropdown-item logout" onClick={handleLogout}>
              <span className="dropdown-icon"><img src={LogoutIcon} alt="Logout" className="sidebar-icon-image" /></span>
              <span>Logout</span>
            </div>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="modal-overlay" onClick={() => setIsProfileModalOpen(false)}>
          <div className="profile-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setIsProfileModalOpen(false)}>×</button>
            
            {!isEditing ? (
              <>
                <div className="modal-header">
                  <div className="large-initials-avatar">{getInitials(adminData.name)}</div>
                  <h2>{adminData.name}</h2>
                  <p>{adminData.role}</p>
                </div>
                <div className="modal-body">
                  <div className="info-item"><span>Email Address</span><p>{adminData.email || "Not Set"}</p></div>
                  <div className="info-item"><span>Contact Number</span><p>{adminData.contact || "+94 76 123 4567"}</p></div>
                </div>
                <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>Edit Profile Information</button>
              </>
            ) : (
              <div className="edit-form-container">
                <h2>Edit Profile</h2>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" className="form-input" value={adminData.name} onChange={(e) => setAdminData({...adminData, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" className="form-input" value={adminData.email} onChange={(e) => setAdminData({...adminData, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Contact Number</label>
                  <input type="text" className="form-input" value={adminData.contact} onChange={(e) => setAdminData({...adminData, contact: e.target.value})} />
                </div>
                <div className="form-actions">
                  <button className="save-btn" onClick={handleSaveChanges} disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;