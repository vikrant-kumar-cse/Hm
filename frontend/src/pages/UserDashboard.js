import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Container, Row, Col, Nav, NavItem, Button } from 'react-bootstrap';
import { FaBell, FaBars, FaPhoneAlt, FaSignOutAlt } from 'react-icons/fa';
import { io } from 'socket.io-client';
import { handleSuccess } from '../utils';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const socket = io('http://localhost:8080'); // Replace with your server URL

function UserDashboard() {
  const [loggedInUser, setLoggedInUser] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [clickedButton, setClickedButton] = useState(null);
  const sidebarRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const studentRoutes = [
    { label: 'Student Profile', path: '/user-dashboard/student-profile' },
    { label: 'Hostel Allotment', path: '/user-dashboard/hostel-allotment' },
    { label: 'Mess Reduction', path: '/user-dashboard/mess-reduction' },
    { label: 'Mess Tracking', path: '/user-dashboard/mess_Red-tracking' },
    { label: 'Rules & Regulations', path: '/user-dashboard/rules' },
    { label: 'Grievance', path: '/user-dashboard/grievance' },
  ];

  // ✅ Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth <= 768;
      setIsMobile(isNowMobile);
      if (!isNowMobile) setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  // ✅ Load user + socket notifications
  useEffect(() => {
    const user = localStorage.getItem('loggedInUser');
    setLoggedInUser(user || 'User');

    const rollNumber = JSON.parse(localStorage.getItem('studentData'))?.rollNumber;
    if (rollNumber) {
      socket.on(`mess-approved-${rollNumber}`, (data) => {
        setNotifications(prev => [data, ...prev]);
      });
    }

    return () => {
      if (rollNumber) {
        socket.off(`mess-approved-${rollNumber}`);
      }
    };
  }, []);

  // ✅ Sidebar actions
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    const role = localStorage.getItem('role');
    localStorage.clear();
    handleSuccess('User Logged out');
    setTimeout(() => {
      if (role === 'warden') navigate('/warden-login');
      else if (role === 'admin') navigate('/admin-login');
      else if (role === 'care-tacker') navigate('/hostel-care-tacker-login');
      else if (role === 'mess_manager') navigate('/mess_manager-login');
      else navigate('/login');
    }, 1000);
  };

  const handleButtonClick = (btn) => {
    setClickedButton(btn);
    setTimeout(() => setClickedButton(null), 300);
  };

  const handleNotificationClick = () => {
    setShowDropdown(!showDropdown);
    setNotifications([]); // mark as read
  };

  return (
    <Container fluid className="p-0">
      <Row>
        {/* Sidebar */}
        <Col md={2} className="p-0">
          {isMobile && (
            <div className="mobile-topbar d-flex justify-content-between align-items-center px-3 py-2 bg-light">
              <Link to="/" className="navbar-brand text-primary fs-5 m-0">Student Dashboard</Link>
              <FaBars size={24} onClick={toggleSidebar} style={{ cursor: 'pointer', color: '#000' }} />
            </div>
          )}

          <div
            ref={sidebarRef}
            className={`sidebar bg-white shadow-sm ${isMobile ? 'mobile-sidebar' : ''} ${isSidebarOpen ? 'open' : ''}`}
            style={{ minHeight: '100vh' }}
          >
            <Nav className="flex-column p-3">
              <Link to="/" className="navbar-brand text-primary fs-5 m-0"><b>Student Dashboard</b></Link><br />
              {studentRoutes.map(({ label, path }) => (
                <NavItem key={path}>
                  <Link
                    to={path}
                    className={`nav-link d-flex align-items-center gap-2 ${location.pathname === path ? 'active-link text-primary fw-bold' : 'text-dark'}`}
                    onClick={() => isMobile && setIsSidebarOpen(false)}
                  >
                    {label}
                  </Link>
                </NavItem>
              ))}
            </Nav>

            {/* Contact Us */}
            <Button
              variant="outline-primary"
              className={`sidebar-button ms-3 mt-5 w-75 ${clickedButton === 'contact' ? 'clicked' : ''}`}
              onClick={() => {
                setClickedButton('contact');
                navigate('/user-dashboard/contact-us');
              }}
            >
              <FaPhoneAlt className="me-2" /> Contact Us
            </Button>

            {/* Logout */}
            <Button
              variant="outline-danger"
              className={`sidebar-button ms-3 mt-3 w-75 ${clickedButton === 'logout' ? 'clicked' : ''}`}
              onClick={() => {
                handleButtonClick('logout');
                if (window.confirm('Are you sure you want to logout?')) {
                  handleLogout();
                }
              }}
            >
              <FaSignOutAlt className="me-2" /> Logout
            </Button>
          </div>

          {isMobile && isSidebarOpen && (
            <div className="overlay" onClick={() => setIsSidebarOpen(false)}></div>
          )}
        </Col>

        {/* Main Content */}
        <Col md={10} className="bg-light" style={{ minHeight: '100vh', padding: '30px' }}>
          <div className="bg-white shadow rounded p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="text-primary mb-0">🎯 Student Dashboard</h2>

              {/* 🔔 Bell */}
              <div style={{ position: 'relative' }}>
                <FaBell
                  size={24}
                  style={{ cursor: 'pointer' }}
                  onClick={handleNotificationClick}
                />
                {notifications.length > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      background: 'red',
                      color: 'white',
                      borderRadius: '50%',
                      padding: '2px 6px',
                      fontSize: '12px'
                    }}
                  >
                    {notifications.length}
                  </span>
                )}

                {/* 🔽 Dropdown */}
                {showDropdown && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '30px',
                      width: '300px',
                      background: '#fff',
                      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                      borderRadius: '5px',
                      zIndex: 10
                    }}
                  >
                    <ul className="list-unstyled m-0 p-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {notifications.map((n, idx) => (
                        <li key={idx} className="mb-2" style={{ borderBottom: '1px solid #eee', paddingBottom: '6px' }}>
                          <strong>{n.title}</strong><br />
                          <small>{new Date(n.time).toLocaleString()}</small>
                        </li>
                      ))}
                      {notifications.length === 0 && <li>No new notifications</li>}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <hr />
            <Outlet />
          </div>
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
}

export default UserDashboard;
