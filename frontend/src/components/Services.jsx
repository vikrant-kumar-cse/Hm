import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Facilities = () => {
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
      <Navbar /> {/* Only here, so it won't appear on other pages */}
      <div style={styles.section}>
        <h2 style={styles.title}>🏨 Our Hostel Facilities</h2>
        <div style={styles.facilityGrid}>
          {facilityList.map((item, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.icon}>{item.icon}</div>
              <div style={styles.label}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
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

export default Facilities;
