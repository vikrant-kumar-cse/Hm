import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Mess_Red_Info.css';

const CareTackerMessRed = () => {
  const [messData, setMessData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modals, setModals] = useState({
    preview: { open: false, student: null, documentUrl: null },
  });

  useEffect(() => {
    const fetchMessData = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:8080/messdeduction/caretacker/requests');
        const result = await res.json();
        setMessData(Array.isArray(result) ? result : result.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessData();
  }, []);

  const updateModal = (type, updates) => {
    setModals(prev => ({ ...prev, [type]: { ...prev[type], ...updates } }));
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/messdeduction/approve-caretaker/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        setMessData(prev => prev.map(student =>
          student._id === id ? { ...student, status: 'Approved', caretakerApproval: true } : student
        ));
        alert("Approved successfully!");
      }
    } catch {
      alert("Approval failed.");
    }
  };

  const handlePreview = async (student) => {
    try {
      const res = await fetch(`http://localhost:8080/messdeduction/preview/${student._id}`);
      const data = await res.json();
      updateModal('preview', {
        open: true,
        student: data.data || student,
        documentUrl: data.data?.documentUrl || null
      });
    } catch {
      updateModal('preview', { open: true, student, documentUrl: null });
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN') : 'N/A';

  const getStatusBadge = (status) => {
    const map = {
      'Approved': 'badge bg-success',
      'Rejected': 'badge bg-danger',
      default: 'badge bg-warning text-dark'
    };
    return map[status] || map.default;
  };

  const renderStudentTable = (student, index) => {
    return (
      <table className="table table-bordered">
        <tbody>
          <tr>
            <td><strong>S No.</strong></td>
            <td>{index + 1}</td>
            <td rowSpan="7" className="text-center align-middle" style={{ width: '140px' }}>
              <div className="d-grid gap-2">
                <Button size="sm" color="primary" onClick={() => handlePreview(student)}>Preview</Button>
                <Button
  size="sm"
  color="success"
  disabled={student.caretakerApproval}
  onClick={() => handleApprove(student._id)}
>
  {student.caretakerApproval ? 'Approved' : 'Approve'}
</Button>

              </div>
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
    );
  };

  const { preview } = modals;

  return (
    <div className="container mt-4">
      <h3>CareTaker Mess Reduction Requests</h3>
      {loading ? (
        <div className="text-center mt-4"><div className="spinner-border" /></div>
      ) : messData.length === 0 ? (
        <div className="alert alert-info mt-4">No applications found.</div>
      ) : (
        messData.map((student, i) => (
          <div className="card mb-3" key={student._id || i}>
            <div className="card-body">
              {renderStudentTable(student, i)}
            </div>
          </div>
        ))
      )}

      {/* Preview Modal */}
      <Modal isOpen={preview.open} toggle={() => updateModal('preview', { open: false })} size="lg">
        <ModalHeader toggle={() => updateModal('preview', { open: false })}>
          Application Preview - {preview.student?.nameOfStudent}
        </ModalHeader>
        <ModalBody>
          {preview.student && (
            <>
              <p><strong>Roll No:</strong> {preview.student.rollNumber}</p>
              <p><strong>Reason:</strong> {preview.student.reason}</p>
              <p><strong>From:</strong> {formatDate(preview.student.fromDate)}</p>
              <p><strong>To:</strong> {formatDate(preview.student.toDate)}</p>
              <p><strong>Status:</strong> <span className={getStatusBadge(preview.student.status)}>{preview.student.status}</span></p>
              {preview.documentUrl ? (
                <div>
                  <p className="text-success">✅ Document Available</p>
                  <Button color="info" onClick={() => window.open(preview.documentUrl, '_blank')}>Open Document</Button>
                </div>
              ) : (
                <p className="text-warning">⚠️ No document uploaded</p>
              )}
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => updateModal('preview', { open: false })}>Close</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CareTackerMessRed;
