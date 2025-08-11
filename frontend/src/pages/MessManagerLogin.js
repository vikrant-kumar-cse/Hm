import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

function MessManagerLogin() {
    const [loginInfo, setLoginInfo] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setLoginInfo({ ...loginInfo, [e.target.name]: e.target.value });
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) return handleError('All fields are required');

        try {
            const res = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginInfo)
            });

            const result = await res.json();
            const { success, message, jwtToken, name, role } = result;

            if (success && role === 'mess_manager') {
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                localStorage.setItem('role', role);
                setTimeout(() => {
                    navigate('/mess_manager-dashboard');
                }, 1000);
            } else {
                handleError('Only mess manager can access this login.');
            }

        } catch (err) {
            handleError(err.message || "Something went wrong");
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.form}>
                <h2 style={styles.heading}>Mess Manager Login</h2>
                <form onSubmit={handleLogin}>
                    <div style={styles.formGroup}>
                        <label htmlFor="email" style={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={loginInfo.email}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Enter your email"
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="password" style={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={loginInfo.password}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Enter your password"
                        />
                    </div>
                    <button type="submit" style={styles.button}>Login as Mess Manager</button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f6f9',
    },
    form: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
    },
    heading: {
        textAlign: 'center',
        marginBottom: '20px',
        color: '#333',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        fontSize: '14px',
        color: '#555',
    },
    input: {
        width: '100%',
        padding: '10px',
        marginTop: '5px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '14px',
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#4CAF50',
        border: 'none',
        borderRadius: '4px',
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '15px',
    },
};

export default MessManagerLogin;
