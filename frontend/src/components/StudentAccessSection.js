import React from 'react';

const StudentAccessSection = () => {
  return (
    <div style={{ padding: '40px 20px', backgroundColor: '#f1f5f9', textAlign: 'center' }}>
      <h2 style={{ color: '#1e3a8a', marginBottom: '10px' }}>🎓 Student Portal Access</h2>
      <p style={{ fontSize: '16px', color: '#374151', maxWidth: '600px', margin: '0 auto' }}>
        Already a student? Login to your dashboard to apply for hostel, request mess reduction,
        and view your application status in just a few clicks!
      </p>

      <a
        href="/login"
        style={{
          display: 'inline-block',
          marginTop: '20px',
          padding: '12px 28px',
          backgroundColor: '#1e3a8a',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '16px',
          textDecoration: 'none',
          borderRadius: '6px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          transition: 'background-color 0.3s ease',
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#3b82f6')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#1e3a8a')}
      >
        🔐 Login to Student Dashboard
      </a>
    </div>
  );
};

export default StudentAccessSection;
