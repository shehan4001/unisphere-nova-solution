import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './EventAndFacilities.css';
import bannerBg from '../../../assets/images/banner-bg.png';

const EventAndFacilities = () => {
  const [events, setEvents] = useState([]);

  // State කළමනාකරණය
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(''); // Sorting සඳහා වේලාව වෙනම ලබා ගැනීම
  const [newEvent, setNewEvent] = useState({ title: '', category: 'ACADEMIC', location: '' });

  const handleAddEvent = (e) => {
    e.preventDefault();
    
    // 1. ප්‍රදර්ශනය සඳහා දිනය Format කිරීම (e.g. "MAR 22")
    const dateObj = new Date(selectedDate);
    const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
    const day = dateObj.getDate();
    const formattedDate = `${month} ${day}`;

    // 2. Sorting සඳහා භාවිතා කිරීමට සම්පූර්ණ Date Object එකක් සාදා ගැනීම
    const fullDateTime = new Date(`${selectedDate}T${selectedTime}`);

    // 3. වේලාව 12-hour format (e.g. 4:00 PM) එකට හැරවීම
    const formattedTime = fullDateTime.toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });

    const entry = { 
      ...newEvent, 
      id: Date.now(), 
      date: formattedDate, 
      time: formattedTime,
      sortKey: fullDateTime // Sorting සඳහා පාවිච්චි කරන key එක
    };

    // 4. අලුත් Event එක එකතු කර දිනය/වේලාව අනුව Sort කිරීම (ළඟම දින මුලට)
    const updatedEvents = [...events, entry].sort((a, b) => a.sortKey - b.sortKey);
    
    setEvents(updatedEvents);
    
    // Reset Form
    setSelectedDate('');
    setSelectedTime('');
    setNewEvent({ title: '', category: 'ACADEMIC', location: '' });
  };

  return (
    <div className="admin-layout-wrapper">
      <Sidebar />
      <div className="admin-page-content" style={{ '--bg-image': `url(${bannerBg})` }}>
        <header className="page-header-simple">
          <div className="welcome-text">
            <h1>Facility & Event Management</h1>
          </div>
        </header>

        <div className="events-admin-container">
          <section className="update-form-section animate-fade">
            <h3 className="section-title"><span></span> Create New Event</h3>
            <form onSubmit={handleAddEvent}>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Select Date</label>
                  <input 
                    type="date" 
                    className="calendar-input"
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Select Time</label>
                  <input 
                    type="time" 
                    className="calendar-input"
                    value={selectedTime} 
                    onChange={(e) => setSelectedTime(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Event Title</label>
                <input type="text" value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} placeholder="Enter event name..." required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select className="filter-dropdown" value={newEvent.category} onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}>
                    <option value="Academic">Academic</option>
                    <option value="Professional">Professional</option>
                    <option value="Social">Social</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input type="text" value={newEvent.location} onChange={(e) => setNewEvent({...newEvent, location: e.target.value})} placeholder="Innovation Hall" required />
                </div>
              </div>

              <button type="submit" className="btn-add-club">Publish Event</button>
            </form>
          </section>

          {/* Live Preview List */}
          <section className="requests-section">
            <h3 className="section-title">Live Preview</h3>
            <div className="event-list-preview">
              {events.map(event => (
                <div key={event.id} className="admin-event-card-wrapper">
                  <div className="event-card-main">
                    <div className="event-date-box">
                      <span className="month">{event.date.split(' ')[0]}</span>
                      <span className="day">{event.date.split(' ')[1]}</span>
                    </div>
                    <div className="event-info-content">
                      <div className="meta-info">
                        <span className={`cat-tag ${event.category.toLowerCase()}`}>{event.category}</span>
                        <span className="time-loc-text">• {event.time}</span>
                      </div>
                      <h4>{event.title}</h4>
                      <p className="loc-sub">{event.location}</p>
                    </div>
                  </div>
                  <button className="btn-reject" onClick={() => setEvents(events.filter(e => e.id !== event.id))}>Remove</button>
                </div>
              ))}
              {events.length === 0 && <p className="scheduled">No events scheduled yet.</p>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default EventAndFacilities;