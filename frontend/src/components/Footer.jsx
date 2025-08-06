import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.column}>
          <h4>GEC West Champaran</h4>
          <p>
            Government Engineering College, West Champaran, Bihar <br />
            Hostel Management System
          </p>
        </div>

        <div style={styles.column}>
          <h4>Quick Links</h4>
          <ul style={styles.linkList}>
            <li><a href="/">Home</a></li>
            <li><a href="/notice">Notices</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div style={styles.column}>
          <h4>Contact Us</h4>
          <p>Email: hostel@gecwc.ac.in</p>
          <p>Phone: +91-1234567890</p>
        </div>
      </div>

      <div style={styles.bottom}>
        <p>© {new Date().getFullYear()} GECWC Hostel | All rights reserved.</p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#1f2937', // dark gray
    color: '#ffffff',
    padding: '40px 20px 10px',
    fontFamily: 'Arial, sans-serif',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    maxWidth: '1200px',
    margin: 'auto',
  },
  column: {
    flex: '1 1 300px',
    marginBottom: '20px',
  },
  linkList: {
    listStyleType: 'none',
    padding: 0,
  },
  bottom: {
    borderTop: '1px solid #444',
    marginTop: '20px',
    paddingTop: '10px',
    textAlign: 'center',
    fontSize: '14px',
  },
};

export default Footer;
