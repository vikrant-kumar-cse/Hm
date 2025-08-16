import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Container,
  Row,
  Col,
  Spinner,
} from "reactstrap";

const GrievanceList = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);

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
    try {
      const res = await fetch(`http://localhost:8080/grievance/${id}/solve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setGrievances((prev) =>
          prev.map((g) =>
            g._id === id ? { ...g, status: "Solved" } : g
          )
        );
        alert("✅ Grievance marked as solved.");
      } else {
        alert("❌ Failed to update grievance.");
      }
    } catch (err) {
      console.error("Error solving grievance:", err);
    }
  };

  // Handle Reject
  const handleReject = async (id) => {
    const reason = prompt("⚠️ Enter rejection reason:");
    if (!reason || reason.trim() === "") {
      alert("Rejection cancelled. No reason provided.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/grievance/${id}/reject`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });

      if (res.ok) {
        setGrievances((prev) =>
          prev.map((g) =>
            g._id === id ? { ...g, status: "Rejected", rejectionReason: reason } : g
          )
        );
        alert("❌ Grievance rejected.");
      } else {
        alert("❌ Failed to reject grievance.");
      }
    } catch (err) {
      console.error("Error rejecting grievance:", err);
    }
  };

  if (loading)
    return (
      <Container className="text-center" style={{ marginTop: "50px" }}>
        <Spinner color="primary" />
        <p>⏳ Loading grievances...</p>
      </Container>
    );

  const pendingGrievances = grievances.filter((g) => g.status === "Pending");

  return (
    <Container style={{ marginTop: "50px" }}>
      <Row>
        <Col>
          <h2 className="text-center mb-4">📋 Pending Grievances</h2>
          {pendingGrievances.length === 0 ? (
            <p className="text-center">No pending grievances 🎉</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Branch</th>
                  <th>Roll No</th>
                  <th>Problem</th>
                  <th>Document</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingGrievances.map((g) => (
                  <tr key={g._id}>
                    <td>{g.name}</td>
                    <td>{g.branch}</td>
                    <td>{g.rollNumber}</td>
                    <td>{g.problem}</td>
                    <td>
                      {g.documentPath ? (
                        <a
                          href={`http://localhost:8080/${g.documentPath}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          📎 View
                        </a>
                      ) : (
                        "No File"
                      )}
                    </td>
                    <td className="d-flex gap-2">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default GrievanceList;
