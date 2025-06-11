import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { handleSuccess } from '../utils';
import Sidebar from '../components/Sidebar'; // Import reusable Sidebar
import 'react-toastify/dist/ReactToastify.css';

function UserDashboard() {
  const [loggedInUser, setLoggedInUser] = useState('');
  const navigate = useNavigate();

  // Define routes for Student
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
    setLoggedInUser(user || 'user');
  }, []);

 

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
              <h5 className="text-primary mb-0">Welcome, {loggedInUser}</h5>
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
