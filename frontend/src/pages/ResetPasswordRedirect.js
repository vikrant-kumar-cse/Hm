import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ResetPasswordRedirect() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/auth/reset-password", {
        token,
        newPassword: form.newPassword
      });

      toast.success("Password Reset Successful", {
        onClose: () => navigate("/login") // Redirect to login
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to reset password");
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="bg-white p-5 rounded-3xl shadow-lg w-100" style={{ maxWidth: '450px' }}>
        <h1 className="text-center mb-5" style={{ fontSize: '2rem', fontWeight: '600', color: '#333' }}>Reset Your Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="form-label">New Password</label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              placeholder="Enter new password"
              onChange={handleChange}
              required
              className="form-control"
              style={{ padding: '12px', fontSize: '1.1rem' }}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm new password"
              onChange={handleChange}
              required
              className="form-control"
              style={{ padding: '12px', fontSize: '1.1rem' }}
            />
          </div>
          <button
            type="submit"
            className="btn btn-lg btn-success w-100 py-3 mt-3"
            style={{ fontSize: '1.2rem' }}
          >
            Reset Password
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}
