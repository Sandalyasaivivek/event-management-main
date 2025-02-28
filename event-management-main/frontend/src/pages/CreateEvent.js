import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    category: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://event-management-krqp.onrender.com/events', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating event:', error.response?.data);
      alert(error.response?.data?.error || 'Event creation failed');
    }
  };

  return (
    <div className="container">
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Event Name" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} />
        <input type="datetime-local" name="date" onChange={handleChange} required />
        <input type="text" name="category" placeholder="Category" onChange={handleChange} />
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;
