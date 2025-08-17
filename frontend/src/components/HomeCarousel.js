import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import './HomeCarousel.css';
import './notice.css';
import StudentAccessSection from './StudentAccessSection';
import Navbar from './Navbar';
import Footer from './Footer';


const HomeCarousel = () => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await axios.get("http://localhost:8080/notices/all");
        setNotices(res.data);
      } catch (err) {
        console.error("Failed to fetch notices:", err);
      }
    };

    fetchNotices();
  }, []);

  const hostelImages = [
   
    {
      title: '🛏 Boys Hostel',
      imgUrl: './hostel boys.jpg',
    },
    {
      title: '🎮 Common Area for Students',
      imgUrl: './acadmic.jpg',
    },
     {
      title: '✨ Beautiful Girls Hostel',
      imgUrl: './girlhostel.jpg',
    },
  ];

  const facilityList = [
    { icon: '🛏️', label: 'Spacious Rooms' },
    { icon: '🍽️', label: 'Clean Mess' },
    { icon: '📶', label: 'High-Speed Wi-Fi' },
    { icon: '🛡️', label: '24x7 Security' },
    { icon: '🧑‍⚕️', label: 'Medical Facility' },
    { icon: '📚', label: 'Study Area' },
  ];

  return (
    <>
      <Navbar />

      {/* Carousel */}
      <div className="carousel-container">
        <div className="carousel-section">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            loop={true}
            className="swiper"
          >
            {hostelImages.map((item, index) => (
              <SwiperSlide key={index} className="slide">
                <img src={item.imgUrl} alt={item.title} className="image" />
                <h3 className="title">{item.title}</h3>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Notices */}
        <div className="notice-section">
          <h3 className="notice-heading">📢 Latest Notices</h3>
          <div className="notice-list">
  {notices.length > 0 ? (
    notices.map((notice, index) => (
      <div
        key={index}
        className={`notice-item ${index === 0 ? 'latest-notice' : ''}`}
      >
        <a
          href={`http://localhost:8080/notices/file/${notice.file}`}
          target="_blank"
          rel="noopener noreferrer"
          className="notice-link"
        >
          🔗 {notice.title}
        </a>
      </div>
    ))
  ) : (
    <p style={{ padding: '10px', color: '#64748b' }}>No notices available.</p>
  )}
</div>

        </div>
      </div>

      {/* Student Login Prompt */}
      <StudentAccessSection />

      {/* Services Section (Merged) */}
      <section style={styles.section}>
        <h2 style={styles.title}>🏨 Our Hostel Facilities</h2>
        <div style={styles.facilityGrid}>
          {facilityList.map((item, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.icon}>{item.icon}</div>
              <div style={styles.label}>{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Highlights Section */}
      <section style={{ padding: '50px 20px', backgroundColor: '#f8fafc', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#1e3a8a' }}>🏫 Hostel Life Highlights</h2>
        <p style={{ maxWidth: '800px', margin: '0 auto', color: '#475569' }}>
          GECWC Hostel offers a safe, clean, and vibrant environment for students. From high-speed internet to
          nutritious food and academic support — we ensure every student feels at home.
        </p>
      </section>

      {/* Gallery Section */}
      <section style={{ padding: '50px 20px', backgroundColor: '#ffffff', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#0f172a' }}>📸 Glimpse of Our Hostel</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {hostelImages.slice(0, 3).map((img, index) => (
            <img
              key={index}
              src={img.imgUrl}
              alt={img.title}
              style={{ width: '300px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ padding: '50px 20px', backgroundColor: '#e2e8f0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#1e293b' }}>💬 What Our Students Say</h2>
        <p style={{ fontStyle: 'italic', color: '#475569', maxWidth: '600px', margin: '0 auto' }}>
          “The hostel has truly been a home away from home. Great food, friendly environment, and all the facilities a
          student needs!” – <strong>Ravi Kumar (CSE)</strong>
        </p>
      </section>
      <Footer/>
    </>
  );
};

const styles = {
  section: {
    padding: '60px 30px',
    background: 'linear-gradient(to right, #f0f8ff, #dbeafe)',
    textAlign: 'center',
    fontFamily: 'Segoe UI, sans-serif',
  },
  title: {
    fontSize: '36px',
    marginBottom: '40px',
    color: '#1e293b',
    fontWeight: '700',
  },
  facilityGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '30px',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '25px',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
    width: '220px',
    textAlign: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
  },
  icon: {
    fontSize: '42px',
    marginBottom: '15px',
  },
  label: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#334155',
  },

};

export default HomeCarousel;
