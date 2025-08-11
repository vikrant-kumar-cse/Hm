import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HostelAllotment_info.css';

const HostelAllotment_info = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [allotments, setAllotments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [docLinks, setDocLinks] = useState([]);
  const [previewStudent, setPreviewStudent] = useState('');
  const [message, setMessage] = useState('');

  // Rejection Modal States
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [currentRejectId, setCurrentRejectId] = useState(null);

  const BASE_URL = 'http://localhost:8080/hostel-allotment';

  // Handle resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch allotments - show only pending status
  const fetchAllotments = async () => {
    try {
      const response = await fetch(`${BASE_URL}/all`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();

      // Filter only pending allotments
      const pendingAllotments = result.filter(item => item.status === 'Pending');

      setAllotments(pendingAllotments);
    } catch (err) {
      console.error(err);
      setError('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllotments();
  }, []);

  // Show temporary message
  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  // Approve handler
  const handleApprove = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/approve/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to approve');
      showMessage('✅ Student Approved Successfully');
      await fetchAllotments();
    } catch (error) {
      alert('Error while approving');
    }
  };

  // Open reject modal
  const handleRejectClick = (id) => {
    setCurrentRejectId(id);
    setRejectionReason('');
    setRejectModalOpen(true);
  };

  // Confirm rejection
  const handleRejectConfirm = async () => {
    if (!rejectionReason.trim()) {
      alert('Please enter a rejection reason');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/reject/${currentRejectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectionReason }),
      });
      if (!res.ok) throw new Error('Failed to reject');
      showMessage('❌ Student Rejected Successfully');
      setRejectModalOpen(false);
      setRejectionReason('');
      setCurrentRejectId(null);
      await fetchAllotments();
    } catch (error) {
      alert('Error while rejecting');
    }
  };

  // Cancel rejection
  const handleRejectCancel = () => {
    setRejectModalOpen(false);
    setRejectionReason('');
    setCurrentRejectId(null);
  };

  // Preview handler
  const handlePreview = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/preview/${id}`);
      if (!res.ok) throw new Error('Preview failed');
      const data = await res.json();

      const documents = Object.entries(data.data)
        .filter(([key]) => key.endsWith('Url'))
        .map(([key, url]) => ({
          label: key.replace('Url', '').toUpperCase(),
          url,
        }));

      setPreviewStudent(`${data.data.personal?.firstName} ${data.data.personal?.lastName}`);
      setDocLinks(documents);
      setModalOpen(true);
    } catch (err) {
      alert('Error loading preview');
      console.error(err);
    }
  };

  return (
    <div className={isMobile ? 'p-2 mobile-style' : 'p-4 desktop-style'}>
      <h3 className="mb-4">Hostel Allotment</h3>

      {message && (
        <div className="alert alert-info text-center" role="alert">
          {message}
        </div>
      )}

      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && allotments.length === 0 && <p>No pending hostel allotment data found.</p>}

      {!loading && allotments.map((student, index) => (
        <div key={student._id} className="mess-card mb-4">
          <table className="mess-table">
            <tbody>
              <tr>
                <td><strong>S No.:</strong></td>
                <td>{index + 1}</td>
                <td rowSpan="6" style={{ width: '150px' }} className="action-cell">
                  <Button color="primary" className="mb-2 w-100" onClick={() => handlePreview(student._id)}>Preview</Button>
                  <Button color="success" className="mb-2 w-100" onClick={() => handleApprove(student._id)}>Approve</Button>
                  <Button color="danger" className="mb-2 w-100" onClick={() => handleRejectClick(student._id)}>Reject</Button>
                </td>
              </tr>
              <tr>
                <td><strong>Name:</strong></td>
                <td>{student.personal?.firstName} {student.personal?.lastName}</td>
              </tr>
              <tr>
                <td><strong>Branch:</strong></td>
                <td>{student.academic?.branch}</td>
              </tr>
              <tr>
                <td><strong>Reg No.:</strong></td>
                <td>{student.academic?.regNumber}</td>
              </tr>
              <tr>
                <td><strong>Hostel:</strong></td>
                <td>{student.hostel?.hostelName}</td>
              </tr>
              <tr>
                <td><strong>Room No.:</strong></td>
                <td>{student.hostel?.roomNumber}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}

      {/* Modal for Document Preview */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} centered size="lg">
        <ModalHeader toggle={() => setModalOpen(false)}>
          Document Preview - {previewStudent}
        </ModalHeader>
        <ModalBody>
          {docLinks.length > 0 ? (
            <ul>
              {docLinks.map((doc, idx) => (
                <li key={idx}>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">{doc.label}</a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No documents found.</p>
          )}
        </ModalBody>
      </Modal>

      {/* Modal for Rejection Reason */}
      <Modal isOpen={rejectModalOpen} toggle={handleRejectCancel} centered>
        <ModalHeader toggle={handleRejectCancel}>
          Reject Student Application
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="rejectionReason">Rejection Reason *</Label>
            <Input
              type="textarea"
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please enter the reason for rejection..."
              rows="4"
              required
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleRejectCancel}>
            Cancel
          </Button>
          <Button color="danger" onClick={handleRejectConfirm}>
            Confirm Rejection
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default HostelAllotment_info;
