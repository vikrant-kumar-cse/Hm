import React, { useState, useEffect, useRef } from 'react';
import {
  Nav,
  NavItem,
  Button,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa'; // icon for menu
import './UserSidebar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function UserSidebar() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [clickedButton, setClickedButton] = useState(null);
  const [activeLink, setActiveLink] = useState('/'); // Track active link
  const sidebarRef = useRef();

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
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleMenuClick = (path) => {
    setActiveLink(path);
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleButtonClick = (buttonName) => {
    setClickedButton(buttonName);
    setTimeout(() => setClickedButton(null), 300);
  };

  return (
    <>
      {/* Mobile topbar */}
      {isMobile && (
        <div className="mobile-topbar d-flex justify-content-between align-items-center px-3 py-2 bg-light">
          <Link to="/" className="navbar-brand text-primary fs-5 m-0">Student Dashboard</Link>
          <FaBars
            size={24}
            onClick={toggleSidebar}
            style={{ cursor: 'pointer', color: '#000' }}
          />
        </div>
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`sidebar ${isMobile ? 'mobile-sidebar' : ''} ${isSidebarOpen ? 'open' : ''}`}
      >
        <Nav vertical className="p-3">
          <Link to="/" className="navbar-brand text-primary fs-5 m-0"><b>Student Dashboard</b></Link>
          <br />
          <NavItem>
            <Link
              to="/user-dashboard/Student-profile"
              className={`nav-link ${activeLink === '/StudentProfile' ? 'active-link' : 'text-dark' }`}
              onClick={() => handleMenuClick('/StudentProfile')}
            >
              Student Profile
            </Link>
          </NavItem>
          <NavItem>
            <Link
              to="/user-dashboard/hostel-allotment"
              className={`nav-link ${activeLink === '/AllotmentForm' ? 'active-link' : 'text-dark'}`}
              onClick={() => handleMenuClick('/AllotmentForm')}
            >
              Hostel Allotment
            </Link>
          </NavItem>
          <NavItem>
            <Link
              to="/user-dashboard/mess-reduction"
              className={`nav-link ${activeLink === '/mess-reduction' ? 'active-link' : 'text-dark'}`}
              onClick={() => handleMenuClick('/mess-reduction')}
            >
              Mess Reduction
            </Link>
          </NavItem>
          <NavItem>
            <Link
              to="/user-dashboard/mess_Red-tracking"
              className={`nav-link ${activeLink === '/MessReductionTracking' ? 'active-link' : 'text-dark'}`}
              onClick={() => handleMenuClick('/MessReductionTracking')}
            >
              Mess Reduction Tracking
            </Link>
          </NavItem>
          <NavItem>
            <Link
              to="/user-dashboard/"
              className={`nav-link ${activeLink === '/mess-calendar' ? 'active-link' : 'text-dark'}`}
              onClick={() => handleMenuClick('/mess-calendar')}
            >
              Mess Calendar
            </Link>
          </NavItem>
          <NavItem>
            <Link
              to="/user-dashboard/"
              className={`nav-link ${activeLink === '/grievance-support' ? 'active-link' : 'text-dark'}`}
              onClick={() => handleMenuClick('/grievance-support')}
            >
              Grievance Support
            </Link>
          </NavItem>
          <NavItem>
            <Link
              to="/user-dashboard/"
              className={`nav-link ${activeLink === '/rules-regulation' ? 'active-link' : 'text-dark'}`}
              onClick={() => handleMenuClick('/rules-regulation')}
            >
              Rules & Regulation
            </Link>
          </NavItem>
        </Nav>

        {/* Buttons */}
        <Button
          color="primary"
          className={`sidebar-button ${clickedButton === 'contact' ? 'clicked' : ''}`}
          onClick={() => handleButtonClick('contact')}
          style={{ marginLeft: '35px', marginTop: '50px', width: '140px' }}
        >
          Contact Us
        </Button>

        <Button
          color="danger"
          className={`sidebar-button ${clickedButton === 'logout' ? 'clicked' : ''}`}
          onClick={() => handleButtonClick('logout')}
          style={{ marginTop: '50px', marginLeft: '35px', width: '140px' }}
        >
          Logout
        </Button>
      </div>

      {/* Overlay */}
      {isMobile && isSidebarOpen && (
        <div className="overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </>
  );
}

export default UserSidebar;


