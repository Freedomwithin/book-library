import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { setToken } from '../clientAuth';

const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $password: String!) {
    signup(username: $username, password: $password) {
      token
      user {
        id
        username
      }
    }
  }
`;

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [signup, { loading }] = useMutation(SIGNUP_MUTATION, {
    onError: (error) => {
      console.error('Signup error', error);
      setMessage(error.message || 'An error occurred during signup');
    },
    onCompleted: (data) => {
      if (data && data.signup) {
        setToken(data.signup.token);
        setMessage('Signup successful!');
        console.log('Signup successful', data.signup.user);
        // You might want to redirect the user or update the app state here
      } else {
        setMessage('Signup failed: No data returned');
      }
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    console.log('Submitting with:', { username, password });
    try {
      await signup({ 
        variables: { 
          username: username.trim(),
          password: password.trim()
        }
      });
    } catch (err) {
      // The error will be handled by the onError callback
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default Signup;