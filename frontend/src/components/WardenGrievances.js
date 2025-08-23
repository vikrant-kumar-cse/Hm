import React, { useEffect, useState } from "react";
import { Table, Button, Container, Row, Col, Spinner } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WardenGrievances = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null); // track which grievance is in process

  // Fetch grievances
  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:8080/grievance");
      const data = await res.json();
      setGrievances(data);
    } catch (err) {
      console.error("❌ Error fetching grievances:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Solved
  const handleSolved = async (id) => {
    setActionId(id);
    try {
      const res = await fetch(`http://localhost:8080/grievance/${id}/solve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setGrievances((prev) => prev.filter((g) => g._id !== id));
        toast.success("✅ Grievance marked as solved.");
      } else {
        toast.error("❌ Failed to update grievance.");
      }
    } catch (err) {
      console.error("Error solving grievance:", err);
      toast.error("❌ Error while solving grievance.");
    } finally {
      setActionId(null);
    }
  };

  // Handle Reject
  const handleReject = async (id) => {
    const reason = prompt("⚠️ Enter rejection reason:");
    if (!reason || reason.trim() === "") {
      toast.warning("Rejection cancelled. No reason provided.");
      return;
    }

    setActionId(id);
    try {
      const res = await fetch(`http://localhost:8080/grievance/${id}/reject`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });

      if (res.ok) {
        setGrievances((prev) => prev.filter((g) => g._id !== id));
        toast.error("❌ Grievance rejected.");
      } else {
        toast.error("❌ Failed to reject grievance.");
      }
    } catch (err) {
      console.error("Error rejecting grievance:", err);
      toast.error("❌ Error while rejecting grievance.");
    } finally {
      setActionId(null);
    }
  };

  if (loading)
    return (
      <Container className="text-center" style={{ marginTop: "50px" }}>
        <Spinner color="primary" />
        <p>⏳ Loading grievances...</p>
      </Container>
    );

  // Filter only grievances forwarded to Warden and still pending
  const wardenGrievances = grievances.filter(
    (g) => g.forwardedToWarden && g.status === "Pending"
  );

  return (
    <Container style={{ marginTop: "50px" }}>
      <Row>
        <Col>
          <h2 className="text-center mb-4">🏫 Grievances for Warden</h2>
          {wardenGrievances.length === 0 ? (
            <p className="text-center">No grievances forwarded to Warden 🎉</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Branch</th>
                  <th>Roll No</th>
                  <th>Hostel</th>
                  <th>Floor</th>
                  <th>Grievance Type</th>
                  <th>Problem</th>
                  <th>Document</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {wardenGrievances.map((g) => (
                  <tr key={g._id}>
                    <td>{g.name}</td>
                    <td>{g.branch}</td>
                    <td>{g.rollNumber}</td>
                    <td>{g.hostel}</td>
                    <td>{g.floor}</td>
                    <td>{g.grievanceType}</td>
                    <td>{g.problem}</td>
                    <td>
                      {g.document ? (
                        <a
                          href={`http://localhost:8080/${g.document}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          📎 View
                        </a>
                      ) : (
                        "No File"
                      )}
                    </td>
                    <td className="d-flex gap-2 flex-wrap justify-content-center">
                      {actionId === g._id ? (
                        <div className="red-spinner"></div>
                      ) : (
                        <>
                          <Button
                            color="success"
                            size="sm"
                            onClick={() => handleSolved(g._id)}
                          >
                            ✅ Solved
                          </Button>
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => handleReject(g._id)}
                          >
                            ❌ Reject
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>

      {/* Toast container */}
      <ToastContainer position="top-right" theme="colored" />

      {/* 🔴 Red loader style */}
      <style>{`
        .red-spinner {
          width: 30px;
          height: 30px;
          border: 4px solid transparent;
          border-top: 4px solid red;
          border-right: 4px solid red;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Container>
  );
};

export default WardenGrievances;
