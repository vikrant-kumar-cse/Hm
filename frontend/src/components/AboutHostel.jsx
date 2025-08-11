import Navbar from "./Navbar";
import Footer from './Footer';

const AboutHostel = () => (
  <>
    <Navbar />
    <div style={{
      padding: '60px 20px',
      backgroundColor: '#f1f5f9',
      display: 'flex',
      justifyContent: 'center',
    }}>
      <div style={{
        maxWidth: '900px',
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontSize: '2rem',
          marginBottom: '20px',
          color: '#1e293b',
          fontFamily: 'Segoe UI, sans-serif'
        }}>
          About GECWC Hostel
        </h2>
  
        <p style={{
          fontSize: '1.1rem',
          lineHeight: '1.7',
          color: '#475569',
          fontFamily: 'Segoe UI, sans-serif'
        }}>
          The GECWC Hostel offers a comfortable and secure living space for over 400 students.
          With spacious and ventilated rooms, a hygienic and nutritious mess, 24/7 security,
          and a calm atmosphere, the hostel ensures a perfect environment for academic and personal growth.
        </p>
      </div>
    </div>
    <Footer />
    </>
  );
  
  export default AboutHostel;
  