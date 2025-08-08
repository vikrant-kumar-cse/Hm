import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
function Login() {

    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        const copyLoginInfo = { ...loginInfo };
        copyLoginInfo[name] = value;
        setLoginInfo(copyLoginInfo);
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return handleError('Email and password are required');
        }
        try {
            const url = "http://localhost:8080/auth/login";
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });
            const result = await response.json();
            const { success, message, jwtToken, name, error } = result;
            if (success) {
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                setTimeout(() => {
                    navigate('/User-Dashboard');
                }, 1000);
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
            console.log(result);
        } catch (err) {
            handleError(err);
        }
    }

    return (
        <div style={styles.container}>
            <Navbar />
            <div style={styles.Main}>
            <div style={styles.form}>
                <h2 style={styles.heading}>Welcome Back!</h2>
                <form onSubmit={handleLogin}>
                    <div style={styles.formGroup}>
                        <label htmlFor='email' style={styles.label}>Email</label>
                        <input
                            onChange={handleChange}
                            type='email'
                            name='email'
                            placeholder='Enter your email...'
                            value={loginInfo.email}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor='password' style={styles.label}>Password</label>
                        <input
                            onChange={handleChange}
                            type='password'
                            name='password'
                            placeholder='Enter your password...'
                            value={loginInfo.password}
                            style={styles.input}
                        />
                    </div>
                    <button type='submit' style={styles.button}>Login</button>
                </form>

                <div style={styles.links}>
                    <span style={styles.linkText}>Don't have an account? 
                        <Link to="/signup" style={styles.link}>Signup</Link>
                    </span>
                    <span style={styles.linkText}>Forgot your password? 
                        <Link to="/forgot-password" style={styles.link}>Forgot Password</Link>
                    </span>
                </div>
            </div>
            </div>
            <ToastContainer />
            <Footer />
        </div>
    )
}

const styles = {
    container: {
        height: '100vh',
        backgroundColor:'primary'
    },
    Main: {
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
    links: {
        textAlign: 'center',
        marginTop: '20px',
    },
    linkText: {
        display: 'block',
        fontSize: '14px',
        color: '#555',
    },
    link: {
        color: '#4CAF50',
        textDecoration: 'none',
    },
};

export default Login;
