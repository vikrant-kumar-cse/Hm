import { Link } from 'react-router-dom';
import './Footer.css';
import {
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        {/* Left - Logo & Address */}
        <div className="footer-section logo-section">
          <img src="/images/logo.png" alt="GEC Logo" className="footer-logo" />
          <div>
            <h3 className="footer-college-name">
              Government Engineering College<br />West Champaran
            </h3>
            <p className="footer-tagline">
              ( Dept. Science, Technology & Technical Education, Govt. of Bihar )
            </p>
            <p className="footer-address">
              Government Engineering College, West Champaran, Bihar – 845450
            </p>
          </div>
        </div>

        {/* Middle - Navigation Links */}
        <div className="footer-section links-section">
          <ul  style={{
            marginTop:"50px"
          }} >
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About us</Link></li>
            <li><Link to="/notice">Notice</Link></li>
            <li><Link to="/life">Life@GecWc</Link></li>
            <li><Link to="/services">Services</Link></li>
          </ul>
        </div>

        {/* Right - Contact Info */}
        <div className="footer-section contact-section">
          <h4>Contact us</h4>
         
          <p><FaMapMarkerAlt /> Kumarbagh, Bettiah, Dist – West Champaran, Bihar – 845450</p>
        </div>
      </div>

      {/* Bottom - Copyright + Social */}
      <div className="footer-bottom">
        
        <div className="footer-social-icons">
          <Link to="#"><FaLinkedinIn /></Link>
          <Link to="#"><FaInstagram /></Link>
          <Link to="#"><FaFacebookF /></Link>
          <Link to="#"><FaTwitter /></Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
