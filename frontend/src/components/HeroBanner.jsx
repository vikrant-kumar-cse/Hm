const HeroBanner = () => (
  <div style={{ padding: '20px 20px', backgroundColor: '#1e3a8a', color: 'white', textAlign: 'center' }}>
    <h1>Welcome to GECWC Hostel Portal</h1>
    <p>Apply for hostel, check mess details, and get important notices online</p>
    
    <a
      href="/login"
      style={{
        display: 'inline-block',
        marginTop: '20px',
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: 'white',
        color: '#1e3a8a',
        textDecoration: 'none',
        borderRadius: '5px',
        fontWeight: 'bold'
      }}
    >
      Apply Now
    </a>
  </div>
);

export default HeroBanner;
