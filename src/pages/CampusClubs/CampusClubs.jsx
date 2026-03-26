import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CampusClubs.css';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import bgImage from '../../assets/images/banner-bg.png'; 
import searchIcon from '../../assets/images/Search-icon.svg'; 

const CampusClubs = () => {
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [clubs, setClubs] = useState([]);
  
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const currentStudentName = storedUser?.name || "Test Student"; 

  const categories = ['All Categories', 'Academic', 'Arts', 'Sports', 'Social', 'Technology', 'Volunteering'];

  const fetchClubs = async () => {
    try {
      const clubsRes = await axios.get('http://localhost:5000/api/clubs/all');
      const userClubsRes = await axios.get(`http://localhost:5000/api/clubs/user-status/${currentStudentName}`);
      
      const statusData = userClubsRes.data || {}; 

      const formattedClubs = clubsRes.data.map(club => {
        // ඉතා වැදගත්: Club එකේ නම දෙපැත්තෙන්ම trim කරන්න (හිස් ඉඩ ඉවත් කිරීමට)
        const clubNameFromDB = (club.Name || club.ClubName || "").toString().trim();
        
        // Status map එකෙන් status එක ලබා ගන්න (අකුරු වල ලොකු කුඩා බව නොසලකා)
        const currentStatus = statusData[clubNameFromDB] ? statusData[clubNameFromDB].toLowerCase() : null;

        return {
          id: club.ClubID,
          name: clubNameFromDB,
          desc: club.Description,
          category: club.Category,
          image: club.ImagePath ? `http://localhost:5000/${club.ImagePath.replace(/\\/g, '/')}` : null,
          isJoined: currentStatus === 'approved', 
          isPending: currentStatus === 'pending'
        };
      });

      setClubs(formattedClubs);
    } catch (err) {
      console.error("Error fetching clubs:", err);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, [currentStudentName]); // ශිෂ්‍යයා වෙනස් වුවහොත් නැවත fetch කරන්න

  const handleJoin = async (club) => {
    try {
      await axios.post('http://localhost:5000/api/clubs/join', {
        studentName: currentStudentName, 
        clubName: club.name
      });

      setClubs(prevClubs => 
        prevClubs.map(c => 
          c.id === club.id ? { ...c, isPending: true } : c
        )
      );
      alert(`Join request sent to ${club.name}! Wait for Admin approval.`);
    } catch (err) {
      alert("Error joining club.");
    }
  };

  // Sections වලට වෙන් කිරීම
  const yourClubs = clubs.filter(club => club.isJoined);
  const pendingClubs = clubs.filter(club => club.isPending);
  
  const allOrganizations = clubs.filter(club => {
    const isAvailable = !club.isJoined && !club.isPending;
    const matchesCategory = activeCategory === 'All Categories' || club.category === activeCategory;
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase());
    return isAvailable && matchesCategory && matchesSearch;
  });

  return (
    <div className="clubs-container" style={{ backgroundImage: `url(${bgImage})` }}>
      <Header />
      <div className="clubs-overlay-content">
        <header className="clubs-header">
          <h1>Campus Clubs Connector</h1>
          <p>Discover organizations, join communities, and lead on campus.</p>
          
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
            <button className="discover-btn">Discover</button>
          </div>

          <div className="category-filters">
            {categories.map(cat => (
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

        {/* 1. Your Clubs Section (Approved) */}
        {!searchTerm && activeCategory === 'All Categories' && yourClubs.length > 0 && (
          <section className="clubs-section">
            <h2>Your Clubs</h2>
            <div className="clubs-grid">
              {yourClubs.map(club => (
                <div className="club-card" key={`your-${club.id}`}>
                  <div className="club-image" style={{ backgroundImage: club.image ? `url(${club.image})` : 'linear-gradient(45deg, #004e92, #000428)' }}> </div>
                  <div className="club-info">
                    <h3>{club.name}</h3>
                    <p>{club.desc}</p>
                    <button className="join-btn-disabled" disabled style={{ backgroundColor: '#28a745', color: '#fff', cursor: 'default' }}>Member</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 2. Pending Requests Section */}
        {!searchTerm && pendingClubs.length > 0 && (
          <section className="clubs-section">
            <h2 style={{ color: '#ffc107' }}>Pending Approval</h2>
            <div className="clubs-grid">
              {pendingClubs.map(club => (
                <div className="club-card" key={`pending-${club.id}`} style={{ opacity: 0.8 }}>
                  <div className="club-image" style={{ backgroundImage: club.image ? `url(${club.image})` : 'linear-gradient(45deg, #ddd, #999)' }}> </div>
                  <div className="club-info">
                    <h3>{club.name}</h3>
                    <p>{club.desc}</p>
                    <button className="join-btn-disabled" disabled style={{ backgroundColor: '#ffc107', color: '#000', cursor: 'default' }}>Waiting for Admin...</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. All Organizations Section */}
        <section className="clubs-section">
          <h2>{searchTerm ? `Search Results for "${searchTerm}"` : 'All Organizations'}</h2>
          <div className="clubs-grid">
            {allOrganizations.length > 0 ? (
              allOrganizations.map(club => (
                <div className="club-card" key={club.id}>
                  <div className="club-image" style={{ backgroundImage: club.image ? `url(${club.image})` : 'linear-gradient(45deg, #ddd, #999)' }}> </div>
                  <div className="club-info">
                    <h3>{club.name}</h3>
                    <p>{club.desc}</p>
                    <button className="join-btn-filled" onClick={() => handleJoin(club)}>
                      Join
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results">No new organizations found.</p>
            )}
          </div>
        </section>
      </div>
      <Footer/>
    </div>
  );
};

export default CampusClubs;