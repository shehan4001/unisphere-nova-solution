import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './CampusClubs.css';
import axios from 'axios';
import bgImage from '../../../assets/images/banner-bg.png';

const CampusClubs = () => {
  const [requests, setRequests] = useState([]);
  const [allClubs, setAllClubs] = useState([]);

  const [clubData, setClubData] = useState({
    name: '',
    category: 'Academic',
    description: '',
    image: null,
  });

  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [adminName, setAdminName] = useState('Admin');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser?.FullName) {
      setAdminName(storedUser.FullName);
    }

    fetchRequests();
    fetchClubs();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/clubs/requests/pending');
      setRequests(res.data);
    } catch (err) {
      console.error('Requests error:', err);
    }
  };

  const fetchClubs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/clubs/all');
      setAllClubs(res.data);
    } catch (err) {
      console.error('Clubs error:', err);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem('user'));

    const formData = new FormData();
    formData.append('name', clubData.name.trim());
    formData.append('category', clubData.category);
    formData.append('description', clubData.description.trim());
    formData.append('adminId', storedUser?.ID || 1);

    if (clubData.image) {
      formData.append('image', clubData.image);
    }

    try {
      if (editMode) {
        await axios.put(
          `http://localhost:5000/api/clubs/edit/${editMode}`,
          formData
        );
        alert('Club updated!');
      } else {
        await axios.post(
          'http://localhost:5000/api/clubs/create',
          formData
        );
        alert('Club created!');
      }

      resetForm();
      fetchClubs();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Action failed');
    }
  };

  const handleDeleteClub = async (id) => {
    if (!window.confirm('Delete this club?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/clubs/delete/${id}`);
      setAllClubs((prev) => prev.filter((c) => c.ClubID !== id));
      alert('Deleted!');
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  const handleAction = async (requestId, type) => {
    try {
      const status = type === 'accept' ? 'approved' : 'rejected';

      await axios.put(
        `http://localhost:5000/api/clubs/requests/${requestId}`,
        { status }
      );

      fetchRequests();
      alert(`Request ${status}!`);
    } catch (err) {
      console.error(err);
      alert('Action failed');
    }
  };

  const startEdit = (club) => {
    setEditMode(club.ClubID);

    setClubData({
      name: club.Name,
      category: club.Category,
      description: club.Description,
      image: null,
    });

    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setClubData({
      name: '',
      category: 'Academic',
      description: '',
      image: null,
    });

    setShowForm(false);
    setEditMode(null);
  };

  return (
    <div className="admin-layout-wrapper">
      <Sidebar userName={adminName} />

      <div
        className="admin-page-content"
        style={{ '--bg-image': `url(${bgImage})` }}
      >
        <header className="page-header-simple">
          <div>
            <h1>Campus Clubs Management</h1>
          </div>

          <button
            className="btn-add-club"
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
          >
            {showForm ? 'Cancel' : '+ Create Club'}
          </button>
        </header>

        {showForm && (
          <section className="update-form-section animate-fade">
            <h3 className="section-title">
              {editMode ? 'Edit Club' : 'New Club'}
            </h3>

            <form onSubmit={handleCreateOrUpdate}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={clubData.name}
                    onChange={(e) =>
                      setClubData({ ...clubData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={clubData.category}
                    onChange={(e) =>
                      setClubData({ ...clubData, category: e.target.value })
                    }
                  >
                    <option>Academic</option>
                    <option>Sports</option>
                    <option>Arts</option>
                    <option>Social</option>
                    <option>Technology</option>
                    <option>Volunteering</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={clubData.description}
                  onChange={(e) =>
                    setClubData({ ...clubData, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Image</label>
                <input
                  type="file"
                  onChange={(e) =>
                    setClubData({ ...clubData, image: e.target.files[0] })
                  }
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="publish-btn">
                  {editMode ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="requests-section">
          <h3 className="section-title">Pending Requests</h3>

          <table className="requests-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Club</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {requests.length > 0 ? (
                requests.map((req) => (
                  <tr key={req._id}>
                    <td>{req.StudentName}</td>
                    <td>{req.ClubName}</td>
                    <td>
                      <div className="action-btns">
                        <button
                          className="btn-approve"
                          onClick={() => handleAction(req._id, 'accept')}
                        >
                          Approve
                        </button>

                        <button
                          className="btn-reject"
                          onClick={() => handleAction(req._id, 'reject')}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No pending requests</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <section className="requests-section" style={{ marginTop: '40px' }}>
          <h3 className="section-title">All Clubs</h3>

          <table className="requests-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {allClubs.length > 0 ? (
                allClubs.map((club) => (
                  <tr key={club.ClubID}>
                    <td>{club.Name}</td>
                    <td>{club.Category}</td>
                    <td>{club.Description}</td>
                    <td>
                      <div className="action-btns">
                        <button
                          className="btn-edit"
                          onClick={() => startEdit(club)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteClub(club.ClubID)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No clubs found</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default CampusClubs;