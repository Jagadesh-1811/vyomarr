import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Assumption: You are using React Router
import './SpaceRedirect.css';

const SpaceRedirect = () => {
  // 1. State to hold star data
  const [stars, setStars] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    // --- A. Generate Stars on Mount ---
    const starCount = 50;
    const newStars = Array.from({ length: starCount }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      size: Math.random() * 3 + 1 + 'px',
      animationDelay: Math.random() * 2 + 's'
    }));
    setStars(newStars);

    // --- B. Handle Redirection ---
    const redirectTimer = setTimeout(() => {
      // Option 1: If using React Router (Single Page App - Recommended)
      navigate('/home'); 
      
      // Option 2: If using standard file redirection (Multi Page App)
      // window.location.href = 'pages/home_page.html'; 
    }, 2000);

    // Cleanup timer if user leaves page before 2 seconds
    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div className="space-redirect-container">
      {/* Render Stars */}
      <div className="stars-container">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDelay: star.animationDelay
            }}
          />
        ))}
      </div>

      {/* Loading Content */}
      <div className="loading-content">
        <div className="loading-text">Exploring the Cosmos...</div>
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default SpaceRedirect;