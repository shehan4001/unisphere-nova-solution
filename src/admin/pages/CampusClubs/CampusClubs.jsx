import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './CampusClubs.css';
import axios from 'axios';

import bgImage from '../../../assets/images/banner-bg.png';

const CampusClubs = () => {
  const [requests, setRequests] = useState([]);
  const [allClubs, setAllClubs] = useState([]); 
  const [clubData, setClubData] = useState({ name: '', category: 'Academic', description: '', image: null });
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(null); 
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.name) {
      setAdminName(storedUser.name);
    }
    fetchRequests();
    fetchClubs();
  }, []);

  // 1. Pending Requests ලබා ගැනීම
  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/clubs/requests/pending');
      console.log("Pending Requests Data:", res.data); // Debug කිරීමට
      setRequests(res.data);
    } catch (err) { 
      console.error("Error fetching requests:", err); 
    }
  };

  // 2. සියලුම Clubs ලබා ගැනීම
  const fetchClubs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/clubs/all');
      setAllClubs(res.data);
    } catch (err) { 
      console.error("Error fetching clubs:", err); 
    }
  };

  // 3. Create හෝ Update කිරීම
  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', clubData.name);
    formData.append('category', clubData.category);
    formData.append('description', clubData.description);
    if (clubData.image) formData.append('image', clubData.image);

    try {
      if (editMode) {
        await axios.put(`http://localhost:5000/api/clubs/edit/${editMode}`, formData);
        alert("Club Updated Successfully!");
      } else {
        await axios.post('http://localhost:5000/api/clubs/create', formData);
        alert("Club Created Successfully!");
      }
      resetForm();
      fetchClubs();
    } catch (err) { 
      alert("Action failed!"); 
    }
  };

  // 4. Delete කිරීම
  const handleDeleteClub = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`http://localhost:5000/api/clubs/delete/${id}`);
        setAllClubs(allClubs.filter(c => c.ClubID !== id));
        alert("Club Deleted!");
      } catch (err) { alert("Delete failed!"); }
    }
  };

  // 5. Approve/Reject කිරීම (CRITICAL FIX)
  const handleAction = async (requestId, actionType) => {
    try {
      // User පැත්තේ 'isJoined' එක වැඩ කරන්නේ status එක 'approved' වුණොත් විතරයි
      const statusValue = actionType === 'accept' ? 'approved' : 'rejected';
      
      await axios.put(`http://localhost:5000/api/clubs/requests/${requestId}`, { 
        status: statusValue 
      });

      // ලිස්ට් එකෙන් අයින් කිරීම
      setRequests(prev => prev.filter(req => req._id !== requestId));
      alert(`Request ${statusValue.toUpperCase()} successfully!`);
      
    } catch (err) { 
      console.error(err);
      alert("Action failed!"); 
    }
  };

  const startEdit = (club) => {
    setEditMode(club.ClubID);
    setClubData({ name: club.Name, category: club.Category, description: club.Description, image: null });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const resetForm = () => {
    setClubData({ name: '', category: 'Academic', description: '', image: null });
    setShowForm(false);
    setEditMode(null);
  };

  return (
    <div className="admin-layout-wrapper">
      <Sidebar userName={adminName} />
      
      <div className="admin-page-content" style={{ '--bg-image': `url(${bgImage})` }}>
        <header className="page-header-simple">
          <div>
            <h1>Campus Clubs Management</h1>
            <p style={{ color: '#ccc' }}>Welcome, {adminName}!</p>
          </div>
          <button className="btn-add-club" onClick={() => showForm ? resetForm() : setShowForm(true)}>
            {showForm ? "Cancel" : "+ Create New Club"}
          </button>
        </header>

        {showForm && (
          <section className="update-form-section animate-fade">
            <h3 className="section-title">{editMode ? "📝 Edit Club" : "🆕 New Club"}</h3>
            <form onSubmit={handleCreateOrUpdate}>
               <div className="form-row">
                 <div className="form-group title-input">
                   <label>Club Name</label>
                   <input type="text" value={clubData.name} onChange={(e)=>setClubData({...clubData, name: e.target.value})} required />
                 </div>
                 <div className="form-group">
                   <label>Category</label>
                   <select className="filter-dropdown" value={clubData.category} onChange={(e)=>setClubData({...clubData, category: e.target.value})}>
                     <option value="Academic">Academic</option>
                     <option value="Sports">Sports</option>
                     <option value="Arts">Arts</option>
                     <option value="Social">Social</option>
                     <option value="Technology">Technology</option>
                     <option value="Volunteering">Volunteering</option>
                   </select>
                 </div>
               </div>
               <div className="form-group">
                 <label>Description</label>
                 <textarea value={clubData.description} onChange={(e)=>setClubData({...clubData, description: e.target.value})} required />
               </div>
               <div className="form-group">
                 <label>Club Image</label>
                 <input type="file" onChange={(e)=>setClubData({...clubData, image: e.target.files[0]})} />
               </div>
               <div className="form-actions">
                 <button type="submit" className="publish-btn">{editMode ? "Save" : "Publish"}</button>
               </div>
            </form>
          </section>
        )}

        {/* 1. Pending Requests Table */}
        <section className="requests-section">
          <h3 className="section-title">📬 Pending Join Requests</h3>
          <div className="requests-table-container">
            <table className="requests-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Club Requested</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.length > 0 ? requests.map(req => (
                  <tr key={req._id}>
                    {/* Backend එකේ එවන්නේ StudentName සහ ClubName ලෙසයි */}
                    <td>{req.StudentName || "Unknown Student"}</td>
                    <td><span className="club-tag">{req.ClubName || "Unknown Club"}</span></td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-approve" onClick={() => handleAction(req._id, 'accept')}>Approve</button>
                        <button className="btn-reject" onClick={() => handleAction(req._id, 'reject')}>Reject</button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="3" style={{textAlign:'center', padding: '30px'}}>No pending requests.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* 2. Published Clubs Table */}
        <section className="requests-section" style={{ marginTop: '40px' }}>
          <h3 className="section-title">🏛️ Published Clubs</h3>
          <div className="requests-table-container">
            <table className="requests-table">
              <thead>
                <tr><th>Club Name</th><th>Category</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {allClubs.map(club => (
                  <tr key={club.ClubID}>
                    <td><strong>{club.Name}</strong></td>
                    <td>{club.Category}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-edit" onClick={() => startEdit(club)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDeleteClub(club.ClubID)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CampusClubs;