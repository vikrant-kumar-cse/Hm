import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Container, Row, Col } from 'react-bootstrap';
import { FaBell } from 'react-icons/fa';
import { io } from 'socket.io-client';
import Sidebar from '../components/Sidebar';
import 'react-toastify/dist/ReactToastify.css';

const socket = io('http://localhost:8080'); // Replace with your server URL

function UserDashboard() {
  const [loggedInUser, setLoggedInUser] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const studentRoutes = [
    { label: 'Student Profile', path: '/user-dashboard/student-profile' },
    { label: 'Hostel Allotment', path: '/user-dashboard/hostel-allotment' },
    { label: 'Mess Reduction', path: '/user-dashboard/mess-reduction' },
    { label: 'Mess Tracking', path: '/user-dashboard/mess_Red-tracking' },
    { label: 'Rules & Regulations', path: '/user-dashboard/rules' },
    { label: 'Grievance', path: '/user-dashboard/grievance' },
  ];

  useEffect(() => {
    const user = localStorage.getItem('loggedInUser');
    setLoggedInUser(user || 'User');

    // Join socket listener after fetching user roll number
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

  const handleNotificationClick = () => {
    setShowDropdown(!showDropdown);
    setNotifications([]); // Mark all as read
  };

  return (
    <Container fluid className="p-0">
      <Row>
        {/* Sidebar */}
        <Col md={2} className="p-0">
          <Sidebar title="Student Dashboard" routes={studentRoutes} />
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
