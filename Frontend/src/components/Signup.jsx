import React, { useState } from 'react';
import { signup } from '/src/services/AuthService.jsx';
import { useNavigate } from 'react-router-dom';
import '/src/css/Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', collegeBranch: '' });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Handle text inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input separately
  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // Store file object
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('collegeBranch', formData.collegeBranch);
      
      if (image) {
        data.append('image', image); // Only append image if it exists
      }

      await signup(data);
      navigate('/'); // Redirect to login page or dashboard
    } catch (error) {
      setMessage(error.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Create an Account</h2>
        {message && <div className="error-message">{message}</div>}
        
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required className="input-field" />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="input-field" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="input-field" />
        {/* <input type="text" name="collegeBranch" placeholder="College Branch" onChange={handleChange} required className="input-field" /> */}
        <select name="collegeBranch" onChange={handleChange} required className="input-field">
          <option value="">Select College Branch</option>
          <option value="CSE">Computer Science</option>
          <option value="IT">Information Technology</option>
          <option value="ECE">Electronics & Communication</option>
          <option value="EE">Electrical Engineering</option>
          <option value="ME">Mechanical Engineering</option>
          </select>
        
        <input type="file" name="image" onChange={handleFileChange} className="input-field" />
        
        <button type="submit" className="submit-button">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
