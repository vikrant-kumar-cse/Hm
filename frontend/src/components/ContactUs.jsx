import React from "react";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  CardImg,
  Row,
  Col,
} from "reactstrap";

import {
  FaPhoneAlt,
  FaEnvelope,
  FaUserShield,
  FaConciergeBell,
} from "react-icons/fa";

const ContactUs = () => {
  const cardStyle = {
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    margin: "15px auto",
    textAlign: "center",
    overflow: "hidden",
    padding: "15px",
    width: "280px",
    // keeps card width smaller on large screens
  };

  const iconStyle = {
    marginRight: "8px",
    color: "#0d6efd",
  };

  const titleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    margin: "8px 0",
    color: "#333",
  };

  const textStyle = {
    fontSize: "14px",
    margin: "4px 0",
    color: "#555",
  };

  // Responsive profile image
  const profileImgStyle = {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    margin: "15px auto 10px auto",
    display: "block",
    border: "3px solid #0d6efd",
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f9fafc", minHeight: "100vh" }}>
      <h2
        style={{
          textAlign: "center",
          marginBottom: "25px",
          fontWeight: "700",
          color: "#0d6efd",
          fontSize: "22px",
        }}
      >
        Contact Us
      </h2>

      <Row className="justify-content-center">
        {/* Warden */}
        <Col xs="12" sm="6" md="4" className="d-flex justify-content-center">
          <Card style={cardStyle}>
            <CardImg src="/black.jpg" alt="Warden" style={profileImgStyle} />
            <CardBody>
              <CardTitle style={titleStyle}>Warden</CardTitle>
              <CardText style={textStyle}>
                <FaPhoneAlt style={iconStyle} />
                <a href="tel:+919876543210">+91 9876543210</a>
              </CardText>
              <CardText style={textStyle}>
                <FaEnvelope style={iconStyle} />
                <a href="mailto:warden@college.com">warden@college.com</a>
              </CardText>
            </CardBody>
          </Card>
        </Col>

        {/* Caretaker */}
        <Col xs="12" sm="6" md="4" className="d-flex justify-content-center">
          <Card style={cardStyle}>
            <CardImg src="/white.jpg" alt="Caretaker" style={profileImgStyle} />
            <CardBody>
              <CardTitle style={titleStyle}>Caretaker</CardTitle>
              <CardText style={textStyle}>
                <FaPhoneAlt style={iconStyle} />
                <a href="tel:+919123456780">+91 9123456780</a>
              </CardText>
              <CardText style={textStyle}>
                <FaEnvelope style={iconStyle} />
                <a href="mailto:caretaker@college.com">caretaker@college.com</a>
              </CardText>
            </CardBody>
          </Card>
        </Col>

        {/* Mess Manager */}
        <Col xs="12" sm="6" md="4" className="d-flex justify-content-center">
          <Card style={cardStyle}>
            <CardImg src="/green.jpg" alt="Mess Manager" style={profileImgStyle} />
            <CardBody>
              <CardTitle style={titleStyle}>Mess Manager</CardTitle>
              <CardText style={textStyle}>
                <FaPhoneAlt style={iconStyle} />
                <a href="tel:+919988776655">+91 9988776655</a>
              </CardText>
              <CardText style={textStyle}>
                <FaEnvelope style={iconStyle} />
                <a href="mailto:messmanager@college.com">
                  messmanager@college.com
                </a>
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Emergency Section */}
      <h3
        style={{
          marginTop: "35px",
          marginBottom: "20px",
          textAlign: "center",
          fontWeight: "700",
          color: "#dc3545",
          fontSize: "20px",
        }}
      >
        🚨 Hostel Emergency Contacts
      </h3>
      <Row className="justify-content-center">
        {/* Security Incharge */}
        <Col xs="12" sm="6" className="d-flex justify-content-center">
          <Card style={cardStyle}>
            <CardBody>
              <CardTitle style={titleStyle}>
                <FaUserShield style={iconStyle} /> Security Incharge
              </CardTitle>
              <CardText style={textStyle}>
                <FaPhoneAlt style={iconStyle} />
                <a href="tel:+919111223344">+91 91112 23344</a>
              </CardText>
              <CardText style={textStyle}>
                <FaEnvelope style={iconStyle} />
                <a href="mailto:security@college.com">security@college.com</a>
              </CardText>
            </CardBody>
          </Card>
        </Col>

        {/* Hostel Reception */}
        <Col xs="12" sm="6" className="d-flex justify-content-center">
          <Card style={cardStyle}>
            <CardBody>
              <CardTitle style={titleStyle}>
                <FaConciergeBell style={iconStyle} /> Hostel Reception
              </CardTitle>
              <CardText style={textStyle}>
                <FaPhoneAlt style={iconStyle} />
                <a href="tel:+919222334455">+91 92223 34455</a>
              </CardText>
              <CardText style={textStyle}>
                <FaEnvelope style={iconStyle} />
                <a href="mailto:reception@college.com">reception@college.com</a>
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ContactUs;
