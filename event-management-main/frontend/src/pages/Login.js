import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://event-management-krqp.onrender.com/auth/login', formData);
      login(res.data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login Error:', error.response?.data);
      alert(error.response?.data?.error || 'Login failed');
    }
  };

  // Optional: Guest login functionality
  const guestLogin = async () => {
    try {
      const res = await axios.post('https://event-management-krqp.onrender.com/auth/guest');
      login(res.data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Guest Login Error:', error.response?.data);
      alert('Guest login failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          onChange={handleChange} 
          required 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          onChange={handleChange} 
          required 
        />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
      <button className="guest-btn" onClick={guestLogin}>Guest Login</button>
    </div>
  );
};

export default Login;
