import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const CaretakerPendingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({
    open: false,
    student: null,
    documentUrl: null
  });

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:8080/messdeduction/caretaker/pending');
        const data = await res.json();
        setRequests(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching caretaker pending requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, []);

  const toggleModal = () => {
    setModal({ open: false, student: null, documentUrl: null });
  };

  const handlePreview = async (student) => {
    try {
      const res = await fetch(`http://localhost:8080/messdeduction/preview/${student._id}`);
      const data = await res.json();
      setModal({
        open: true,
        student: data.data || student,
        documentUrl: data.data?.documentUrl || null
      });
    } catch {
      setModal({ open: true, student, documentUrl: null });
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/messdeduction/approve-caretaker/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) throw new Error('Approval failed');

      // Remove approved request from list to update UI
      setRequests((prev) => prev.filter((req) => req._id !== id));
      alert('✅ Request approved successfully');
    } catch {
      alert('❌ Error approving request');
    }
  };

  const formatDate = (date) => (date ? new Date(date).toLocaleDateString('en-IN') : 'N/A');

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return 'badge bg-success';
      case 'Rejected':
        return 'badge bg-danger';
      default:
        return 'badge bg-warning text-dark';
    }
  };

  if (loading) return <div className="text-center mt-4"><div className="spinner-border" role="status" /></div>;

  if (requests.length === 0) return <div className="alert alert-info mt-4">No pending requests to approve.</div>;

  return (
    <div className="container mt-4">
      <h3>Caretaker Pending Mess Deduction Requests</h3>
      {requests.map((student, idx) => (
        <div key={student._id} className="card mb-3 p-3">
          <table className="table table-bordered mb-0">
            <tbody>
              <tr>
                <td><strong>S No.</strong></td>
                <td>{idx + 1}</td>
                <td rowSpan="7" className="text-center align-middle" style={{ width: '140px' }}>
                  <Button color="primary" size="sm" className="mb-2" onClick={() => handlePreview(student)}>Preview</Button>
                  <Button color="success" size="sm" onClick={() => handleApprove(student._id)}>Approve</Button>
                </td>
              </tr>
              <tr><td><strong>Name</strong></td><td>{student.nameOfStudent}</td></tr>
              <tr><td><strong>Roll No</strong></td><td>{student.rollNumber}</td></tr>
              <tr><td><strong>Branch & Sem</strong></td><td>{student.branchAndSem}</td></tr>
              <tr><td><strong>From Date</strong></td><td>{formatDate(student.fromDate)}</td></tr>
              <tr><td><strong>To Date</strong></td><td>{formatDate(student.toDate)}</td></tr>
              <tr><td><strong>Status</strong></td><td><span className={getStatusBadge(student.status)}>{student.status || 'Pending'}</span></td></tr>
            </tbody>
          </table>
        </div>
      ))}

      {/* Preview Modal */}
      <Modal isOpen={modal.open} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>
          Application Preview - {modal.student?.nameOfStudent}
        </ModalHeader>
        <ModalBody>
          {modal.student && (
            <>
              <p><strong>Roll No:</strong> {modal.student.rollNumber}</p>
              <p><strong>Reason:</strong> {modal.student.reason}</p>
              <p><strong>From:</strong> {formatDate(modal.student.fromDate)}</p>
              <p><strong>To:</strong> {formatDate(modal.student.toDate)}</p>
              <p><strong>Status:</strong> <span className={getStatusBadge(modal.student.status)}>{modal.student.status || 'Pending'}</span></p>
              {modal.documentUrl ? (
                <div>
                  <p className="text-success">✅ Document Available</p>
                  <Button color="info" onClick={() => window.open(modal.documentUrl, '_blank')}>Open Document</Button>
                </div>
              ) : (
                <p className="text-warning">⚠️ No document uploaded</p>
              )}
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>Close</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CaretakerPendingRequests;
