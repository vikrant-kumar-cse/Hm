import React, { useState } from 'react';
import { Form, Button, Row, Col, InputGroup, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const MessReductionForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    rollNumber: '',
    session: '',
    branch: '',
    semester: '',
    roomNumber: '',
    dateFrom: '',
    dateTo: '',
    numberOfDays: '',
    reason: '',
    document: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, document: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
  };

  return (
    <Container className="mt-5 p-4 border rounded shadow">
      <h2 className="mb-4 text-center">Mess Reduction</h2>
      <Form onSubmit={handleSubmit}>
        
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Candidate's First Name</Form.Label>
              <Form.Control name="firstName" placeholder="Enter your first name" onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Candidate's Last Name</Form.Label>
              <Form.Control name="lastName" placeholder="Enter your last name" onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>College Roll Number</Form.Label>
              <Form.Control name="rollNumber" placeholder="Enter your college roll no" onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Branch</Form.Label>
              <Form.Select name="branch" onChange={handleChange}>
                <option>Select</option>
                <option>Computer Science</option>
                <option>Information Technology</option>
                <option>Mechanical</option>
                <option>Civil</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Session</Form.Label>
              <Form.Select name="session" onChange={handleChange}>
                <option>Select</option>
                <option>2022-2023</option>
                <option>2023-2024</option>
                <option>2024-2025</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Semester</Form.Label>
              <Form.Select name="semester" onChange={handleChange}>
                <option>Select</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Room Number</Form.Label>
              <Form.Control name="roomNumber" placeholder="Enter your room no" onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Date From</Form.Label>
              <Form.Control type="date" name="dateFrom" onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Date To</Form.Label>
              <Form.Control type="date" name="dateTo" onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Number of days</Form.Label>
              <Form.Control name="numberOfDays" placeholder="Enter number of days" onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Reason</Form.Label>
          <Form.Control as="textarea" rows={3} name="reason" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Upload Document (Optional)</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">Submit</Button>
      </Form>
    </Container>
  );
};

export default MessReductionForm;
