import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const MessManagerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modals, setModals] = useState({
    preview: { open: false, student: null, documentUrl: null }
  });

  const BASE_URL = 'http://localhost:8080/messdeduction';

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(`${BASE_URL}/messmanager/requests`);
        if (!res.ok) throw new Error('Failed to fetch requests');
        const data = await res.json();

        // Filter requests: only wardenApproved = true & messManagerApproval = false
        const filtered = (Array.isArray(data) ? data : data.data || []).filter(
          r => r.wardenApproval === true && !r.messManagerApproval
        );

        setRequests(filtered);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const updateModal = (type, updates) => {
    setModals(prev => ({ ...prev, [type]: { ...prev[type], ...updates } }));
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/messmanager_approve/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) throw new Error('Approval failed');

      // Remove approved request from list immediately
      setRequests(prev => prev.filter(r => r._id !== id));

      alert('✅ Request Approved and removed from list');
    } catch {
      alert('❌ Error approving request');
    }
  };

  const handlePreview = async (student) => {
    try {
      const res = await fetch(`${BASE_URL}/preview/${student._id}`);
      const result = await res.json();
      updateModal('preview', {
        open: true,
        student: result.data || student,
        documentUrl: result.data?.documentUrl || null
      });
    } catch {
      updateModal('preview', { open: true, student, documentUrl: null });
    }
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString('en-IN') : 'N/A';

  const getStatusBadge = (status) => {
    const map = {
      Approved: 'badge-success',
      Rejected: 'badge-danger',
      default: 'badge-warning text-dark'
    };
    return map[status] || map.default;
  };

  const renderStudentTable = (student, index) => {
    const fields = [
      ['S No. :-', index + 1],
      ['Name :-', student.nameOfStudent || 'N/A'],
      ['Roll Number :-', student.rollNumber || 'N/A'],
      ['Branch & Sem :-', student.branchAndSem || 'N/A'],
      ['From Date :-', formatDate(student.fromDate)],
      ['To Date :-', formatDate(student.toDate)],
      ['Number of Days :-', student.numberOfDays || 'N/A'],
      ['Reason :-', student.reason || 'N/A'],
      ['Warden Approved :-', student.wardenApproval ? 'Yes' : 'No']
    ];

    return (
      <table className="table table-bordered" key={student._id}>
        <tbody>
          {fields.map(([label, value], i) => (
            <tr key={i}>
              <td><strong>{label}</strong></td>
              <td>{value}</td>
              {i === 0 && (
                <td rowSpan={fields.length} style={{ width: '160px' }} className="text-center align-middle">
                  <Button
                    color="primary"
                    className="mb-2 w-100"
                    onClick={() => handlePreview(student)}
                  >
                    Preview
                  </Button>
                  <Button
                    color="success"
                    className="w-100"
                    onClick={() => handleApprove(student._id)}
                  >
                    Approve
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  if (loading)
    return (
      <div className="text-center mt-4">
        <div className="spinner-border" role="status" />
      </div>
    );

  if (error)
    return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="p-4">
      <h3 className="mb-4">Mess Deduction Requests (Pending Mess Manager Approval)</h3>

      {requests.length === 0 ? (
        <div className="alert alert-info">No requests available for approval.</div>
      ) : (
        requests.map((student, index) => (
          <div
            key={student._id || index}
            className="mb-4 border rounded shadow-sm p-3"
          >
            {renderStudentTable(student, index)}
          </div>
        ))
      )}

      {/* Preview Modal */}
      <Modal
        isOpen={modals.preview.open}
        toggle={() => updateModal('preview', { open: false })}
        size="lg"
      >
        <ModalHeader toggle={() => updateModal('preview', { open: false })}>
          Application Preview - {modals.preview.student?.nameOfStudent}
        </ModalHeader>

        <ModalBody>
          {modals.preview.student && (
            <>
              <p><strong>Roll Number:</strong> {modals.preview.student.rollNumber}</p>
              <p><strong>Branch & Sem:</strong> {modals.preview.student.branchAndSem}</p>
              <p><strong>From:</strong> {formatDate(modals.preview.student.fromDate)}</p>
              <p><strong>To:</strong> {formatDate(modals.preview.student.toDate)}</p>
              <p><strong>Number of Days:</strong> {modals.preview.student.numberOfDays}</p>
              <p><strong>Reason:</strong> {modals.preview.student.reason}</p>
              <p><strong>Warden Approved:</strong> {modals.preview.student.wardenApproval ? 'Yes' : 'No'}</p>
              <p><strong>Status:</strong>{' '}
                <span className={`badge ${getStatusBadge(modals.preview.student.status)}`}>
                  {modals.preview.student.status || 'Pending'}
                </span>
              </p>

              <hr />

              {modals.preview.documentUrl ? (
                <div className="text-center">
                  <p className="text-success">✅ Document Uploaded</p>
                  <Button
                    color="info"
                    onClick={() => window.open(modals.preview.documentUrl, '_blank')}
                  >
                    📄 Open Document
                  </Button>
                </div>
              ) : (
                <p className="text-warning">⚠️ No document uploaded</p>
              )}
            </>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};

export default MessManagerRequests;
