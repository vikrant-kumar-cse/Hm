import React, { useState, useEffect, useRef } from 'react';
import { Nav, NavItem, Button } from 'reactstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaUsers, FaClipboardList, FaUtensils, FaBullhorn, FaCommentDots, FaPhoneAlt, FaSignOutAlt } from 'react-icons/fa';
import './UserSidebar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { handleSuccess } from '../utils';

function Sidebar({ title = "Dashboard", routes = [] }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [clickedButton, setClickedButton] = useState(null);
  const sidebarRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();

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

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    const role = localStorage.getItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('role');
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

  return (
    <>
      {isMobile && (
        <div className="mobile-topbar d-flex justify-content-between align-items-center px-3 py-2 bg-light">
          <Link to="/" className="navbar-brand text-primary fs-5 m-0">{title}</Link>
          <FaBars size={24} onClick={toggleSidebar} style={{ cursor: 'pointer', color: '#000' }} />
        </div>
      )}

      <div
        ref={sidebarRef}
        className={`sidebar ${isMobile ? 'mobile-sidebar' : ''} ${isSidebarOpen ? 'open' : ''}`}
      >
        <Nav vertical className="p-3">
          <Link to="/" className="navbar-brand text-primary fs-5 m-0"><b>{title}</b></Link><br />
          {routes.map(({ label, path, icon }) => (
            <NavItem key={path}>
              <Link
                to={path}
                className={`nav-link d-flex align-items-center gap-2 ${location.pathname === path ? 'active-link' : 'text-dark'}`}
                onClick={() => isMobile && setIsSidebarOpen(false)}
              >
                {icon} {label}
              </Link>
            </NavItem>
          ))}
        </Nav>

        <Button
          outline
          color="primary"
          className={`sidebar-button ${clickedButton === 'contact' ? 'clicked' : ''}`}
          onClick={() => handleButtonClick('contact')}
          style={{ marginLeft: '35px', marginTop: '50px', width: '140px' }}
        >
          <FaPhoneAlt className="me-2" /> Contact Us
        </Button>

        <Button
          outline
          color="danger"
          className={`sidebar-button ${clickedButton === 'logout' ? 'clicked' : ''}`}
          onClick={() => {
            handleButtonClick('logout');
            if (window.confirm('Are you sure you want to logout?')) {
              handleLogout();
            }
          }}
          style={{ marginTop: '20px', marginLeft: '35px', width: '140px' }}
        >
          <FaSignOutAlt className="me-2" /> Logout
        </Button>
      </div>

      {isMobile && isSidebarOpen && (
        <div className="overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </>
  );
}

export default Sidebar;
