import React, { useState } from 'react';
import { login } from '/src/services/AuthService.jsx';
import { useNavigate, Link } from 'react-router-dom';
import '/src/css/Login.css';  

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    localStorage.removeItem('auth');
    e.preventDefault();
    try {
      await login(email, password);
      localStorage.setItem("email", email);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'An error occurred during login.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="input-field"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="input-field"
        />
        <button type="submit" className="submit-button">Login</button>
        <Link to="/signup" className="signup-link">Don't have an account? Sign Up</Link>
      </form>
    </div>
  );
};

export default Login;
