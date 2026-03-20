import React, { useState } from 'react';
import './CampusClubs.css';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import bgImage from '../../assets/images/banner-bg.png'; 
import searchIcon from '../../assets/images/Search-icon.svg'; 

import Debate from '../../assets/images/Debate.svg';
import Entrepreneurship from '../../assets/images/Enterpreneurship.svg';
import Science from '../../assets/images/Science.svg';
import Mathematics from '../../assets/images/Mathematics.svg';
import Music from '../../assets/images/Music.svg';
import Photography from '../../assets/images/Photography.svg';
import Drama from '../../assets/images/Drama.svg';
import Football from '../../assets/images/Football.svg';
import Cricket from '../../assets/images/Cricket.svg';

const CampusClubs = () => {
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [searchTerm, setSearchTerm] = useState('');

  const [clubs, setClubs] = useState([
  { 
    id: 1, 
    name: 'Debate & Speaking Club', 
    desc: 'Enhances critical thinking and confident communication through debates and speeches.', 
    category: 'Academic', 
    image: Debate, 
    isJoined: false 
  },
  { 
    id: 2, 
    name: 'Entrepreneurship Club', 
    desc: 'Develop startup ideas, leadership skills, and real-world business knowledge.', 
    category: 'Academic', 
    image: Entrepreneurship, 
    isJoined: false 
  },
  { 
    id: 3, 
    name: 'Science Research Society', 
    desc: 'Encourages innovation and hands-on scientific exploration.', 
    category: 'Technology', 
    image: Science, 
    isJoined: false 
  },
  { 
    id: 4, 
    name: 'Mathematics Club', 
    desc: 'Explores problem-solving techniques and analytical thinking.', 
    category: 'Academic', 
    image: Mathematics, 
    isJoined: false 
  },
  { 
    id: 5, 
    name: 'Music Club', 
    desc: 'Encourages singing, instrument playing, and live performances.', 
    category: 'Arts', 
    image: Music, 
    isJoined: false 
  },
  { 
    id: 6, 
    name: 'Photography Club', 
    desc: 'Focuses on creative photography and visual storytelling.', 
    category: 'Arts', 
    image: Photography, 
    isJoined: false 
  },
  { 
    id: 7, 
    name: 'Drama & Theatre Club', 
    desc: 'Organizes stage performances and acting workshops.', 
    category: 'Arts', 
    image: Drama, 
    isJoined: false 
  },
  { 
    id: 8, 
    name: 'Football Club', 
    desc: 'Trains and competes in football tournaments and leagues.', 
    category: 'Sports', 
    image: Football, 
    isJoined: false 
  },
  { 
    id: 9, 
    name: 'Cricket Club', 
    desc: 'Promotes cricket training and inter-university matches.', 
    category: 'Sports', 
    image: Cricket, 
    isJoined: false 
  }
]);

  const categories = ['All Categories', 'Academic', 'Arts', 'Sports', 'Social', 'Technology', 'Volunteering'];


  const handleJoin = (id) => {
    setClubs(prevClubs => 
      prevClubs.map(club => 
        club.id === id && !club.isJoined ? { ...club, isJoined: true } : club
      )
    );
  };

  const yourClubs = clubs.filter(club => club.isJoined);

  const allOrganizations = clubs.filter(club => {
    const isNotJoined = !club.isJoined;
    const matchesCategory = activeCategory === 'All Categories' || club.category === activeCategory;
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase());
    return isNotJoined && matchesCategory && matchesSearch;
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

        {!searchTerm && activeCategory === 'All Categories' && yourClubs.length > 0 && (
          <section className="clubs-section">
            <h2>Your Clubs</h2>
            <div className="clubs-grid">
              {yourClubs.map(club => (
                <div className="club-card" key={`your-${club.id}`}>
                  <div className="club-image" style={{ backgroundImage: `url(${club.image})` }}> </div>
                  <div className="club-info">
                    <h3>{club.name}</h3>
                    <p>{club.desc}</p>
                    <button className="join-btn-disabled" disabled>
                      Joined
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="clubs-section">
          <h2>{searchTerm ? `Search Results for "${searchTerm}"` : 'All Organizations'}</h2>
          <div className="clubs-grid">
            {allOrganizations.length > 0 ? (
              allOrganizations.map(club => (
                <div className="club-card" key={club.id}>
                  <div className="club-image" style={{ backgroundImage: `url(${club.image})` }}> </div>
                  <div className="club-info">
                    <h3>{club.name}</h3>
                    <p>{club.desc}</p>
                    <button className="join-btn-filled" onClick={() => handleJoin(club.id)}>
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