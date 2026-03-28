import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import './EventAndFacilities.css';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import bgImage from '../../assets/images/banner-bg.png'; 

// Assets
import bannerImg from '../../assets/images/event-hero-banner.svg';
import CafeteriaIcon from '../../assets/images/Cafeteria.svg'; 
import GymIcon from '../../assets/images/Gym.svg';
import ClinicIcon from '../../assets/images/HealthClinic.svg';
import LibraryIcon from '../../assets/images/Library.svg';
import StadiumIcon from '../../assets/images/Stadium.svg';

import EventHallImg from '../../assets/images/EventHall.svg';
import StudentLoungesImg from '../../assets/images/StudentLounges.svg';
import FitnessCentersImg from '../../assets/images/FitnessCenters.svg';
import InnovationLabsImg from '../../assets/images/InnovationLabs.svg';
import StudyZonesImg from '../../assets/images/StudyZones.svg';
import MainCampusImg from '../../assets/images/MainCampus.svg';

import cafeModalImg from '../../assets/images/cafe-modal.svg';
import gymModalImg from '../../assets/images/gym-modal.svg';
import clinicModalImg from '../../assets/images/clinic-modal.svg';
import libraryModalImg from '../../assets/images/library-modal.svg';
import stadiumModalImg from '../../assets/images/stadium-modal.svg';

