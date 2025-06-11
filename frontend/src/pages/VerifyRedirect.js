import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function VerifyRedirect() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [form, setForm] = useState({
    name: "",
    password: "",
    mobile: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/auth/verify-and-signup", {
        token,
        ...form
      });

      // Display success toast
      toast.success("Signup Successful", {
        onClose: () => navigate("/login") // Redirect after successful signup
      });
    } catch (err) {
      console.error(err);
      toast.error("Error signing up");
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-gradient-to-r from-lightblue to-lightpink">
      <div className="bg-white p-5 rounded-3xl shadow-lg w-100" style={{ maxWidth: '450px' }}>
        <h1 className="text-center mb-5" style={{ fontSize: '2rem', fontWeight: '600', color: '#333' }}>Complete Your Signup</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="form-label" style={{ fontSize: '1rem', fontWeight: '500' }}>Full Name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter your name"
              onChange={handleChange}
              required
              className="form-control form-control-lg border-2 border-lightgray rounded-lg focus:outline-none focus:border-indigo-500 transition duration-300"
              style={{ padding: '12px', fontSize: '1.1rem' }}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label" style={{ fontSize: '1rem', fontWeight: '500' }}>Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
              className="form-control form-control-lg border-2 border-lightgray rounded-lg focus:outline-none focus:border-indigo-500 transition duration-300"
              style={{ padding: '12px', fontSize: '1.1rem' }}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="mobile" className="form-label" style={{ fontSize: '1rem', fontWeight: '500' }}>Mobile Number</label>
            <input
              type="text"
              name="mobile"
              id="mobile"
              placeholder="Enter your mobile"
              onChange={handleChange}
              required
              className="form-control form-control-lg border-2 border-lightgray rounded-lg focus:outline-none focus:border-indigo-500 transition duration-300"
              style={{ padding: '12px', fontSize: '1.1rem' }}
            />
          </div>
          <button
            type="submit"
            className="btn btn-lg btn-primary w-100 py-3 mt-3 rounded-lg shadow-sm hover:shadow-md transform hover:scale-105 transition duration-300"
            style={{ fontSize: '1.2rem' }}
          >
            Submit
          </button>
        </form>
      </div>
      {/* Toast Container for react-toastify */}
      <ToastContainer />
    </div>
  );
}
