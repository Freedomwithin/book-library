import Signup from './components/Signup';
import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import { useQuery } from '@apollo/client';
import BookList from './components/BookList';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { GET_ME } from './queries';
import AddBook from './components/AddBook';

function App() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { loading, data, refetch } = useQuery(GET_ME, {
    fetchPolicy: 'network-only',
    onError: (error) => {
      console.error('GraphQL error:', error);
      // If there's an error, we assume the user is not logged in
      setIsLoggedIn(false);
    }
  });

  useEffect(() => {
    if (data?.me) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [data]);

  useEffect(() => {
    console.log('App re-rendered. isLoggedIn:', isLoggedIn);
    console.log('Current route:', location.pathname);
  }, [isLoggedIn, location]);

  const handleLogin = async () => {
    try {
      await refetch();
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error during login:', error);
      setIsLoggedIn(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login refetch={handleLogin} />} />
        <Route path="/signup" element={<Signup refetch={handleLogin} />} />
        <Route 
          path="/books" 
          element={isLoggedIn ? (
            <>
              <AddBook />
              <BookList />
            </>
          ) : <Navigate to="/login" />} 
        />
        <Route path="/" element={<Navigate to={isLoggedIn ? "/books" : "/login"} />} />
      </Routes>
    </div>
  );
}

export default App;