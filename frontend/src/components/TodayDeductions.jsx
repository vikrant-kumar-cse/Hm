import React, { useEffect, useState } from "react";
import axios from "axios";

const TodayRangeRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("http://localhost:8080/messdeduction/all");
        const data = Array.isArray(res.data) ? res.data : [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const filtered = data.filter((req) => {
          const from = new Date(req.fromDate);
          const to = new Date(req.toDate);

          from.setHours(0, 0, 0, 0);
          to.setHours(0, 0, 0, 0);

          return today >= from && today <= to;
        });

        setRequests(filtered);
      } catch (err) {
        console.error("Error fetching requests:", err);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return <span className="badge bg-success">Approved</span>;
      case "Rejected":
        return <span className="badge bg-danger">Rejected</span>;
      case "Pending":
        return <span className="badge bg-warning text-dark">Pending</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 fs-5">Loading requests...</p>
      </div>
    );
  }

  return (
    <div
      className="container my-5 p-4 bg-light rounded shadow"
      style={{ maxWidth: "900px" }}
    >
      <h2 className="mb-4 text-center">📅 Mess Deductions Active Today</h2>

      {requests.length === 0 ? (
        <div className="alert alert-info text-center fs-5">
          No mess deduction requests active today.
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Roll No</th>
                  <th>Branch & Sem</th>
                  <th>Room No</th>
                  <th>From Date</th>
                  <th>To Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req._id}>
                    <td>{req.nameOfStudent}</td>
                    <td>{req.rollNumber}</td>
                    <td>{req.branchAndSem}</td>
                    <td>{req.roomNo}</td>
                    <td>{new Date(req.fromDate).toLocaleDateString()}</td>
                    <td>{new Date(req.toDate).toLocaleDateString()}</td>
                    <td>{req.reason}</td>
                    <td>{getStatusBadge(req.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-end fw-bold fs-5">
            Total Students Mess Deducted Today: {requests.length}
          </div>
        </>
      )}
    </div>
  );
};

export default TodayRangeRequests;
