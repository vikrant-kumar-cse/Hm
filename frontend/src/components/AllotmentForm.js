import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Form, FormGroup, Label, Input, Row, Col, Button
} from 'reactstrap';
import './AllotmentForm.css'; // Optional external styling

function AllotmentForm() {
  const [step, setStep] = useState(1);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth > 768 : true
  );

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const initialFormData = {
    firstName: '',
    lastName: '',
    fatherName: '',
    motherName: '',
    dob: '',
    gender: '',
    pwd: '',
    address: '',
    district: '',
    state: '',
    country: '',
    email: '',          // ✅ Added for personal email
    mobile: '',
    altContact: '',
    contactFirstName: '',
    contactLastName: '',
    emergencyEmail: '', // ✅ Changed emergency email key to avoid conflict
    mobilee: '',
    rollNumber: '',
    regNumber: '',
    branch: '',
    semester: '',
    hostelName: '',
    roomNumber: '',
    photo: null,
    aadhar: null,
    regSlip: null,
    hostelSlip: null,
    messSlip: null
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { id, name, value, files, type } = e.target;
    if (type === 'file') {
      setFormData((prev) => ({
        ...prev,
        [id || name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id || name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const { id, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalData = new FormData();

    const personal = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      fatherName: formData.fatherName,
      motherName: formData.motherName,
      dob: formData.dob,
      gender: formData.gender,
      pwd: formData.pwd,
      address: formData.address,
      district: formData.district,
      state: formData.state,
      country: formData.country,
      email: formData.email,       // ✅ Send personal email
      mobile: formData.mobile,
      altContact: formData.altContact
    };

    const emergency = {
      contactFirstName: formData.contactFirstName,
      contactLastName: formData.contactLastName,
      email: formData.emergencyEmail,  // ✅ emergency email separated
      mobile: formData.mobilee
    };

    const academic = {
      rollNumber: formData.rollNumber,
      regNumber: formData.regNumber,
      branch: formData.branch,
      semester: formData.semester
    };

    const hostel = {
      hostelName: formData.hostelName,
      roomNumber: formData.roomNumber
    };

    finalData.append("data", JSON.stringify({ personal, emergency, academic, hostel }));

    if (formData.photo) finalData.append("photo", formData.photo);
    if (formData.aadhar) finalData.append("aadhar", formData.aadhar);
    if (formData.regSlip) finalData.append("regSlip", formData.regSlip);
    if (formData.hostelSlip) finalData.append("hostelSlip", formData.hostelSlip);
    if (formData.messSlip) finalData.append("messSlip", formData.messSlip);

    try {
      await axios.post('http://localhost:8080/hostel-allotment/allotment', finalData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Form submitted successfully!');

      // ✅ Reset form and step
      setFormData(initialFormData);
      setStep(1);

    } catch (error) {
      console.error('Form submission failed:', error.response?.data || error.message);
      alert('Failed to submit the form. ' + (error.response?.data?.error || error.message));
    }
  };

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formWrapperStyle = {
    marginLeft: isDesktop ? 'auto' : '0',
    marginRight: isDesktop ? 'auto' : '0',
    marginTop: '50px',
    maxWidth: '800px',
    padding: '0 15px',
  };

  const labelStyle = { fontWeight: 'bold' };

  return (
    <div className="form-wrapper" style={formWrapperStyle}>
      <h2 className="mb-4 text-center">Hostel Allotment Form</h2>
      <Form onSubmit={handleSubmit}>
        {step === 1 && (
          <>
            <h4>Personal Details</h4>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>Candidate's First Name</Label>
                  <Input type="text" id="firstName" value={formData.firstName} onChange={handleChange} placeholder="Enter your first name" required />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>Candidate's Last Name</Label>
                  <Input type="text" id="lastName" value={formData.lastName} onChange={handleChange} placeholder="Enter your last name" required />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>Father's Name</Label>
                  <Input type="text" id="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="Enter Father's Name" required />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>Mother's Name</Label>
                  <Input type="text" id="motherName" value={formData.motherName} onChange={handleChange} placeholder="Enter Mother's Name" required />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>Date of Birth</Label>
                  <Input type="date" id="dob" value={formData.dob} onChange={handleChange} required />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup tag="fieldset">
                  <Label style={labelStyle}>Gender</Label>
                  <div>
                    <FormGroup check inline>
                      <Label check><Input type="radio" name="gender" value="Male" checked={formData.gender === "Male"} onChange={handleChange} /> Male</Label>
                    </FormGroup>
                    <FormGroup check inline>
                      <Label check><Input type="radio" name="gender" value="Female" checked={formData.gender === "Female"} onChange={handleChange} /> Female</Label>
                    </FormGroup>
                    <FormGroup check inline>
                      <Label check><Input type="radio" name="gender" value="Others" checked={formData.gender === "Others"} onChange={handleChange} /> Others</Label>
                    </FormGroup>
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <FormGroup tag="fieldset">
              <Label style={labelStyle}>PWD</Label>
              <div>
                <FormGroup check inline>
                  <Label check><Input type="radio" name="pwd" value="YES" checked={formData.pwd === "YES"} onChange={handleChange} /> YES</Label>
                </FormGroup>
                <FormGroup check inline>
                  <Label check><Input type="radio" name="pwd" value="NO" checked={formData.pwd === "NO"} onChange={handleChange} /> NO</Label>
                </FormGroup>
              </div>
            </FormGroup>
            <h4>Permanent Address</h4>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>Address</Label>
                  <Input type="text" id="address" value={formData.address} onChange={handleChange} placeholder="Enter your Address" required />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>District</Label>
                  <Input type="text" id="district" value={formData.district} onChange={handleChange} placeholder="Enter District" required />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>State</Label>
                  <Input type="text" id="state" value={formData.state} onChange={handleChange} placeholder="Enter State" required />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>Country</Label>
                  <Input type="text" id="country" value={formData.country} onChange={handleChange} placeholder="Enter Country" required />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>Personal Email</Label> {/* ✅ New Email Field */}
                  <Input type="email" id="email" value={formData.email} onChange={handleChange} placeholder="Enter your Email" required />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>Mobile Number</Label>
                  <Input type="text" id="mobile" value={formData.mobile} onChange={handleChange} placeholder="Enter your Mobile Number" required />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>Alternate Contact Number</Label>
                  <Input type="text" id="altContact" value={formData.altContact} onChange={handleChange} placeholder="Enter your alternate contact number" required />
                </FormGroup>
              </Col>
            </Row>
            <Button color="primary" onClick={nextStep}>Next</Button>
          </>
        )}

        {step === 2 && (
          <>
            <h4>Emergency Details</h4>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>First Name</Label>
                  <Input type="text" id="contactFirstName" value={formData.contactFirstName} onChange={handleChange} placeholder="Enter first name" required />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>Last Name</Label>
                  <Input type="text" id="contactLastName" value={formData.contactLastName} onChange={handleChange} placeholder="Enter last name" required />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>Email Address</Label>
                  <Input type="email" id="emergencyEmail" value={formData.emergencyEmail} onChange={handleChange} placeholder="Enter Emergency Email" required />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>Mobile Number</Label>
                  <Input type="tel" id="mobilee" value={formData.mobilee} onChange={handleChange} placeholder="Enter Mobile Number" required />
                </FormGroup>
              </Col>
            </Row>
            <h4>Academic Details</h4>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>College Roll Number</Label>
                  <Input type="text" id="rollNumber" value={formData.rollNumber} onChange={handleChange} placeholder="Enter Roll Number" required />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>Registration Number</Label>
                  <Input type="text" id="regNumber" value={formData.regNumber} onChange={handleChange} placeholder="Enter Registration Number" required />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>Branch</Label>
                  <Input type="select" id="branch" value={formData.branch} onChange={handleChange} required>
                    <option value="">Select Branch</option>
                    <option>CSE(Cyber Security)</option>
                    <option>CSE(Core)</option>
                    <option>ECE</option>
                    <option>ME</option>
                    <option>EE</option>
                    <option>CE</option>
                    <option>VLSI</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>Semester</Label>
                  <Input type="select" id="semester" value={formData.semester} onChange={handleChange} required>
                    <option value="">Select Semester</option>
                    {[...Array(8)].map((_, i) => (
                      <option key={i + 1}>{i + 1}</option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <h4>Hostel Details</h4>
            <FormGroup check inline>
              <Label check>
                <Input
                  type="radio"
                  name="hostelName"
                  value="Boys"
                  checked={formData.hostelName === "Boys"}
                  onChange={handleChange}
                  required
                />
                Boy's Hostel
              </Label>
            </FormGroup>
            <FormGroup check inline>
              <Label check>
                <Input
                  type="radio"
                  name="hostelName"
                  value="Girls"
                  checked={formData.hostelName === "Girls"}
                  onChange={handleChange}
                />
                Girl's Hostel
              </Label>
            </FormGroup>
            <FormGroup>
              <Label style={labelStyle}>Room Number</Label>
              <Input type="text" id="roomNumber" value={formData.roomNumber} onChange={handleChange} placeholder="Enter Room Number" required />
            </FormGroup>
            <Button color="secondary" onClick={prevStep} className="me-2">Back</Button>
            <Button color="primary" onClick={nextStep}>Next</Button>
          </>
        )}

        {step === 3 && (
          <>
            <h4>Upload Documents</h4>
            <FormGroup>
              <Label style={labelStyle}>Passport Size photo</Label>
              <Input type="file" id="photo" onChange={handleFileChange} required />
            </FormGroup>
            <FormGroup>
              <Label style={labelStyle}>Aadhar Card</Label>
              <Input type="file" id="aadhar" onChange={handleFileChange} required />
            </FormGroup>
            <FormGroup>
              <Label style={labelStyle}>Registration Slip</Label>
              <Input type="file" id="regSlip" onChange={handleFileChange} required />
            </FormGroup>
            <FormGroup>
              <Label style={labelStyle}>Hostel Maintenance Slip</Label>
              <Input type="file" id="hostelSlip" onChange={handleFileChange} required />
            </FormGroup>
            <FormGroup>
              <Label style={labelStyle}>Mess Payment Slip</Label>
              <Input type="file" id="messSlip" onChange={handleFileChange} required />
            </FormGroup>
            <Button color="secondary" onClick={prevStep} className="me-2">Back</Button>
            <Button type="submit" color="success">Submit</Button>
          </>
        )}
      </Form>
    </div>
  );
}

export default AllotmentForm;
