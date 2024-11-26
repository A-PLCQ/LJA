import React, { useState } from 'react';
import AppRouter from './router';
import Navbar from './components/common/Navbar';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="App">
      <Navbar isLoggedIn={isLoggedIn} />
      <div style={{ padding: '75px 0px' }}>
        <AppRouter isLoggedIn={isLoggedIn} />
      </div>
    </div>
  );
}

export default App;
