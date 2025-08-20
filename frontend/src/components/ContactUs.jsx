import React from "react";
import { Card, CardBody, CardTitle, CardText, Row, Col } from "reactstrap";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaUserShield,
  FaConciergeBell,
} from "react-icons/fa";

const ContactUs = () => {
  const cardStyle = {
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    margin: "20px",
    padding: "15px",
    textAlign: "center",
  };

  const iconStyle = {
    marginRight: "8px",
    color: "#0d6efd",
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "10px",
    color: "#333",
  };

  const textStyle = {
    fontSize: "15px",
    margin: "5px 0",
    color: "#555",
  };

  return (
    <div style={{ padding: "30px", backgroundColor: "#f9fafc", minHeight: "100vh" }}>
      <h2
        style={{
          textAlign: "center",
          marginBottom: "30px",
          fontWeight: "700",
          color: "#0d6efd",
        }}
      >
        Contact Us
      </h2>

      <Row>
        {/* Warden */}
        <Col md="4">
          <Card style={cardStyle}>
            <CardBody>
              <CardTitle style={titleStyle}>Warden</CardTitle>
              <CardText style={textStyle}>
                <FaPhoneAlt style={iconStyle} />{" "}
                <a href="tel:+919876543210">+91 9876543210</a>
              </CardText>
              <CardText style={textStyle}>
                <FaEnvelope style={iconStyle} />{" "}
                <a href="mailto:warden@college.com">warden@college.com</a>
              </CardText>
              <CardText>
                <a
                  href="https://facebook.com/warden.profile"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaFacebook style={iconStyle} /> Facebook
                </a>{" "}
                |{" "}
                <a
                  href="https://instagram.com/warden.profile"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaInstagram style={iconStyle} /> Instagram
                </a>
              </CardText>
            </CardBody>
          </Card>
        </Col>

        {/* Caretaker */}
        <Col md="4">
          <Card style={cardStyle}>
            <CardBody>
              <CardTitle style={titleStyle}>Caretaker</CardTitle>
              <CardText style={textStyle}>
                <FaPhoneAlt style={iconStyle} />{" "}
                <a href="tel:+919123456780">+91 9123456780</a>
              </CardText>
              <CardText style={textStyle}>
                <FaEnvelope style={iconStyle} />{" "}
                <a href="mailto:caretaker@college.com">caretaker@college.com</a>
              </CardText>
              <CardText>
                <a
                  href="https://facebook.com/caretaker.profile"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaFacebook style={iconStyle} /> Facebook
                </a>{" "}
                |{" "}
                <a
                  href="https://instagram.com/caretaker.profile"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaInstagram style={iconStyle} /> Instagram
                </a>
              </CardText>
            </CardBody>
          </Card>
        </Col>

        {/* Mess Manager */}
        <Col md="4">
          <Card style={cardStyle}>
            <CardBody>
              <CardTitle style={titleStyle}>Mess Manager</CardTitle>
              <CardText style={textStyle}>
                <FaPhoneAlt style={iconStyle} />{" "}
                <a href="tel:+919988776655">+91 9988776655</a>
              </CardText>
              <CardText style={textStyle}>
                <FaEnvelope style={iconStyle} />{" "}
                <a href="mailto:messmanager@college.com">
                  messmanager@college.com
                </a>
              </CardText>
              <CardText>
                <a
                  href="https://facebook.com/messmanager.profile"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaFacebook style={iconStyle} /> Facebook
                </a>{" "}
                |{" "}
                <a
                  href="https://instagram.com/messmanager.profile"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaInstagram style={iconStyle} /> Instagram
                </a>
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Emergency Section */}
      <h3
        style={{
          marginTop: "40px",
          marginBottom: "20px",
          textAlign: "center",
          fontWeight: "700",
          color: "#dc3545",
        }}
      >
        🚨 Hostel Emergency Contacts
      </h3>
      <Row>
        {/* Security Incharge */}
        <Col md="6">
          <Card style={cardStyle}>
            <CardBody>
              <CardTitle style={titleStyle}>
                <FaUserShield style={iconStyle} /> Security Incharge
              </CardTitle>
              <CardText style={textStyle}>
                <FaPhoneAlt style={iconStyle} />{" "}
                <a href="tel:+919111223344">+91 91112 23344</a>
              </CardText>
              <CardText style={textStyle}>
                <FaEnvelope style={iconStyle} />{" "}
                <a href="mailto:security@college.com">security@college.com</a>
              </CardText>
            </CardBody>
          </Card>
        </Col>

        {/* Hostel Reception */}
        <Col md="6">
          <Card style={cardStyle}>
            <CardBody>
              <CardTitle style={titleStyle}>
                <FaConciergeBell style={iconStyle} /> Hostel Reception
              </CardTitle>
              <CardText style={textStyle}>
                <FaPhoneAlt style={iconStyle} />{" "}
                <a href="tel:+919222334455">+91 92223 34455</a>
              </CardText>
              <CardText style={textStyle}>
                <FaEnvelope style={iconStyle} />{" "}
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
