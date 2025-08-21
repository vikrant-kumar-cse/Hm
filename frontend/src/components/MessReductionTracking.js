import React, { useState } from 'react';

const BASE_URL = 'http://localhost:8080/messdeduction/status';

const StatusTracker = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRequest = async () => {
    if (!rollNumber.trim()) {
      setError('⚠️ Please enter a roll number');
      setRequest(null);
      return;
    }
    setLoading(true);
    setError(null);
    setRequest(null);

    try {
      const res = await fetch(`${BASE_URL}/${rollNumber.trim()}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('No request found for this roll number');
        } else {
          throw new Error('Failed to fetch request data');
        }
      }
      const data = await res.json();
      setRequest(data);
    } catch (err) {
      setError(err.message || 'Error fetching request data');
    } finally {
      setLoading(false);
    }
  };

  const stages = [
    { key: 'wardenApproval', label: 'Warden Approval' },
    { key: 'messManagerApproval', label: 'Mess Manager Approval' },
    { key: 'caretackerApproval', label: 'Caretaker Approval(Final Approval)' },
    // { key: 'finalApproval', label: 'Final Approval' },
  ];

  const isStageApproved = (key) => {
    if (key === 'finalApproval') return request?.finalApproval === true;
    return request ? request[key] === true : false;
  };

  const lastApprovedIndex = request
    ? stages.reduce((acc, stage, idx) => {
        if (isStageApproved(stage.key)) return idx;
        return acc;
      }, -1)
    : -1;

  return (
    <div
      style={{
        maxWidth: 600,
        margin: '40px auto',
        fontFamily: 'Arial, sans-serif',
        padding: '0 15px',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: 30 }}>
        Mess Reduction Status Tracker
      </h2>

      {/* Roll number input hamesha upar rahega */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Enter your roll number"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          style={{
            padding: 10,
            width: '70%',
            fontSize: 16,
            borderRadius: 4,
            border: '1px solid #ccc',
            marginRight: 8,
            boxSizing: 'border-box',
            maxWidth: 300,
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') fetchRequest();
          }}
        />
        <button
          onClick={fetchRequest}
          style={{
            padding: '10px 20px',
            fontSize: 16,
            borderRadius: 4,
            border: 'none',
            backgroundColor: '#007bff',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Track
        </button>
      </div>

      {loading && <p style={{ textAlign: 'center' }}>Loading status...</p>}

      {error && (
        <p style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>
          {error}
        </p>
      )}

      {/* Tracker yahi par show hoga (same layer) */}
      {request && (
        <>
          <div
            style={{
              marginBottom: 20,
              fontSize: 16,
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            Form Submission Status:{' '}
            <span
              style={{
                color: request.status === 'Pending' ? 'orange' : 'green',
              }}
            >
              {request.status === 'Pending'
                ? 'Submitted, Pending Approval'
                : request.status}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 30,
              marginTop: 30,
              marginBottom: 30,
              paddingLeft: 0,
            }}
          >
            {stages.map((stage, index) => {
              const approved = isStageApproved(stage.key);
              return (
                <div
                  key={stage.key}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      backgroundColor: approved ? 'green' : '#ccc',
                      color: 'white',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontWeight: 'bold',
                      fontSize: 24,
                      transition: 'background-color 0.3s ease',
                      marginBottom: 8,
                      boxShadow: approved
                        ? '0 0 8px 2px rgba(0, 128, 0, 0.7)'
                        : 'none',
                    }}
                  >
                    {approved
                      ? '✓'
                      : index === lastApprovedIndex + 1
                      ? '⏳'
                      : ''}
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: approved ? 'green' : '#888',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {stage.label}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default StatusTracker;
