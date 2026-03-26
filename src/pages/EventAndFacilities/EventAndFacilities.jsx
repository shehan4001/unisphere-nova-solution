import React, { useState } from 'react'; 
import './EventAndFacilities.css';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import bgImage from '../../assets/images/banner-bg.png'; 

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

  const facilities = [
    { 
      id: 1, 
      name: 'Cafeteria', 
      icon: CafeteriaIcon,
      modalImg: cafeModalImg, 
      desc: 'Our main dining hall offering a wide variety of fresh, healthy meals, including vegetarian and vegan options. A great place to study or catch up with friends.',
      contact: '(555) 123-4567',
      tags: ['Free Wi-Fi', 'Vegan Options', 'Charging Ports']
    },
    { 
      id: 2, 
      name: 'GYM', 
      icon: GymIcon,
      modalImg: gymModalImg,
      desc: 'A state-of-the-art facility featuring cardio machines, free weights, and dedicated studios for yoga and cycling.',
      contact: '(555) 987-6543',
      tags: ['Showers Available', 'Locker Rooms', 'Towel Service']
    },
    { 
      id: 3, 
      name: 'Health Clinic', 
      icon: ClinicIcon,
      modalImg: clinicModalImg,
      desc: 'Providing comprehensive medical services to students and staff, including primary care and wellness consultations.',
      contact: '(555) 789-4321',
      tags: ['Primary Care', 'Mental Health', 'Lab Services']
    },
    { 
      id: 4, 
      name: 'Main Library', 
      icon: LibraryIcon,
      modalImg: libraryModalImg,
      desc: 'Our expansive library offers a quiet environment for study, access to thousands of digital and print resources.',
      contact: '(555) 321-7890',
      tags: ['Printing Services', 'Private Study Rooms', 'High-Speed Wi-Fi']
    },
    { 
      id: 5, 
      name: 'The Stadium', 
      icon: StadiumIcon,
      modalImg: stadiumModalImg,
      desc: 'Home to our varsity teams, the stadium hosts athletic competitions and major campus events.',
      contact: '(555) 456-1234',
      tags: ['Wheelchair Accessible', 'Concessions', 'Digital Scoreboard']
    },
  ];

  const events = [
    { 
      id: 1, 
      day: 'MAY 24', 
      type: 'ACADEMIC', 
      time: '4:00 PM', 
      title: 'Distinguished Guest Speaker Series', 
      location: 'Innovation Hall, Room 202. RSVP required.' 
    },
    { 
      id: 2, 
      day: 'OCT 26', 
      type: 'PROFESSIONAL', 
      time: '10:00 AM', 
      title: 'Fall Semester Career Fair', 
      location: 'Student Union Ballroom. Bring your resumes!' 
    },
  ];

  const spaces = [
    { 
      id: 1, 
      name: 'Main Campus', 
      desc: 'The heart of our academic community, blending historic architecture with vibrant green spaces.', 
      image: MainCampusImg 
    },
    { 
      id: 2, 
      name: 'Study Zones', 
      desc: 'Quiet zones designed for deep focus and collaborative learning across all campus wings.', 
      image: StudyZonesImg 
    },
    { 
      id: 3, 
      name: 'Innovation Labs', 
      desc: 'State-of-the-art facilities for creative projects, robotics, and cross-disciplinary research.', 
      image: InnovationLabsImg 
    },
    { 
      id: 4, 
      name: 'Fitness Centers', 
      desc: 'Modern equipment and studio spaces dedicated to student health and wellness programs.', 
      image: FitnessCentersImg 
    },
    { 
      id: 5, 
      name: 'Student Lounges', 
      desc: 'Comfortable spaces designed to relax, socialize, and connect with fellow students.', 
      image: StudentLoungesImg 
    },
    { 
      id: 6, name: 'Event Hall', 
      desc: 'Host to our grandest ceremonies, guest lectures, and student-led performances.', 
      image: EventHallImg 
    },
  ];

  return (
    <div className="event-facilities-page" style={{ backgroundImage: `url(${bgImage})` }}>
      <Header />
      
      <main className="ef-container">
        
        <section className="ef-banner" style={{ "--banner-img": `url(${bannerImg})` }}>
          <div className="ef-banner-content">
            <h1>Facility & Event Updates</h1>
            <p>Stay informed about campus transformations, scheduled maintenance, and upcoming activities in our growing ecosystem.</p>
          </div>
        </section>

        
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

        
        <section className="ef-section">
          <div className="ef-section-header">
            <h3>Upcoming Events</h3>
            <span className="ef-view-more">Next 7 days</span>
          </div>
          <div className="ef-events-list">
            {events.map(e => (
              <div key={e.id} className="ef-event-card">
                <div className="ef-event-date">
                  <span className="ef-date-num">{e.day.split(' ')[1]}</span>
                  <span className="ef-date-month">{e.day.split(' ')[0]}</span>
                </div>
                <div className="ef-event-details">
                  <div className="ef-meta">
                    <span className="ef-tag">{e.type}</span>
                    <span className="ef-time">• {e.time}</span>
                  </div>
                  <h4>{e.title}</h4>
                  <p>{e.location}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

       
        <section className="ef-section">
          <h3>Campus Spaces</h3>
          <p className="ef-sub-desc">Explore the heart of UniSphere where student life happens every day.</p>
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