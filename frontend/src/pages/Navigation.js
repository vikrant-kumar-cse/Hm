import React from 'react';
import Navbar from '../components/Navbar';
import HomeCarousel from '../components/HomeCarousel';
import HeroBanner from '../components/HeroBanner';
import AboutHostel from '../components/AboutHostel';
import NoticesSection from '../components/NoticesSection';
import Facilities from '../components/Facilities';
import Footer from '../components/Footer';

function Navigation() {
  return (
    <div className="flex">
      <Navbar />
      <HeroBanner />
      <HomeCarousel />
      <AboutHostel />
      <NoticesSection />
      <Facilities />
      <Footer />

      <div className="p-6 w-full">
       
      </div>
    </div>
  );
};

export default Navigation;
