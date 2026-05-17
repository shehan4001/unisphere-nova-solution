import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './EventAndFacilities.css';
import bannerBg from '../../../assets/images/banner-bg.png';
import axios from 'axios';

const EventAndFacilities = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'Academic',
    location: '',
  });

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/events/get-all');
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem('user'));

    const eventData = {
      title: newEvent.title,
      date: selectedDate,
      time: selectedTime,
      category: newEvent.category,
      location: newEvent.location,
      adminId: storedUser?.ID || 1,
    };

    try {
      await axios.post('http://localhost:5000/api/events/add', eventData);
      alert('Event Published Successfully!');

      setSelectedDate('');
      setSelectedTime('');
      setNewEvent({
        title: '',
        category: 'Academic',
        location: '',
      });

      fetchEvents();
    } catch (err) {
      console.error('Error adding event:', err);
      alert('Failed to publish event.');
    }
  };

  const handleRemove = async (id) => {
    if (window.confirm('Are you sure you want to remove this event?')) {
      try {
        await axios.delete(`http://localhost:5000/api/events/delete/${id}`);
        fetchEvents();
      } catch (err) {
        console.error('Error removing event:', err);
      }
    }
  };

  return (
    <div className="admin-layout-wrapper">
      <Sidebar />

      <div
        className="admin-page-content"
        style={{ '--bg-image': `url(${bannerBg})` }}
      >
        <header className="page-header-simple">
          <div className="welcome-text">
            <h1>Facility & Event Management</h1>
          </div>
        </header>

        <div className="events-admin-container">
          <section className="update-form-section animate-fade">
            <h3 className="section-title">
              <span></span> Create New Event
            </h3>

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
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  placeholder="Enter event name..."
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    className="filter-dropdown"
                    value={newEvent.category}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, category: e.target.value })
                    }
                  >
                    <option value="Academic">Academic</option>
                    <option value="Professional">Professional</option>
                    <option value="Social">Social</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, location: e.target.value })
                    }
                    placeholder="Innovation Hall"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-add-club">
                Publish Event
              </button>
            </form>
          </section>

          <section className="requests-section">
            <h3 className="section-title">Live Preview</h3>

            <div className="event-list-preview">
              {events.map((event) => {
                const eventDate = new Date(event.EventDate);
                const month = eventDate
                  .toLocaleString('default', { month: 'short' })
                  .toUpperCase();
                const day = eventDate.getDate();

                return (
                  <div
                    key={event.EventID}
                    className="admin-event-card-wrapper"
                  >
                    <div className="event-card-main">
                      <div className="event-date-box">
                        <span className="month">{month}</span>
                        <span className="day">{day}</span>
                      </div>

                      <div className="event-info-content">
                        <div className="meta-info">
                          <span
                            className={`cat-tag ${(event.Category || '').toLowerCase()}`}
                          >
                            {event.Category}
                          </span>

                          <span className="time-loc-text">
                            • {event.EventTime}
                          </span>
                        </div>

                        <h4>{event.EventTitle}</h4>
                        <p className="loc-sub">{event.Location}</p>
                      </div>
                    </div>

                    <button
                      className="btn-reject"
                      onClick={() => handleRemove(event.EventID)}
                    >
                      Remove
                    </button>
                  </div>
                );
              })}

              {events.length === 0 && (
                <p className="scheduled">No events scheduled yet.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default EventAndFacilities;