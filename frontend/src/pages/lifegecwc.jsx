import React from "react";
import {
  FaBed,
  FaUtensils,
  FaWifi,
  FaBook,
  FaUsers,
  FaCalendarAlt,
  FaBicycle,
} from "react-icons/fa";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText } from "reactstrap";

const LifeAtGECWC = () => {
  const facilities = [
    { icon: <FaBed size={50} className="icon-color" />, title: "Comfortable Rooms", desc: "Well-furnished and spacious hostel rooms for a homely stay." },
    { icon: <FaUtensils size={50} className="icon-color" />, title: "Healthy Mess", desc: "Nutritious and hygienic meals served every day." },
    { icon: <FaWifi size={50} className="icon-color" />, title: "24x7 Wi-Fi", desc: "High-speed internet to support academics and leisure." },
    { icon: <FaBook size={50} className="icon-color" />, title: "Study Hall", desc: "Quiet and resourceful environment for learning." },
    { icon: <FaUsers size={50} className="icon-color" />, title: "Clubs & Activities", desc: "Engage in cultural, technical, and social events." },
    { icon: <FaCalendarAlt size={50} className="icon-color" />, title: "Events & Celebrations", desc: "Hostel festivals, sports meets, and special programs." },
    { icon: <FaBicycle size={50} className="icon-color" />, title: "Recreational Facilities", desc: "Sports, fitness, and fun spaces for relaxation." },
  ];

  return (
    <>
      <Navbar />
      <div style={{ 
        backgroundColor: "#f0f4f8",  // light professional background
        minHeight: "100vh", 
        paddingTop: "80px", 
        paddingBottom: "50px" 
      }}>
        
        {/* Header Section */}
        <Container className="text-center mb-5">
          <h1 className="display-4 fw-bold" style={{ color: "#2c3e50" }}>
            Life @ <span style={{ color: "#007bff" }}>GECWC</span>
          </h1>
          <p className="lead mx-auto" style={{ maxWidth: "700px", color: "#333", fontSize: "1.1rem" }}>
            Experience a vibrant hostel life filled with comfort, learning, and unforgettable memories.
          </p>
        </Container>

        {/* Facilities Grid */}
        <Container className="d-flex justify-content-center mb-5">
          <Row className="flex-nowrap justify-content-start" style={{ width: "70%" }}>
            {facilities.map((item, index) => (
              <Col key={index} style={{ minWidth: "250px", margin: "20px" }}>
                <Card className="hover-card text-center p-4 h-100 shadow-sm card-gradient">
                  <div className="mb-3">{item.icon}</div>
                  <CardTitle tag="h5" className="fw-bold mb-2" style={{ color: "#2c3e50" }}>{item.title}</CardTitle>
                  <CardText style={{ color: "#333", fontSize: "0.95rem" }}>{item.desc}</CardText>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>

        {/* Footer Message */}
        <Container className="text-center mt-5 mb-5">
          <h4 className="fw-bold" style={{ color: "#2c3e50", fontSize: "1.4rem" }}>
            Hostel life is not just about staying — it's about <span style={{ color: "#007bff" }}>growing together</span>.
          </h4>
        </Container>

        {/* Extra Styling */}
        <style>{`
          .icon-color {
            color: #007bff;
          }
          .hover-card {
            border-radius: 20px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            background: #ffffff;
          }
          .hover-card:hover {
            transform: translateY(-8px) scale(1.03);
            box-shadow: 0px 12px 25px rgba(0,0,0,0.2);
          }
          .card-gradient {
            background: linear-gradient(145deg, #ffffff, #f0f8ff);
          }
          @media (max-width: 992px) {
            .flex-nowrap {
              flex-wrap: wrap !important;
              justify-content: center !important;
            }
            .hover-card {
              margin-bottom: 20px;
            }
          }
        `}</style>
      </div>
      <Footer />
    </>
  );
};

export default LifeAtGECWC;
