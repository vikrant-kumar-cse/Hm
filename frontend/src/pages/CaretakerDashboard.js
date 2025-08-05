import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleSuccess } from '../utils';
import 'react-toastify/dist/ReactToastify.css';

const CaretakerDashboard = () => {
  const [CareTacker, setCareTacker] = useState('');
  const navigate = useNavigate();

  
    // 🔁 Fetch logged-in Care_Tacker from localStorage
    useEffect(() => {
      const CareTackerUser = localStorage.getItem('loggedInUser');
      setCareTacker(CareTackerUser || 'CareTacker');
    }, []);
  
   
    // 🔁 Sidebar links for Care Tacker
  const Care_TackerRoute = [
    { label: 'Manage Students', path: '/caretaker-dashboard/manage-students' },
    { label: 'View Allotments', path: '/caretaker-dashboard/view-allotments' },
    { label: 'Mess Reductions', path: '/caretaker-dashboard/Mess-Red-Req' },
    { label: 'Student Grievances', path: '/caretaker-dashboard/grievances' },
    { label: 'Notice Board', path: '/caretaker-dashboard/notice-board' },
  ];




  return (
    <Container fluid className="p-0">
      <Row>
        {/* Sidebar */}
        <Col md={2} className="p-0">
          <Sidebar title="Care_Tacker Panel" routes={Care_TackerRoute } />
        </Col>

        {/* Main Content */}
        <Col md={10} className="bg-light" style={{ minHeight: '100vh', padding: '30px' }}>
          <div className="bg-white shadow rounded p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="text-primary mb-0">🏠 Caretaker Dashboard</h2>
              <h5 className="text-muted">Welcome, {CareTacker}</h5>
              
            </div>
            <hr />
            <Outlet /> {/* Yeh dynamic content render karega (like rooms, students, etc.) */}
          </div>
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
};

export default CaretakerDashboard;
