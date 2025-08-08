import React, { useRef } from 'react';
import Navbar from '../components/Navbar';
import HomeCarousel from '../components/HomeCarousel';
import HeroBanner from '../components/HeroBanner';
import AboutHostel from '../components/AboutHostel';
import NoticesSection from '../components/NoticesSection';
import Facilities from '../components/Facilities';
import Footer from '../components/Footer';

function Navigation() {
  const aboutRef = useRef(null);
  const noticeRef = useRef(null);
  const facilitiesRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex">

      <Navbar scrollToSection= {scrollToSection} refs={{aboutRef,noticeRef,facilitiesRef,contactRef}} />

      <HeroBanner />

      <HomeCarousel />

      <div ref={aboutRef}>
      <AboutHostel />
      </div>

      <div ref={noticeRef}>
      <NoticesSection />
      </div>

      <div ref={facilitiesRef}>
      <Facilities />
      </div>

      <div ref={contactRef}>
      <Footer />
      </div>
  

      <div className="p-6 w-full">
       
      </div>
    </div>
  );
};

export default Navigation;
