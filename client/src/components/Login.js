import { LOGIN } from '../queries';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';

function Login({ refetch }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const [login, { loading }] = useMutation(LOGIN, {
    onCompleted: async (data) => {
      console.log('Login successful:', data);
      if (data && data.login && data.login.token) {
        localStorage.setItem('bookLibraryToken', data.login.token);
        await refetch();
        navigate('/books');
      } else {
        setErrorMessage('Login failed: Invalid response from server');
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
      setErrorMessage(error.message || 'An error occurred during login');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (username.length < 3 || password.length < 6) {
      setErrorMessage('Username must be at least 3 characters and password at least 6 characters');
      return;
    }
    login({ variables: { username, password } });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} aria-label="Login form">
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            aria-required="true"
            minLength="3"
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-required="true"
            minLength="6"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {errorMessage && <p style={{ color: 'red' }} role="alert">{errorMessage}</p>}
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}

export default Login;