import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom'; // Assuming React Router for navigation

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // This ensures that the component is mounted before rendering
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Render nothing until the component is mounted

  return (
    <div className="relative w-full h-screen bg-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          backgroundImage: `url(/assets/FrontPage/Background.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      {/* Federation Approved Text */}
      <div className="absolute top-20 left-20 text-white text-2xl font-medium border border-white px-2">
        Federation approved by NITI AAYOG
      </div>

      {/* Logo */}
      <div className="absolute top-8 right-8">
        <img src="/assets/FrontPage/logo.png" alt="Logo" width={229} height={113} />
      </div>

      {/* Main Text */}
      <div className="absolute top-64 left-48 flex flex-col space-y-8 text-white text-7xl font-medium">
        <div>Re Skilling</div>
        <div>Pre Skilling</div>
        <div>Up Skilling</div>
      </div>

      {/* Enroll Button */}
      <Link to="/login">
        <Button 
          type="primary" 
          className="absolute left-48 top-3/4 w-60 h-20 bg-blue-300 border-blue-900 shadow-lg rounded-full text-4xl text-blue-900 font-bold"
        >
          Visit Site
        </Button>
      </Link>
    </div>
  );
}