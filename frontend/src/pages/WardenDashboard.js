import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleSuccess } from '../utils';
import 'react-toastify/dist/ReactToastify.css';
import { FaBars, FaUsers, FaClipboardList, FaUtensils, FaBullhorn, FaCommentDots, FaPhoneAlt, FaSignOutAlt } from 'react-icons/fa';

const WardenDashboard = () => {
  const [warden, setWarden] = useState('');
  const navigate = useNavigate();

  // 🔁 Fetch logged-in warden from localStorage
  useEffect(() => {
    const wardenUser = localStorage.getItem('loggedInUser');
    setWarden(wardenUser || 'Warden');
  }, []);

  // 🔁 Sidebar links for warden
  const wardenRoutes = [
    { label: 'Manage Students', path: '/warden-dashboard/manage-students', icon: <FaUsers /> },
    { label: 'View Allotments', path: '/warden-dashboard/view-allotments', icon: <FaClipboardList /> },
    { label: 'Mess Reductions', path: '/warden-dashboard/Mess_Reduction_Application', icon: <FaUtensils /> },
    { label: 'Student Grievances', path: '/warden-dashboard/grievances', icon: <FaCommentDots /> },
    { label: 'Notice Board', path: '/warden-dashboard/notice-board', icon: <FaBullhorn /> },
  ];
  


  return (
    <Container fluid className="p-0">
      <Row>
        {/* Sidebar */}
        <Col md={2} className="p-0">
          <Sidebar title="Warden Panel" routes={wardenRoutes} />
        </Col>

        {/* Main Content */}
        <Col md={10} className="bg-light" style={{ minHeight: '100vh', padding: '30px' }}>
          <div className="bg-white shadow rounded p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h2 className="text-success mb-1">🎯 Warden Dashboard</h2>
                <h5 className="text-muted">Welcome, {warden}</h5>
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
