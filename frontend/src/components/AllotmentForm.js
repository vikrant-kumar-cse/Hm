import React, { useState, useEffect } from 'react';
import {
  Form, FormGroup, Label, Input, Row, Col, Button
} from 'reactstrap';
import './AllotmentForm.css'; // Optional external styling

function AllotmentForm() {
  const [step, setStep] = useState(1);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

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
      <Form>
        {step === 1 && (
          <>
            <h4>Personal Details</h4>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>Candidate's First Name</Label>
                  <Input type="text" placeholder="Enter your first name" required />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>Candidate's Last Name</Label>
                  <Input type="text" placeholder="Enter your last name" required />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>Father's Name</Label>
                  <Input type="text" placeholder="Enter Father's Name" required />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>Mother's Name</Label>
                  <Input type="text" placeholder="Enter Mother's Name" required />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>Date of Birth</Label>
                  <Input type="date" required />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup tag="fieldset">
                  <Label style={labelStyle}>Gender</Label>
                  <div>
                    <FormGroup check inline>
                      <Label check><Input type="radio" name="gender" required /> Male</Label>
                    </FormGroup>
                    <FormGroup check inline>
                      <Label check><Input type="radio" name="gender" /> Female</Label>
                    </FormGroup>
                    <FormGroup check inline>
                      <Label check><Input type="radio" name="gender" /> Others</Label>
                    </FormGroup>
                  </div>
                </FormGroup>
              </Col>
            </Row>

            <FormGroup tag="fieldset">
              <Label style={labelStyle}>PWD</Label>
              <div>
                <FormGroup check inline>
                  <Label check><Input type="radio" name="pwd" required /> YES</Label>
                </FormGroup>
                <FormGroup check inline>
                  <Label check><Input type="radio" name="pwd" /> NO</Label>
                </FormGroup>
              </div>
            </FormGroup>

            <h4>Permanent Address</h4>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>Address</Label>
                  <Input type="text" placeholder="Enter your Address" required />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>District</Label>
                  <Input type="text" placeholder="Enter District" required />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>State</Label>
                  <Input type="text" placeholder="Enter State" required />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>Country</Label>
                  <Input type="text" placeholder="Enter Country" required />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>Mobile Number</Label>
                  <Input type="text" placeholder="Enter your Mobile Number" required />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>Alternate Contact Number</Label>
                  <Input type="text" placeholder="Enter your alternate contact number" required />
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
                  <Input type="text" placeholder="Enter first name" required />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>Last Name</Label>
                  <Input type="text" placeholder="Enter last name" required />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>Email Address</Label>
                  <Input type="email" placeholder="Enter Email" required />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>Mobile Number</Label>
                  <Input type="tel" placeholder="Enter Mobile Number" required />
                </FormGroup>
              </Col>
            </Row>

            <h4>Academic Details</h4>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>College Roll Number</Label>
                  <Input type="text" placeholder="Enter Roll Number" required />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>Registration Number</Label>
                  <Input type="text" placeholder="Enter Registration Number" required />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label style={labelStyle}>Branch</Label>
                  <Input type="select" required>
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
                  <Input type="select" required>
                    <option value="">Select Semester</option>
                    {[...Array(8)].map((_, i) => (
                      <option key={i + 1}>{i + 1}</option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>

            <h4>Hostel Details</h4>
            <FormGroup tag="fieldset">
              <Label style={labelStyle}>Hostel Name</Label>
              <div>
                <FormGroup check inline>
                  <Label check><Input type="radio" name="hostel" required /> Boy's Hostel</Label>
                </FormGroup>
                <FormGroup check inline>
                  <Label check><Input type="radio" name="hostel" /> Girl's Hostel</Label>
                </FormGroup>
              </div>
            </FormGroup>

            <FormGroup>
              <Label style={labelStyle}>Room Number</Label>
              <Input type="text" placeholder="Enter Room Number" required />
            </FormGroup>

            <Button color="secondary" onClick={prevStep} className="me-2">Back</Button>
            <Button color="primary" onClick={nextStep}>Next</Button>
          </>
        )}

        {step === 3 && (
          <>
            <h4>Upload Documents</h4>
            {[
              'Passport Size Photo',
              'Aadhar Card',
              'Registration Slip',
              'Hostel Maintenance Slip',
              'Mess Payment Slip'
            ].map((doc, i) => (
              <FormGroup key={i}>
                <Label style={labelStyle}>{doc}</Label>
                <Input type="file" required />
              </FormGroup>
            ))}

            <Button color="secondary" onClick={prevStep} className="me-2">Back</Button>
            <Button color="success">Submit</Button>
          </>
        )}
      </Form>
    </div>
  );
}

export default AllotmentForm;