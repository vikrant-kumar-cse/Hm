import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  FormGroup,
  Label,
  Input,
  Alert
} from 'reactstrap';
import axios from 'axios';

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [tempStudent, setTempStudent] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // ✅ Fetch profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // ✅ IMPORTANT: _id bhi store karo!
        const { _id, name, email, mobile } = res.data.data;
        const userData = { _id, name, email, mobile };
        
        setStudent(userData);
        setTempStudent(userData);
      } catch (err) {
        console.error("Profile fetch error:", err.response?.data || err.message);
      }
    };
    fetchProfile();
  }, []);

  // ✅ Save profile with debugging
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const updateData = {
        name: tempStudent.name,
        email: tempStudent.email,
        mobile: tempStudent.mobile
      };
      const response = await axios.put(`http://localhost:8080/auth/profile/${student._id}`, updateData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setStudent({ ...student, ...updateData });
      setEditMode(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      
    } catch (err) {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  const handleInputChange = (field, value) => {
    setTempStudent(prev => ({ ...prev, [field]: value }));
  };

  if (!student) {
    return <p className="text-center mt-5">Loading profile...</p>;
  }

  return (
    <Container className="py-4" style={{ maxWidth: '600px' }}>
      {showSuccess && (
        <Alert color="success" className="mb-3">
          Profile updated successfully! ✅
        </Alert>
      )}
      {showError && (
        <Alert color="danger" className="mb-3">
          Failed to update profile ❌
        </Alert>
      )}

      <Card className="shadow">
        <CardBody>
          <div className="text-center mb-4">
            <div
              className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
              style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#007bff',
                fontSize: '32px',
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              {student.name?.charAt(0)}
            </div>
            <h4>{student.name}</h4>
            <p className="text-muted">{student.email}</p>
          </div>

          <Row className="mb-3">
            <Col md="6">
              <FormGroup>
                <Label><strong>Name</strong></Label>
                {editMode ? (
                  <Input
                    value={tempStudent.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                ) : (
                  <div className="form-control-plaintext">{student.name}</div>
                )}
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label><strong>Email</strong></Label>
                {editMode ? (
                  <Input
                    type="email"
                    value={tempStudent.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                ) : (
                  <div className="form-control-plaintext">{student.email}</div>
                )}
              </FormGroup>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md="6">
              <FormGroup>
                <Label><strong>Mobile</strong></Label>
                {editMode ? (
                  <Input
                    value={tempStudent.mobile || ''}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                  />
                ) : (
                  <div className="form-control-plaintext">{student.mobile}</div>
                )}
              </FormGroup>
            </Col>
          </Row>

          <div className="text-center">
            <Button
              color={editMode ? "success" : "primary"}
              onClick={editMode ? handleSave : () => setEditMode(true)}
              className="me-2"
            >
              {editMode ? 'Save Changes' : 'Edit Profile'}
            </Button>
            {editMode && (
              <Button
                color="secondary"
                onClick={() => { setEditMode(false); setTempStudent({ ...student }); }}
              >
                Cancel
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </Container>
  );
};

export default StudentProfile;