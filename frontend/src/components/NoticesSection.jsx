const NoticesSection = () => {
    const notices = [
      { title: "Hostel Allotment List Released", date: "Aug 5, 2025", file: "/allotment.pdf" },
      { title: "Mess Registration Open", date: "Aug 3, 2025", file: "/mess.pdf" },
    ];
  
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
            {notices.map((n, i) => (
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
                    {n.title}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    {n.date}
                  </div>
                </div>
                <a
                  href={n.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: 'none',
                    color: '#2563eb',
                    fontWeight: '500',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #2563eb',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = '#2563eb'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  View
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };
  
  export default NoticesSection;
  