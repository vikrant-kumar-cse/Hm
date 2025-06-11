import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleSuccess } from '../utils';
import 'react-toastify/dist/ReactToastify.css';

const MessManagerDashboard = () => {
  const [MessMan, setMessMan] = useState('');
  const navigate = useNavigate();

  // 🔁 Fetch logged-in warden from localStorage
  useEffect(() => {
    const MessManenUser = localStorage.getItem('loggedInUser');
    setMessMan(MessManenUser || 'MessMan');
  }, []);


  // 🔁 Sidebar links for Mess Man
  const Mess_MangRoutes = [
    { label: 'Manage Students', path: '/mess_manager-dashboard/manage-students' },
    { label: 'View Allotments', path: '/mess_manager-dashboard/view-allotments' },
    { label: 'Mess Reductions', path: '/mess_manager-dashboard/mess-reductions' },
    { label: 'Student Grievances', path: 'mess_manager-dashboard/grievances' },
    { label: 'Notice Board', path: 'mess_manager-dashboard/notice-board' },
  ];


  

  return (
    <Container fluid className="p-0">
      <Row>
        {/* Sidebar */}
        <Col md={2} className="p-0">
          <Sidebar title="Mess_Mang Panel" routes={Mess_MangRoutes} />
        </Col>

        {/* Main Content */}
        <Col
          md={10}
          className="bg-light"
          style={{ minHeight: '100vh', padding: '30px' }}
        >
          <div className="bg-white shadow rounded p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="text-success mb-0">👨‍🍳 Mess Manager Dashboard</h2>
              <h5 className="text-muted">Welcome, {MessMan}</h5>
              
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

export default MessManagerDashboard;
