import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const SearchHistory = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/messdeduction/all")
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching all requests:", error);
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return <span className="badge bg-success">{status}</span>;
      case "Rejected":
        return <span className="badge bg-danger">{status}</span>;
      default:
        return <span className="badge bg-warning text-dark">{status}</span>;
    }
  };

  // Apply filter and search by roll number
  const filteredRequests = requests.filter((req) => {
    const matchesStatus = filter === "All" || req.status === filter;
    const matchesSearch = req.rollNumber
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p>Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📜 Mess Deduction Requests</h2>

      {/* Search + Filter Row */}
      <div className="row mb-3">
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search by Roll Number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-3 mb-2">
          <select
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredRequests.length === 0 ? (
        <div className="alert alert-info">No requests found.</div>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Student Name</th>
                <th>Roll Number</th>
                <th>Branch & Sem</th>
                <th>Room No</th>
                <th>Days</th>
                <th>From</th>
                <th>To</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req._id}>
                  <td>{req.nameOfStudent}</td>
                  <td>{req.rollNumber}</td>
                  <td>{req.branchAndSem}</td>
                  <td>{req.roomNo}</td>
                  <td>{req.numberOfDays}</td>
                  <td>{new Date(req.fromDate).toLocaleDateString()}</td>
                  <td>{new Date(req.toDate).toLocaleDateString()}</td>
                  <td>{req.reason}</td>
                  <td>{getStatusBadge(req.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SearchHistory;
