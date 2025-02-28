import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
//import { useNavigate } from 'react-router-dom';
import './dashboard.css';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  // Normal filter state for non-guests; will be ignored for guests
  const [filter, setFilter] = useState('all');
  const [attendeeCounts, setAttendeeCounts] = useState({});
  const { user } = useContext(AuthContext);
 // const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://event-management-krqp.onrender.com/events', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(res.data);
      } catch (error) {
        console.error('Error fetching events:', error.response?.data);
      }
    };
    fetchEvents();

    const socket = io('https://event-management-krqp.onrender.com');
    socket.on('updateAttendees', (data) => {
      setAttendeeCounts((prev) => ({ ...prev, [data.eventId]: data.count }));
    });
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const now = new Date();
    let filtered = events;
    if (user && user.isGuest) {
      // For guest users, show only past events
      filtered = events.filter(event => new Date(event.date) < now);
    } else {
      if (filter === 'upcoming') {
        filtered = events.filter(event => new Date(event.date) >= now);
      } else if (filter === 'past') {
        filtered = events.filter(event => new Date(event.date) < now);
      }
    }
    setFilteredEvents(filtered);
  }, [filter, events, user]);

  return (
    <div className="container dashboard">
      <h2>Event Dashboard</h2>
      {/* Show filter buttons only for non-guest users */}
      {!(user && user.isGuest) && (
        <div className="filter-container">
          <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>
            All
          </button>
          <button onClick={() => setFilter('upcoming')} className={filter === 'upcoming' ? 'active' : ''}>
            Upcoming
          </button>
          <button onClick={() => setFilter('past')} className={filter === 'past' ? 'active' : ''}>
            Past
          </button>
        </div>
      )}
      {filteredEvents.length === 0 ? (
        <p>No events available.</p>
      ) : (
        filteredEvents.map((event) => (
          <div key={event._id} className="event-card">
            <h3>{event.name}</h3>
            <p>{event.description}</p>
            <p>Date: {new Date(event.date).toLocaleString()}</p>
            <p>Category: {event.category || 'General'}</p>
            <p>Attendees: {(attendeeCounts[event._id] ?? event.attendees?.length) || 0}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
