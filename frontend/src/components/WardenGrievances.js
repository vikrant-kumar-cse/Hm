import React, { useEffect, useState } from "react";
import { Table, Button, Container, Row, Col, Spinner } from "reactstrap";

const WardenGrievances = () => {
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
        // Remove solved grievance from the page
        setGrievances((prev) => prev.filter((g) => g._id !== id));
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
        // Remove rejected grievance from the page
        setGrievances((prev) => prev.filter((g) => g._id !== id));
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
                    <td className="d-flex gap-2 flex-wrap">
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

export default WardenGrievances;
