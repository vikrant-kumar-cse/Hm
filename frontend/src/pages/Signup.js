import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import 'react-toastify/dist/ReactToastify.css';

const SendVerificationEmail = () => {
  const [email, setEmail] = useState('');

  const handleSendEmail = async () => {
    if (!email) {
      handleError("Please enter your email.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/auth/send-verification-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        handleSuccess(data.message || 'Verification email sent!');
      } else {
        handleError(data.message || 'Failed to send verification email.');
      }
    } catch (error) {
      handleError('Server error occurred.');
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Send Verification Email</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleSendEmail} style={styles.button}>Send Email</button>

      <ToastContainer />
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: '#fff',
    fontWeight: 'bold',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
  },
};

export default SendVerificationEmail;
