import React from "react";
import { Container, Card, CardBody } from "reactstrap";
import "./MessReductionTracking.css";

function MessReductionTracking() {
  const steps = [
    "Submission of Mess Reduction",
    "Warden’s Approval",
    "Mess Manager’s Approval",
    "Caretaker’s Approval",
    "Final Approval"
  ];

  return (
    <div className="tracking-view">
      <Container className="tracking-wrapper">
        <Card className="tracking-card shadow">
          <CardBody>
            <h3 className="tracking-title" style={{
                color:'black',
               
            }}>Mess Reduction Tracking</h3>
            <div className="timeline">
              {steps.map((step, index) => (
                <div key={index} className="timeline-step">
                  <div className="step-label">{step}</div>
                  <div className="step-indicator">
                    <div className={`circle step-${index}`} />
                    {index !== steps.length - 1 && <div className="line" />}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
}

export default MessReductionTracking;
