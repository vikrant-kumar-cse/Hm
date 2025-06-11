import React, { useState, useEffect } from 'react';
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
} from 'reactstrap';
import './MessReduction.css';

const MessReduction = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="form-wrapper"
      style={
        isDesktop
          ? {
              marginLeft: '180px',
              marginTop: '50px',
              maxWidth: '700px',
              height: 'auto',
            }
          : {
              marginLeft: '0',
              marginTop: '20px',
              padding: '0 15px',
              maxHeight: '90vh',
              overflowY: 'auto',
            }
      }
    >
      <div className="heading-wrapper">
        <h2 className="styled-heading"> Mess Reduction Form </h2>
      </div>

      <Form className="mess-form">
        <FormGroup>
          <Row>
            <Col md={6} xs={12} className="mb-2">
              <Label for="firstName" className="fw-bold">First Name</Label>
              <Input type="text" id="firstName" placeholder="Enter your first name" required />
            </Col>
            <Col md={6} xs={12} className="mb-2">
              <Label for="lastName" className="fw-bold">Last Name</Label>
              <Input type="text" id="lastName" placeholder="Enter your last name" required />
            </Col>
          </Row>
        </FormGroup>

        <FormGroup>
          <Row>
            <Col md={6} xs={12} className="mb-2">
              <Label for="rollNo" className="fw-bold">Roll No</Label>
              <Input type="text" id="rollNo" placeholder="Enter your college roll no" required />
            </Col>
            <Col md={6} xs={12} className="mb-2">
              <Label for="branch" className="fw-bold">Branch</Label>
              <Input type="select" id="branch" defaultValue="" required>
                <option value="" disabled>Select Branch</option>
                <option>CSE(Core)</option>
                <option>CSE (Cyber Security)</option>
                <option>ECE</option>
                <option>EE</option>
                <option>ME</option>
                <option>CE</option>
                <option>VLSI</option>
              </Input>
            </Col>
          </Row>
        </FormGroup>

        <FormGroup>
          <Row>
            <Col md={6} xs={12} className="mb-2">
              <Label for="session" className="fw-bold">Session</Label>
              <Input type="text" id="session" placeholder="Enter your Session" required />
            </Col>
            <Col md={6} xs={12} className="mb-2">
              <Label for="semester" className="fw-bold">Semester</Label>
              <Input type="select" id="semester" defaultValue="" required>
                <option value="" disabled>Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem}>{sem}</option>
                ))}
              </Input>
            </Col>
          </Row>
        </FormGroup>

        <FormGroup>
          <Row>
            <Col md={4} xs={12} className="mb-2">
              <Label for="roomNo" className="fw-bold">Room No</Label>
              <Input type="text" id="roomNo" placeholder="Enter your room no" required />
            </Col>
            <Col md={4} xs={12} className="mb-2">
              <Label for="dateFrom" className="fw-bold">Date From</Label>
              <Input type="date" id="dateFrom" required />
            </Col>
            <Col md={4} xs={12} className="mb-2">
              <Label for="dateTo" className="fw-bold">Date To</Label>
              <Input type="date" id="dateTo" required />
            </Col>
          </Row>
        </FormGroup>

        <FormGroup>
          <Label for="numDays" className="fw-bold">Number of Days</Label>
          <Input type="number" id="numDays" placeholder="Number of days" required />
        </FormGroup>

        <FormGroup>
          <Label for="reason" className="fw-bold">Reason</Label>
          <Input type="textarea" id="reason" placeholder="Reason" rows={4} required />
        </FormGroup>

        <FormGroup>
          <Label for="fileUpload" className="fw-bold">Upload Document (Optional)</Label>
          <Input type="file" id="fileUpload" />
        </FormGroup>

        <Button color="primary" type="submit" className="submit-btn w-100">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default MessReduction;
