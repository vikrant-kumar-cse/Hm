import React from 'react';
import Navbar from '../components/Navbar';
import HostelCarousel from '../components/ProductCarousel'

function Navigation() {
  return (
    <div className="flex">
      <Navbar />
      <HostelCarousel />

      <div className="p-6 w-full">
       
      </div>
    </div>
  );
};

export default Navigation;
