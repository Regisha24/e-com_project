import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [mode, setMode] = useState('user'); // 'user' or 'admin'
  const [isRegister, setIsRegister] = useState(false); // false = login, true = register

  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ name: '', email: '', username: '', password: '' });
  };

  const toggleMode = () => {
    setMode(mode === 'user' ? 'admin' : 'user');
    resetForm();
    setMessage('');
    setError('');
  };

  const toggleRegister = () => {
    setIsRegister(!isRegister);
    resetForm();
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'user') {
        if (isRegister) {
          // Register user
          const response = await axios.post('http://localhost:5000/api/user/register', {
            name: form.name,
            email: form.email,
            password: form.password,
          });
          setMessage(response.data.message || 'User registered successfully!');
          setError('');
        } else {
          // Login user
          const response = await axios.post('http://localhost:5000/api/user/login', {
            name: form.name,
            email: form.email, // include email to match backend logic
            password: form.password,
          });

          if (response.data.error) {
            setError(response.data.error);
            setMessage('');
          } else {
            setMessage(response.data.message || 'User signed in successfully!');
            setError('');
            // Optionally store user info/token here
          }
        }
      } else {
        // Admin mode
        if (isRegister) {
          const response = await axios.post('http://localhost:5000/api/admin/register', {
            username: form.username,
            password: form.password,
          });
          setMessage(response.data.message || 'Admin registered successfully!');
          setError('');
        } else {
          const response = await axios.post('http://localhost:5000/api/admin/login', {
            username: form.username,
            password: form.password,
          });
          if (response.data.error) {
            setError(response.data.error);
            setMessage('');
          } else {
            setMessage(response.data.message || 'Admin signed in successfully!');
            setError('');
          }
        }
      }

      resetForm();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Login/Register error:', err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Operation failed. Please check your inputs or credentials.');
      }
      setMessage('');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div style={{ paddingTop: '100px' }}>
      <div style={styles.container}>
        <h2>
          {isRegister
            ? `${mode === 'user' ? 'User' : 'Admin'} Register`
            : `${mode === 'user' ? 'User' : 'Admin'} Login`}
        </h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          {mode === 'user' ? (
            <>
              <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                style={styles.input}
                required
              />
              {isRegister || mode === 'user' ? (
                <input
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  style={styles.input}
                  type="email"
                  required={isRegister}
                />
              ) : null}
            </>
          ) : (
            <input
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              style={styles.input}
              required
            />
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button}>
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <button onClick={toggleMode} style={styles.toggleButton}>
          Switch to {mode === 'user' ? 'Admin' : 'User'} Mode
        </button>

        <button onClick={toggleRegister} style={styles.toggleButton}>
          {isRegister ? 'Already have an account? Login' : 'New user? Register'}
        </button>

        {message && <p style={{ color: 'green', marginTop: 15 }}>{message}</p>}
        {error && <p style={{ color: 'red', marginTop: 15 }}>{error}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 400,
    margin: '0 auto',
    padding: 20,
    border: '1px solid #ccc',
    borderRadius: 8,
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
    fontFamily: 'Arial, sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
    marginBottom: 15,
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    border: '1px solid #ccc',
  },
  button: {
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    border: 'none',
    backgroundColor: '#007BFF',
    color: 'white',
    cursor: 'pointer',
  },
  toggleButton: {
    marginTop: 10,
    fontSize: 14,
    backgroundColor: 'transparent',
    border: 'none',
    color: '#007BFF',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default Login;
