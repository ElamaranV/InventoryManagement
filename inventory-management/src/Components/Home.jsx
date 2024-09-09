import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="animated-title">Welcome to EA Inventory</h1>
      <p>Your one-stop solution for managing inventory efficiently.</p>
      <a href="/login" className="login-button">Login</a>
    </div>
  );
};

export default Home;