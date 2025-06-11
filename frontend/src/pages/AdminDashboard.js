import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Outlet, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleSuccess } from '../utils';
import Sidebar from '../components/Sidebar';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState('');

  // 🔁 Fetch logged-in admin from localStorage
  useEffect(() => {
    const adminUser = localStorage.getItem('loggedInUser');
    setAdmin(adminUser || 'Admin');
  }, []);

  // 🔁 Sidebar links for admin
  const adminRoutes = [
    { label: 'Manage Students', path: '/admin-dashboard/manage-students' },
    { label: 'Manage Warden', path: '/admin-dashboard/manage-warden' },
    { label: 'Hostel Allotments', path: '/admin-dashboard/allotments' },
    { label: 'Mess Reduction Records', path: '/admin-dashboard/mess-records' },
    { label: 'Send Notice', path: '/admin-dashboard/send-notice' },
    { label: 'Rules Management', path: '/admin-dashboard/manage-rules' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('Logged out');
    setTimeout(() => {
      navigate('/admin-login');
    }, 1000);
  };

  return (
    <Container fluid className="p-0">
      <Row>
        {/* Sidebar */}
        <Col md={2} className="p-0">
          <Sidebar title="Admin Panel" routes={adminRoutes} />
        </Col>

        {/* Main Content */}
        <Col md={10} className="bg-light" style={{ minHeight: '100vh', padding: '30px' }}>
          <div className="bg-white shadow rounded p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h2 className="text-primary mb-1">🎯 Admin Dashboard</h2>
                <h5 className="text-muted">Welcome, {admin}</h5>
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

export default AdminDashboard;
