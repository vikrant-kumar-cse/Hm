import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Form, FormGroup, Label, Input, Button, Row, Col,
} from 'reactstrap';
import './MessReduction.css';

const MessReduction = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    rollNo: '',
    branch: '',
    semester: '',
    session: '',
    roomNo: '',
    email: '',        // ✅ email added
    dateFrom: '',
    dateTo: '',
    numDays: '',
    reason: '',
    fileUpload: null,
  });

  // Handle field change
  const handleChange = (e) => {
    const { id, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: files ? files[0] : value,
    }));
  };

  // Auto-calculate number of days
  useEffect(() => {
    if (formData.dateFrom && formData.dateTo) {
      const from = new Date(formData.dateFrom);
      const to = new Date(formData.dateTo);
      const diff = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
      setFormData((prev) => ({
        ...prev,
        numDays: diff > 0 ? diff : 0,
      }));
    }
  }, [formData.dateFrom, formData.dateTo]);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalData = new FormData();
    finalData.append('nameOfStudent', `${formData.firstName} ${formData.lastName}`);
    finalData.append('rollNumber', formData.rollNo);
    finalData.append('branchAndSem', `${formData.branch}, ${formData.semester}`);
    finalData.append('roomNo', formData.roomNo);
    finalData.append('email', formData.email); // ✅ email included
    finalData.append('fromDate', formData.dateFrom);
    finalData.append('toDate', formData.dateTo);
    finalData.append('numberOfDays', formData.numDays);
    finalData.append('reason', formData.reason);
    if (formData.fileUpload) {
      finalData.append('document', formData.fileUpload); // MUST match backend key
    }

    try {
      await axios.post('http://localhost:8080/messdeduction/mess', finalData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Form submitted successfully!');

      // Reset form after successful submission
      setFormData({
        firstName: '',
        lastName: '',
        rollNo: '',
        branch: '',
        semester: '',
        session: '',
        roomNo: '',
        email: '',   // ✅ reset email
        dateFrom: '',
        dateTo: '',
        numDays: '',
        reason: '',
        fileUpload: null,
      });
    } catch (error) {
      console.error('Form submission failed:', error);
      alert('Failed to submit the form.');
    }
  };

  // Handle screen resize
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
      style={isDesktop
        ? { marginLeft: '180px', marginTop: '50px', maxWidth: '700px', height: 'auto' }
        : { marginLeft: '0', marginTop: '20px', padding: '0 15px', maxHeight: '90vh', overflowY: 'auto' }
      }
    >
      <div className="heading-wrapper">
        <h2 className="styled-heading">Mess Reduction Form</h2>
      </div>

      <Form className="mess-form" onSubmit={handleSubmit}>
        <FormGroup>
          <Row>
            <Col md={6} xs={12} className="mb-2">
              <Label for="firstName" className="fw-bold">First Name</Label>
              <Input type="text" id="firstName" value={formData.firstName} onChange={handleChange} required />
            </Col>
            <Col md={6} xs={12} className="mb-2">
              <Label for="lastName" className="fw-bold">Last Name</Label>
              <Input type="text" id="lastName" value={formData.lastName} onChange={handleChange} required />
            </Col>
          </Row>
        </FormGroup>

        <FormGroup>
          <Row>
            <Col md={6} xs={12} className="mb-2">
              <Label for="rollNo" className="fw-bold">Roll No</Label>
              <Input type="text" id="rollNo" value={formData.rollNo} onChange={handleChange} required />
            </Col>
            <Col md={6} xs={12} className="mb-2">
              <Label for="branch" className="fw-bold">Branch</Label>
              <Input type="select" id="branch" value={formData.branch} onChange={handleChange} required>
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
              <Input type="text" id="session" value={formData.session} onChange={handleChange} required />
            </Col>
            <Col md={6} xs={12} className="mb-2">
              <Label for="semester" className="fw-bold">Semester</Label>
              <Input type="select" id="semester" value={formData.semester} onChange={handleChange} required>
                <option value="" disabled>Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem}>{sem}</option>
                ))}
              </Input>
            </Col>
          </Row>
        </FormGroup>

        <FormGroup>
          <Label for="email" className="fw-bold">Email</Label> {/* ✅ new email input */}
          <Input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Row>
            <Col md={4} xs={12} className="mb-2">
              <Label for="roomNo" className="fw-bold">Room No</Label>
              <Input type="text" id="roomNo" value={formData.roomNo} onChange={handleChange} required />
            </Col>
            <Col md={4} xs={12} className="mb-2">
              <Label for="dateFrom" className="fw-bold">Date From</Label>
              <Input type="date" id="dateFrom" value={formData.dateFrom} onChange={handleChange} required />
            </Col>
            <Col md={4} xs={12} className="mb-2">
              <Label for="dateTo" className="fw-bold">Date To</Label>
              <Input type="date" id="dateTo" value={formData.dateTo} onChange={handleChange} required />
            </Col>
          </Row>
        </FormGroup>

        <FormGroup>
          <Label for="numDays" className="fw-bold">Number of Days</Label>
          <Input type="number" id="numDays" value={formData.numDays} readOnly />
        </FormGroup>

        <FormGroup>
          <Label for="reason" className="fw-bold">Reason</Label>
          <Input type="textarea" id="reason" value={formData.reason} onChange={handleChange} rows={4} required />
        </FormGroup>

        <FormGroup>
          <Label for="fileUpload" className="fw-bold">Upload Document (Optional)</Label>
          <Input type="file" id="fileUpload" onChange={handleChange} />
        </FormGroup>

        <Button color="primary" type="submit" className="submit-btn w-100">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default MessReduction;
