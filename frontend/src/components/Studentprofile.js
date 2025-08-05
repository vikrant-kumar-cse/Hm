import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const StudentProfile = () => {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("student_user");
    if (storedUser) {
      setStudent(JSON.parse(storedUser));
    }
  }, []);

  if (!student) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-warning">No student data available.</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <div className="row align-items-center">
          <div className="col-md-4 text-center">
            <img
              src={student.photo || "https://via.placeholder.com/150"}
              alt="Student"
              className="img-fluid rounded-circle border"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
          </div>
          <div className="col-md-8">
            <h3 className="mb-3">{student.name}</h3>
            <p><strong>Course:</strong> {student.course}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Phone:</strong> {student.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
