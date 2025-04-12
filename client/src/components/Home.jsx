import React from 'react';
import { backendURL } from '../config/backendURL';

function Home() {
  return (
    <div className="home">
      <h1>Welcome to the Home Page</h1>
      <p>This is the home page of our application.</p>
      <p>Backend URL: {backendURL}</p>
    </div>
  );
}

export default Home;