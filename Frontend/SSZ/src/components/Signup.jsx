import { useState } from 'react';
import { signup } from "/src/services/AuthService.jsx";
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    collegeBranch: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signup(formData); // Assuming signup() is the service function
      setMessage(response); // Success message
      navigate('/dashboard'); // Redirect to dashboard on success
    } catch (error) {
      if (error.response && error.response.data) {
        // Display error message returned from backend
        setMessage(error.response.data);
      } else {
        // Fallback message if the backend doesn't return a message
        setMessage('Signup failed. Please try again.');
      }
    }
  };
  

  // Inline CSS styles
  const styles = {
    container: {
      maxWidth: '400px',
      margin: '50px auto',
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif',
    },
    title: {
      textAlign: 'center',
      color: '#333',
      marginBottom: '20px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
    },
    input: {
      padding: '10px',
      marginBottom: '15px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '16px',
    },
    button: {
      backgroundColor: '#007bff',
      color: '#fff',
      padding: '10px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
    },
    buttonHover: {
      backgroundColor: '#45a049',
    },
    message: {
      textAlign: 'center',
      color: message.includes('success') ? 'green' : 'red',
      marginTop: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Sign Up</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="collegeBranch"
          placeholder="College Branch"
          onChange={handleChange}
          required
          style={styles.input}
        />
        <button
          type="submit"
          style={{
            ...styles.button,
            ':hover': styles.buttonHover, // For hover styles
          }}
        >
          Sign Up
        </button>
      </form>
      <p style={styles.message}>{message}</p>
    </div>
  );
};

export default Signup;
