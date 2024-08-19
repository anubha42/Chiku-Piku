import './App.css';
import Dashboard from './Components/Index';
import React, { useState, useEffect } from 'react';
import Login from './Components/Login'
import Logout from './Components/Logout';
import FormStoryAdd from './Components/FormStoryAdd'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(JSON.parse(localStorage.getItem('is_authenticated')));
  }, []);

  return (
    <>
      {isAuthenticated ? (
        <Dashboard setIsAuthenticated={setIsAuthenticated} />
        
      ) : (
        <Login setIsAuthenticated={setIsAuthenticated} />
      )}
    </>
  );
};

export default App;