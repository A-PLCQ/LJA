import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './router';
import Navbar from './components/Navbar';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="App">
        <Navbar isLoggedIn={isLoggedIn} />
        <AppRouter isLoggedIn={isLoggedIn} />
      </div>
    </Router>
  );
}

export default App;
