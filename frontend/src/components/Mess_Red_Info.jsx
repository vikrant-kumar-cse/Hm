import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Mess_Red_Info.css';

const MessReduction_info = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [messData, setMessData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [modals, setModals] = useState({
    preview: { open: false, student: null, documentUrl: null },
    history: { open: false, data: null, loading: false, error: null },
    reject: { open: false, student: null, reason: '', loading: false }
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch only Pending requests from backend
  useEffect(() => {
    const fetchMessData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/messdeduction/warden/requests');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        setMessData(result);  // backend returns only pending requests
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMessData();
  }, []);

  // Update modal state helper
  const updateModal = (type, updates) => {
    setModals(prev => ({ ...prev, [type]: { ...prev[type], ...updates } }));
  };

  // Handle approve action
  const handleApprove = async (studentId) => {
    try {
      const response = await fetch(`http://localhost:8080/messdeduction/approve/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        setMessData(prev => prev.filter(student => student._id !== studentId));
        alert('Application approved successfully!');
      } else {
        throw new Error('Failed to approve application');
      }
    } catch (err) {
      alert('Error approving application');
    }
  };

  // Handle reject with reason
  const handleRejectWithReason = async () => {
    const { student, reason } = modals.reject;
    if (!reason.trim()) return alert('Please provide a reason for rejection');

    try {
      updateModal('reject', { loading: true });
      const response = await fetch(`http://localhost:8080/messdeduction/reject/${student._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectionReason: reason.trim() })
      });
      
      if (response.ok) {
        setMessData(prev => prev.filter(s => s._id !== student._id));
        alert('Application rejected successfully!');
        updateModal('reject', { open: false, student: null, reason: '', loading: false });
      } else {
        throw new Error('Failed to reject application');
      }
    } catch (err) {
      alert('Error rejecting application');
      updateModal('reject', { loading: false });
    }
  };

  // Handle preview
  const handlePreview = async (student) => {
    try {
      const response = await fetch(`http://localhost:8080/messdeduction/preview/${student._id}`);
      const data = response.ok ? (await response.json()).data : student;
      updateModal('preview', { 
        open: true, 
        student: data, 
        documentUrl: data.documentUrl || null 
      });
    } catch (err) {
      updateModal('preview', { open: true, student, documentUrl: null });
    }
  };

  // Handle history
  const handleHistory = async (studentRoll) => {
    updateModal('history', { open: true, loading: true, error: null });
    try {
      const response = await fetch(`http://localhost:8080/messdeduction/${studentRoll}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      updateModal('history', { data: result, loading: false });
    } catch (err) {
      updateModal('history', { error: err.message, loading: false });
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString('en-IN') : 'N/A';
  };

  // Get status badge class
  const getStatusBadge = (status) => {
    const classes = {
      'Approved': 'badge-success',
      'Rejected': 'badge-danger',
      default: 'badge-warning'
    };
    return classes[status] || classes.default;
  };

  // Render history data
  const renderHistoryData = () => {
    const { data, loading, error } = modals.history;
    
    if (loading) return (
      <div className="text-center">
        <div className="spinner-border" role="status" />
        <p className="mt-2">Loading history...</p>
      </div>
    );

    if (error) return <div className="alert alert-danger"><strong>Error:</strong> {error}</div>;
    if (!data) return <div className="alert alert-info">No history data available.</div>;

    const dataToDisplay = data.data || data;
    
    if (Array.isArray(dataToDisplay)) {
      return (
        <div>
          <h6>Previous Applications ({dataToDisplay.length})</h6>
          {dataToDisplay.map((record, index) => (
            <div key={index} className="card mb-3">
              <div className="card-body">
                <h6 className="card-title">Application #{index + 1}</h6>
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>From Date:</strong> {formatDate(record.fromDate)}</p>
                    <p><strong>To Date:</strong> {formatDate(record.toDate)}</p>
                    <p><strong>Days:</strong> {record.numberOfDays || 'N/A'}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Reason:</strong> {record.reason || 'N/A'}</p>
                    <p><strong>Status:</strong> 
                      <span className={`badge ms-2 ${getStatusBadge(record.status)}`}>
                        {record.status || 'Pending'}
                      </span>
                    </p>
                    <p><strong>Applied On:</strong> {formatDate(record.createdAt || record.applicationDate)}</p>
                    {record.status === 'Rejected' && record.rejectionReason && (
                      <p><strong>Rejection Reason:</strong> <span className="text-danger">{record.rejectionReason}</span></p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div>
          <h6>Student History</h6>
          <pre className="bg-light p-3 rounded" style={{ maxHeight: '400px', overflow: 'auto' }}>
            {JSON.stringify(dataToDisplay, null, 2)}
          </pre>
        </div>
      );
    }
  };

  // Render student details table
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
      ['Status :-', <span className={`badge ${getStatusBadge(student.status)}`}>{student.status || 'Pending'}</span>]
    ];

    return (
      <table className="mess-table" key={student._id}>
        <tbody>
          {fields.map(([label, value], i) => (
            <tr key={i}>
              <td><strong>{label}</strong></td>
              <td>{value}</td>
              {i === 0 && (
                <td rowSpan="9" style={{ width: '150px' }} className="action-cell">
                  <Button color="primary" className="mb-2 w-100" onClick={() => handlePreview(student)}>Preview</Button>
                  <Button 
                    color="success" 
                    className="mb-2 w-100" 
                    onClick={() => handleApprove(student._id)}
                    disabled={student.status !== 'Pending'}
                  >
                    Approve
                  </Button>
                  <Button 
                    color="danger" 
                    className="mb-2 w-100" 
                    onClick={() => updateModal('reject', { open: true, student, reason: '' })}
                    disabled={student.status !== 'Pending'}
                  >
                    Reject
                  </Button>
                  <Button 
                    color="info" 
                    className="mb-2 w-100" 
                    onClick={() => handleHistory(student.rollNumber)}
                  >
                    Verify Request
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Render modal
  const renderModal = (type, { title, size = "", children, footer }) => (
    <Modal isOpen={modals[type].open} toggle={() => updateModal(type, { open: false })} size={size}>
      <ModalHeader toggle={() => updateModal(type, { open: false })}>{title}</ModalHeader>
      <ModalBody>{children}</ModalBody>
      <ModalFooter>{footer}</ModalFooter>
    </Modal>
  );

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
      <div className="spinner-border" role="status" />
    </div>
  );

  if (error) return <div className="alert alert-danger">Error loading data: {error}</div>;

  const { preview, history, reject } = modals;

  return (
    <div className={isMobile ? 'p-2 mobile-style' : 'p-4 desktop-style'}>
      <h3 className="mb-4">Student Mess Reductions (Pending Requests)</h3>
      
      {messData.length === 0 ? (
        <div className="alert alert-info">
          <p>No pending mess reduction applications found.</p>
        </div>
      ) : (
        messData.map((student, index) => (
          <div key={student._id || index} className="mess-card mb-4">
            {renderStudentTable(student, index)}
          </div>
        ))
      )}

      {/* Preview Modal */}
      {renderModal('preview', {
        title: `Application Preview - ${preview.student?.nameOfStudent}`,
        size: "lg",
        children: preview.student && (
          <>
            <div className="row">
              <div className="col-md-6">
                <h5>Student Details</h5>
                <table className="table table-bordered">
                  <tbody>
                    {[ 
                      ['Student ID:', preview.student.studentID],
                      ['Name:', preview.student.nameOfStudent],
                      ['Roll Number:', preview.student.rollNumber],
                      ['Branch & Sem:', preview.student.branchAndSem],
                      ['Room No:', preview.student.roomNo]
                    ].map(([label, value], i) => (
                      <tr key={i}>
                        <td><strong>{label}</strong></td>
                        <td>{value || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="col-md-6">
                <h5>Mess Reduction Details</h5>
                <table className="table table-bordered">
                  <tbody>
                    {[ 
                      ['From Date:', formatDate(preview.student.fromDate)],
                      ['To Date:', formatDate(preview.student.toDate)],
                      ['Number of Days:', preview.student.numberOfDays],
                      ['Reason:', preview.student.reason],
                      ['Status:', <span className={`badge ${getStatusBadge(preview.student.status)}`}>{preview.student.status || 'Pending'}</span>]
                    ].map(([label, value], i) => (
                      <tr key={i}>
                        <td><strong>{label}</strong></td>
                        <td>{value || 'N/A'}</td>
                      </tr>
                    ))}
                    {preview.student.status === 'Rejected' && preview.student.rejectionReason && (
                      <tr>
                        <td><strong>Rejection Reason:</strong></td>
                        <td className="text-danger">{preview.student.rejectionReason}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-3">
              <h5>Supporting Document</h5>
              <div className="text-center">
                {preview.documentUrl ? (
                  <>
                    <p className="text-success">✅ Document is available</p>
                    <Button color="info" onClick={() => window.open(preview.documentUrl, '_blank')}>📄 Open Document</Button>
                  </>
                ) : (
                  <p className="text-warning">⚠️ No document uploaded for this application</p>
                )}
              </div>
            </div>
          </>
        ),
        footer: (
          <>
            <Button color="secondary" onClick={() => updateModal('preview', { open: false })}>Close</Button>
            {preview.student && (
              <>
                <Button 
                  color="success" 
                  onClick={() => { handleApprove(preview.student._id); updateModal('preview', { open: false }); }}
                  disabled={preview.student.status !== 'Pending'}
                >
                  Approve
                </Button>
                <Button 
                  color="danger" 
                  onClick={() => { 
                    updateModal('reject', { open: true, student: preview.student, reason: '' }); 
                    updateModal('preview', { open: false }); 
                  }}
                  disabled={preview.student.status !== 'Pending'}
                >
                  Reject
                </Button>
              </>
            )}
          </>
        )
      })}

      {/* Rejection Modal */}
      {renderModal('reject', {
        title: `Reject Application - ${reject.student?.nameOfStudent}`,
        children: (
          <>
            <div className="mb-3">
              <p><strong>Student:</strong> {reject.student?.nameOfStudent}</p>
              <p><strong>Roll Number:</strong> {reject.student?.rollNumber}</p>
              <p><strong>From:</strong> {formatDate(reject.student?.fromDate)} <strong>To:</strong> {formatDate(reject.student?.toDate)}</p>
            </div>
            <Form>
              <FormGroup>
                <Label for="rejectionReason">Reason for Rejection *</Label>
                <Input
                  type="textarea"
                  id="rejectionReason"
                  value={reject.reason}
                  onChange={(e) => updateModal('reject', { reason: e.target.value })}
                  placeholder="Please provide a detailed reason for rejecting this application..."
                  rows="4"
                  maxLength="500"
                  disabled={reject.loading}
                />
                <small className="text-muted">{reject.reason.length}/500 characters</small>
              </FormGroup>
            </Form>
          </>
        ),
        footer: (
          <>
            <Button color="secondary" onClick={() => updateModal('reject', { open: false })} disabled={reject.loading}>Cancel</Button>
            <Button 
              color="danger" 
              onClick={handleRejectWithReason}
              disabled={!reject.reason.trim() || reject.loading}
            >
              {reject.loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Rejecting...
                </>
              ) : 'Confirm Rejection'}
            </Button>
          </>
        )
      })}

      {/* History Modal */}
      {renderModal('history', {
        title: "Student Previous History",
        size: "lg",
        children: renderHistoryData(),
        footer: <Button color="secondary" onClick={() => updateModal('history', { open: false })}>Close</Button>
      })}
    </div>
  );
};

export default MessReduction_info;
  




//done 