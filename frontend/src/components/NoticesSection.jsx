import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { Container, Button } from 'reactstrap';
import Footer from './Footer';

const NoticesSection = () => {
  const [notices, setNotices] = useState([]);

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
    window.open(filePath, "_blank");
  };

  return (
    <>
      <Navbar />
      <div style={styles.pageWrapper}>
        <Container style={styles.container}>
          <h2 style={styles.heading}>📢 Latest Notices</h2>

          {notices.length === 0 ? (
            <p style={styles.noData}>No notices available</p>
          ) : (
            <div style={styles.noticeWrapper}>
              {notices.map((notice, index) => (
                <div key={index} style={styles.noticeRow}>
                  <div style={styles.noticeText}>
                    <span style={styles.noticeTitle}>{notice.title}</span>
                    <span style={styles.noticeDate}>
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Button
                    style={styles.button}
                    color="primary"
                    onClick={() => handleViewClick(notice)}
                  >
                    View Attachment
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Container>
      </div>
      <Footer />
    </>
  );
};

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '60px 0',
    display: 'flex',
    justifyContent: 'center',
  },
  container: {
    maxWidth: '700px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
  },
  heading: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: '1.8rem',
    marginBottom: '25px',
    color: '#1e3a8a',
  },
  noData: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: '1.1rem',
  },
  noticeWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  noticeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    padding: '12px 18px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  noticeText: {
    display: 'flex',
    flexDirection: 'column',
  },
  noticeTitle: {
    fontWeight: '600',
    color: '#0f172a',
  },
  noticeDate: {
    fontSize: '0.85rem',
    color: '#64748b',
  },
  button: {
    fontSize: '0.85rem',
    padding: '6px 14px',
    borderRadius: '6px',
  },
};

export default NoticesSection;
