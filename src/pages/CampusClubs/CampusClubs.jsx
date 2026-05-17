import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CampusClubs.css';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import bgImage from '../../assets/images/banner-bg.png';
import searchIcon from '../../assets/images/Search-icon.svg';
import { markTaskVisited } from "../../utils/taskProgress";

const CampusClubs = () => {
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [clubs, setClubs] = useState([]);

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const currentStudentId = storedUser?.ID || null;

  const categories = [
    'All Categories',
    'Academic',
    'Arts',
    'Sports',
    'Social',
    'Technology',
    'Volunteering',
  ];

  const fetchClubs = async () => {
    try {
      const clubsRes = await axios.get('http://localhost:5000/api/clubs/all');

      let statusData = {};

      if (currentStudentId) {
        const statusRes = await axios.get(
          `http://localhost:5000/api/clubs/user-status/${currentStudentId}`
        );
        statusData = statusRes.data || {};
      }

      const formatted = clubsRes.data.map((club) => {
        const name = (club.Name || '').trim();
        const status = statusData[name]?.toLowerCase();

        return {
          id: club.ClubID,
          name,
          desc: club.Description || 'No description available.',
          category: (club.Category || 'Other').trim(),
          image: club.ImagePath
            ? `http://localhost:5000/${club.ImagePath.replace(/\\/g, '/')}`
            : null,
          isJoined: status === 'approved',
          isPending: status === 'pending',
        };
      });

      setClubs(formatted);
    } catch (err) {
      console.error('Fetch clubs error:', err);
    }
  };

  useEffect(() => {
    markTaskVisited("explore_campus_clubs");
  }, []);

  useEffect(() => {
    fetchClubs();
  }, [currentStudentId]);

  const handleJoin = async (club) => {
    if (!currentStudentId) {
      alert('Please login first!');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/clubs/join', {
        studentId: currentStudentId,
        clubId: club.id,
      });

      alert(`Request sent to ${club.name}`);
      fetchClubs();
    } catch (err) {
      alert(err.response?.data?.error || 'Join failed');
    }
  };

  const yourClubs = clubs.filter((c) => c.isJoined);
  const pendingClubs = clubs.filter((c) => c.isPending);

  const availableClubs = clubs.filter((c) => {
    const isNew = !c.isJoined && !c.isPending;
    const matchesCategory =
      activeCategory === 'All Categories' ||
      c.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());

    return isNew && matchesCategory && matchesSearch;
  });

  return (
    <div
      className="clubs-container"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Header />

      <div className="clubs-overlay-content">
        <header className="clubs-header">
          <h1>Campus Clubs Connector</h1>

          <div className="search-section">
            <div className="search-input-wrapper">
              <img src={searchIcon} alt="search" className="search-icon-img" />
              <input
                type="text"
                placeholder="Search for clubs, interests, or hobbies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              className="discover-btn"
              onClick={() => setSearchTerm('')}
            >
              Discover
            </button>
          </div>

          <div className="category-filters">
            {categories.map((cat) => (
              <button
                key={cat}
                className={activeCategory === cat ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {yourClubs.length > 0 &&
          activeCategory === 'All Categories' &&
          !searchTerm && (
            <section className="clubs-section">
              <h2>Your Clubs</h2>
              <div className="clubs-grid">
                {yourClubs.map((club) => (
                  <div className="club-card" key={club.id}>
                    {club.image && (
                      <img src={club.image} alt={club.name} className="club-image" />
                    )}

                    <div className="club-info">
                      <h3>{club.name}</h3>
                      <button className="btn-member">Member</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        {pendingClubs.length > 0 &&
          activeCategory === 'All Categories' &&
          !searchTerm && (
            <section className="clubs-section">
              <h2>Requested Clubs</h2>
              <div className="clubs-grid">
                {pendingClubs.map((club) => (
                  <div className="club-card" key={club.id}>
                    {club.image && (
                      <img src={club.image} alt={club.name} className="club-image" />
                    )}

                    <div className="club-info">
                      <h3>{club.name}</h3>
                      <button className="btn-pending">Pending</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        <section className="clubs-section">
          <h2>All Organizations</h2>

          <div className="clubs-grid">
            {availableClubs.length > 0 ? (
              availableClubs.map((club) => (
                <div className="club-card" key={club.id}>
                  {club.image && (
                    <img src={club.image} alt={club.name} className="club-image" />
                  )}

                  <div className="club-info">
                    <h3>{club.name}</h3>
                    <p>{club.desc}</p>

                    <button
                      className="btn-join"
                      onClick={() => handleJoin(club)}
                    >
                      Join Club
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results">No clubs found.</p>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default CampusClubs;