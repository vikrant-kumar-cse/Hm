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

  // ✅ Fetch profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // token login ke time store karna hoga
        const res = await axios.get("http://localhost:8080/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setStudent(res.data.data);
        setTempStudent(res.data.data);
      } catch (err) {
        console.error("Profile fetch error:", err.response?.data || err.message);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = () => {
    // Agar backend pe update ka endpoint hai, to yaha axios.put/post call karna hoga
    setStudent({ ...tempStudent });
    setEditMode(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
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
            <p className="text-muted">{student.rollNumber}</p>
          </div>

          <Row className="mb-3">
            <Col md="6">
              <FormGroup>
                <Label><strong>Name</strong></Label>
                {editMode ? (
                  <Input
                    value={tempStudent.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                ) : (
                  <div className="form-control-plaintext">{student.name}</div>
                )}
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label><strong>Roll Number</strong></Label>
                {editMode ? (
                  <Input
                    value={tempStudent.rollNumber}
                    onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                  />
                ) : (
                  <div className="form-control-plaintext">{student.rollNumber}</div>
                )}
              </FormGroup>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md="6">
              <FormGroup>
                <Label><strong>Email</strong></Label>
                {editMode ? (
                  <Input
                    type="email"
                    value={tempStudent.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                ) : (
                  <div className="form-control-plaintext">{student.email}</div>
                )}
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label><strong>Phone</strong></Label>
                {editMode ? (
                  <Input
                    value={tempStudent.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                ) : (
                  <div className="form-control-plaintext">{student.phone}</div>
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
