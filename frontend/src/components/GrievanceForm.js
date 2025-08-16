import React, { useState, useRef } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardBody,
  CardTitle,
} from 'reactstrap';

const GrievanceForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); // New email state
  const [branch, setBranch] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [hostel, setHostel] = useState('');
  const [floor, setFloor] = useState('');
  const [grievanceType, setGrievanceType] = useState('');
  const [problem, setProblem] = useState('');
  const [documentFile, setDocumentFile] = useState(null);

  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', name);
    data.append('email', email); // Append email to form data
    data.append('branch', branch);
    data.append('rollNumber', rollNumber);
    data.append('hostel', hostel);
    data.append('floor', floor);
    data.append('grievanceType', grievanceType);
    data.append('problem', problem);
    if (documentFile) data.append('document', documentFile);

    try {
      const res = await fetch('http://localhost:8080/grievance', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const result = await res.json();
      alert('✅ Grievance submitted successfully!');
      console.log(result);

      // Reset form fields
      setName('');
      setEmail('');
      setBranch('');
      setRollNumber('');
      setHostel('');
      setFloor('');
      setGrievanceType('');
      setProblem('');
      setDocumentFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (err) {
      console.error('❌ Error submitting grievance:', err);
      alert('Failed to submit grievance');
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', background: '#f5f5f5', padding: '20px' }}
    >
      <Card style={{ maxWidth: '500px', width: '100%', boxShadow: '0px 4px 12px rgba(0,0,0,0.1)' }}>
        <CardBody>
          <CardTitle tag="h2" className="text-center mb-4">📄 Submit Grievance</CardTitle>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="branch">Branch</Label>
              <Input
                type="select"
                id="branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                required
              >
                <option value="">-- Select Branch --</option>
                <option value="CSE">CSE</option>
                <option value="CSE Cyber Security">CSE Cyber Security</option>
                <option value="ECE">ECE</option>
                <option value="ECE (VLSI)">ECE (VLSI)</option>
                <option value="EE">EE</option>
                <option value="ME">ME</option>
                <option value="CE">CE</option>
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="rollNumber">Roll Number</Label>
              <Input
                type="text"
                id="rollNumber"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="hostel">Hostel</Label>
              <Input
                type="select"
                id="hostel"
                value={hostel}
                onChange={(e) => setHostel(e.target.value)}
                required
              >
                <option value="">-- Select Hostel --</option>
                <option value="Girls">Girls Hostel</option>
                <option value="Boys">Boys Hostel</option>
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="floor">Floor</Label>
              <Input
                type="select"
                id="floor"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                required
              >
                <option value="">-- Select Floor --</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="grievanceType">Grievance Type</Label>
              <Input
                type="select"
                id="grievanceType"
                value={grievanceType}
                onChange={(e) => setGrievanceType(e.target.value)}
                required
              >
                <option value="">-- Select Grievance Type --</option>
                <option value="Mess">Mess</option>
                <option value="Hostel">Hostel</option>
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="problem">Problem</Label>
              <Input
                type="textarea"
                id="problem"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="document">Upload Document (optional)</Label>
              <Input
                type="file"
                id="document"
                ref={fileInputRef}
                onChange={(e) => setDocumentFile(e.target.files[0])}
              />
            </FormGroup>

            <Button type="submit" color="primary" block>
              Submit
            </Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default GrievanceForm;
