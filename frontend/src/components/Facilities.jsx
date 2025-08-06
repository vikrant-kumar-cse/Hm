import React from 'react';

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
    <div style={styles.section}>
      <h2 style={styles.title}>Our Hostel Facilities</h2>
      <div style={styles.facilityGrid}>
        {facilityList.map((item, index) => (
          <div key={index} style={styles.card}>
            <div style={styles.icon}>{item.icon}</div>
            <div style={styles.label}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  section: {
    padding: '50px 20px',
    backgroundColor: '#e0f2fe',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '32px',
    marginBottom: '30px',
    color: '#0f172a',
  },
  facilityGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    width: '180px',
    textAlign: 'center',
    transition: 'transform 0.3s ease',
    cursor: 'default',
  },
  icon: {
    fontSize: '36px',
    marginBottom: '10px',
  },
  label: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#1e293b',
  },
};

export default Facilities;