const EventAndFacilities = () => {
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [events, setEvents] = useState([]);

  // 1. Backend එකෙන් Events ලබා ගැනීම
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events/get-all');
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const facilities = [
    { 
      id: 1, name: 'Cafeteria', icon: CafeteriaIcon, modalImg: cafeModalImg, 
      desc: 'Our main dining hall offering a wide variety of fresh, healthy meals, including vegetarian and vegan options.',
      contact: '(555) 123-4567', tags: ['Free Wi-Fi', 'Vegan Options', 'Charging Ports']
    },
    { 
      id: 2, name: 'GYM', icon: GymIcon, modalImg: gymModalImg,
      desc: 'A state-of-the-art facility featuring cardio machines, free weights, and dedicated studios.',
      contact: '(555) 987-6543', tags: ['Showers Available', 'Locker Rooms', 'Towel Service']
    },
    { 
      id: 3, name: 'Health Clinic', icon: ClinicIcon, modalImg: clinicModalImg,
      desc: 'Providing comprehensive medical services to students and staff.',
      contact: '(555) 789-4321', tags: ['Primary Care', 'Mental Health', 'Lab Services']
    },
    { 
      id: 4, name: 'Main Library', icon: LibraryIcon, modalImg: libraryModalImg,
      desc: 'Our expansive library offers a quiet environment for study and digital resources.',
      contact: '(555) 321-7890', tags: ['Printing Services', 'Private Study Rooms', 'High-Speed Wi-Fi']
    },
    { 
      id: 5, name: 'The Stadium', icon: StadiumIcon, modalImg: stadiumModalImg,
      desc: 'Home to our varsity teams, hosting athletic competitions and major campus events.',
      contact: '(555) 456-1234', tags: ['Wheelchair Accessible', 'Concessions', 'Digital Scoreboard']
    },
  ];

  const spaces = [
    { id: 1, name: 'Main Campus', desc: 'The heart of our academic community.', image: MainCampusImg },
    { id: 2, name: 'Study Zones', desc: 'Quiet zones designed for deep focus.', image: StudyZonesImg },
    { id: 3, name: 'Innovation Labs', desc: 'Facilities for creative projects and robotics.', image: InnovationLabsImg },
    { id: 4, name: 'Fitness Centers', desc: 'Modern equipment for wellness programs.', image: FitnessCentersImg },
    { id: 5, name: 'Student Lounges', desc: 'Comfortable spaces to relax and socialize.', image: StudentLoungesImg },
    { id: 6, name: 'Event Hall', desc: 'Host to ceremonies and guest lectures.', image: EventHallImg },
  ];

  return (
    <div className="event-facilities-page" style={{ backgroundImage: `url(${bgImage})` }}>
      <Header />
      
      <main className="ef-container">
        {/* Banner Section */}
        <section className="ef-banner" style={{ "--banner-img": `url(${bannerImg})` }}>
          <div className="ef-banner-content">
            <h1>Facility & Event Updates</h1>
            <p>Stay informed about campus transformations and upcoming activities.</p>
          </div>
        </section>

        {/* Facilities Section */}
        <section className="ef-section">
          <h3>Campus Facilities</h3>
          <div className="facilities-scroll">
            {facilities.map(f => (
              <div key={f.id} className="ef-facility-card" onClick={() => setSelectedFacility(f)} style={{cursor: 'pointer'}}>
                <div className="ef-icon-container">
                  <img src={f.icon} alt={f.name} className="ef-facility-icon" />
                </div>
                <p>{f.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Events Section - (FIXED) */}
        <section className="ef-section">
          <div className="ef-section-header">
            <h3>Upcoming Events</h3>
            <span className="ef-view-more">Latest Updates</span>
          </div>
          <div className="ef-events-list">
            {events && events.length > 0 ? (
              events.map(e => {
                // Timezone offset එක මගහරවා ගැනීමට UTC අගයන් භාවිතා කරයි
                const eventDate = e.EventDate ? new Date(e.EventDate) : new Date();
                const day = String(eventDate.getUTCDate()).padStart(2, '0');
                const month = eventDate.toLocaleString('default', { month: 'short', timeZone: 'UTC' }).toUpperCase();

                return (
                  <div key={e.EventID} className="ef-event-card">
                    <div className="ef-event-date">
                      <span className="ef-date-num">{day}</span>
                      <span className="ef-date-month">{month}</span>
                    </div>
                    <div className="ef-event-details">
                      <div className="ef-meta">
                        <span className={`ef-tag ${(e.Category || "general").toLowerCase()}`}>
                          {e.Category || "GENERAL"}
                        </span>
                        {/* Backend එකෙන් format වී එන වෙලාව මෙහිදී පෙන්වයි */}
                        <span className="ef-time">• {e.EventTime}</span>
                      </div>
                      <h4>{e.EventTitle}</h4>
                      <p>{e.Location}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-events-container">
                <p style={{ color: 'white', textAlign: 'center', width: '100%', padding: '20px' }}>
                  No upcoming events scheduled yet.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Campus Spaces Section */}
        <section className="ef-section">
          <h3>Campus Spaces</h3>
          <div className="ef-spaces-grid">
            {spaces.map(s => (
              <div key={s.id} className="ef-space-card">
                <div className="ef-space-img-container">
                  <img src={s.image} alt={s.name} />
                </div>
                <div className="ef-space-info">
                  <h4>{s.name}</h4>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Facility Details Modal */}
      {selectedFacility && (
        <div className="ef-modal-overlay" onClick={() => setSelectedFacility(null)}>
          <div className="ef-modal-card" onClick={e => e.stopPropagation()}>
            <div className="ef-modal-banner">
              <img src={selectedFacility.modalImg} alt={selectedFacility.name} />
              <button className="ef-close-btn" onClick={() => setSelectedFacility(null)}>&times;</button>
            </div>
            <div className="ef-modal-body">
              <h2>{selectedFacility.name}</h2>
              <p className="ef-modal-desc">{selectedFacility.desc}</p>
              <div className="ef-modal-contact">
                <span className="contact-label">CONTACT INFO</span>
                <p>{selectedFacility.contact}</p>
              </div>
              <div className="ef-modal-amenities">
                <span className="contact-label">AVAILABLE AMENITIES</span>
                <div className="ef-modal-tags">
                  {selectedFacility.tags.map(tag => (
                    <span key={tag} className="ef-tag-pill">• {tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default EventAndFacilities;