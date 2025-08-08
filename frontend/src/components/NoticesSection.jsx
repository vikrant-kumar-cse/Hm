import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NoticesSection = () => {
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/notices/all")
      .then((res) => {
        setNotices(res.data);
      })
      .catch((err) => {
        console.error("Error fetching notices:", err);
      });
  }, []);

  const handleViewClick = (notice) => {
    const filePath = `http://localhost:8080/notices/file/${notice.file}`;
    window.open(filePath, "_blank"); // open the PDF in a new tab
    setSelectedNotice(notice); // show the description/message below
  };

  return (
    <div style={{
      padding: '60px 20px',
      backgroundColor: '#f8fafc',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '800px',
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
      }}>
        <h2 style={{
          fontSize: '2rem',
          marginBottom: '24px',
          color: '#1e293b',
          fontFamily: 'Segoe UI, sans-serif'
        }}>
          Latest Notices
        </h2>

        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
          {notices.map((notice, i) => (
            <li key={i} style={{
              marginBottom: '20px',
              padding: '15px 20px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              backgroundColor: '#f9fafb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'all 0.3s ease'
            }}>
              <div>
                <div style={{ fontWeight: '600', color: '#334155', fontSize: '1.05rem' }}>
                  {notice.title}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                  {new Date(notice.createdAt).toLocaleDateString()}
                </div>
              </div>

              <button
                className="view-btn"
                onClick={() => handleViewClick(notice)}
                style={{
                  textDecoration: 'none',
                  color: '#2563eb',
                  fontWeight: '500',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #2563eb',
                  backgroundColor: 'transparent',
                  cursor: 'pointer'
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#2563eb'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                View
              </button>
            </li>
          ))}
        </ul>

        {selectedNotice && (
          <div style={{
            marginTop: '30px',
            padding: '20px',
            backgroundColor: '#e0f2fe',
            borderRadius: '8px',
            fontSize: '1rem',
            color: '#0f172a'
          }}>
            {/* <strong>Notice Description:</strong><br />
            {selectedNotice.description} */}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticesSection;

