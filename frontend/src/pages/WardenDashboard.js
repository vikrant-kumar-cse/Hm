import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { FaUsers, FaClipboardList, FaUtensils, FaBullhorn, FaCommentDots, FaBell } from 'react-icons/fa';
import { io } from 'socket.io-client';
import 'react-toastify/dist/ReactToastify.css';

// Connect to backend
const socket = io('http://localhost:8080');

const WardenDashboard = () => {
  const [warden, setWarden] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  // 🔁 Load logged-in warden
  useEffect(() => {
    const wardenUser = localStorage.getItem('loggedInUser');
    setWarden(wardenUser || 'Warden');
  }, []);

  // ✅ Listen for real-time mess deduction submission
  useEffect(() => {
    socket.on('mess-deduction-submitted', (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off('mess-deduction-submitted');
    };
  }, []);

  // ✅ Handle click on notification
  const handleNotificationClick = (index, requestId) => {
    setNotifications((prev) => {
      const updated = [...prev];
      updated.splice(index, 1); // remove clicked one
      return updated;
    });
    setShowDropdown(false); // hide dropdown

    // Optional: navigate to preview page
    if (requestId) {
      navigate(`/warden-dashboard/Mess_Reduction_Application/preview/${requestId}`);
    }
  };

  // Sidebar links
  const wardenRoutes = [
    { label: 'Manage Students', path: '/warden-dashboard/manage-students', icon: <FaUsers /> },
    { label: 'View Allotments', path: '/warden-dashboard/view-allotments', icon: <FaClipboardList /> },
    { label: 'Mess Reductions', path: '/warden-dashboard/Mess_Reduction_Application', icon: <FaUtensils /> },
    { label: 'Student Grievances', path: '/warden-dashboard/grievances', icon: <FaCommentDots /> },
    { label: 'Notice Board', path: '/warden-dashboard/Notice', icon: <FaBullhorn /> },
     { label: 'Search History', path: '/warden-dashboard/History', icon: <FaBullhorn /> },
  ];

  return (
    <Container fluid className="p-0">
      <Row>
        {/* Sidebar */}
        <Col md={2} className="p-0">
          <Sidebar title="Warden Panel" routes={wardenRoutes} />
        </Col>

        {/* Main content */}
        <Col md={10} className="bg-light" style={{ minHeight: '100vh', padding: '30px' }}>
          <div className="bg-white shadow rounded p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h2 className="text-success mb-1">🎯 Warden Dashboard</h2>
                <h5 className="text-muted">Welcome, {warden}</h5>
              </div>

              {/* 🔔 Bell with counter */}
              <div style={{ position: 'relative' }}>
                <FaBell
                  size={24}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowDropdown(!showDropdown)}
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
                      {notifications.length > 0 ? (
                        notifications.map((n, idx) => (
                          <li
                            key={idx}
                            className="mb-2"
                            style={{
                              borderBottom: '1px solid #eee',
                              paddingBottom: '6px',
                              cursor: 'pointer'
                            }}
                            onClick={() => handleNotificationClick(idx, n.requestId)}
                          >
                            <strong>{n.title}</strong><br />
                            {n.student} ({n.roll})<br />
                            <small>{new Date(n.time).toLocaleString()}</small>
                          </li>
                        ))
                      ) : (
                        <li className="text-center text-muted">No new notifications</li>
                      )}
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
};

export default WardenDashboard;
