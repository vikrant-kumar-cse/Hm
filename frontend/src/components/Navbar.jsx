import { useState } from 'react'; // ✅ Import useState
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false); // ✅ Correct useState usage

    const isActive = (path) => location.pathname === path;

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <img src="./images/logo.png" alt="Logo" className="logo" />
                <div className="college-details">
                    <h2  className="college-name">Government Engineering College<br />West Champaran</h2>
                    <p className="college-tagline">
                        ( Dept. Science, Technology & Technical Education, Govt. Of Bihar )
                    </p> 
                </div>
            </div>

            {/* ✅ Mobile Menu Toggle Button */}
            <button style={{
                color:'black',
                marginLeft:'150px',
                gap:'10px',
            }} className="menu-toggle" onClick={toggleMenu}>
                ☰
            </button>

            {/* ✅ nav-links gets class 'active' when menu is open */}
            <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
                <li><Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link></li>
                <li><Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About us</Link></li>
                <li><Link to="/notice" className={`nav-link ${isActive('/notice') ? 'active' : ''}`}>Notice</Link></li>
                <li><Link to="/life" className={`nav-link ${isActive('/life') ? 'active' : ''}`}>Life@GecWc</Link></li>
                <li><Link to="/services" className={`nav-link ${isActive('/services') ? 'active' : ''}`}>Services</Link></li>
                {/* ✅ Move Login into nav-links for better layout */}
                <li className="dropdown">
  <button style={{
  border:'2px solid #1065b5ff',
  }} className="nav-link login-outline-btn dropdown-toggle">Login</button>
  <ul className="dropdown-menu">
    <li><a href="/login">User Login</a></li>
    <li><a href="/admin-login">Admin Login</a></li>
    <li><a href="/warden-login">Warden Login</a></li>
    <li><a href="/mess_manager-login">Mess Manager</a></li>
    <li><a href="/hostel-care-tacker-login">Care Taker</a></li>
    <li className="divider"></li>
    <li><a href="/login/more">More...</a></li>
  </ul>
</li>

            </ul>
        </nav>
    );
};

export default Navbar;
