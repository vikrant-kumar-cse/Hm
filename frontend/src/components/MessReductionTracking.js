import React, { useEffect, useState } from "react";
import { Container, Card, CardBody, Spinner } from "reactstrap";
import "./MessReductionTracking.css";

function MessReductionTracking({ studentId }) {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  const steps = [
    "Submission of Mess Reduction",
    "Warden’s Approval",
    "Mess Manager’s Approval",
    "Caretaker’s Approval",
    "Final Approval"
  ];

  useEffect(() => {
    fetch(`http://localhost:8080/messdeduction/student/${studentId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Request not found");
        }
        return res.json();
      })
      .then((data) => {
        setRequest(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, [studentId]);

  function getCurrentStep(request) {
    if (request.status === "Rejected") return -1;
    if (!request.wardenApproval) return 0;
    if (!request.messManagerApproval) return 1;
    if (!request.caretackerApproval) return 2;
    return 4;
  }

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner color="primary" />
        <span className="ms-2">Loading tracker...</span>
      </div>
    );

  if (!request)
    return (
      <div className="text-center text-danger py-3">
        No request found for this student.
      </div>
    );

  const currentStep = getCurrentStep(request);

  return (
    <div className="tracking-view">
      <Container className="tracking-wrapper">
        <Card className="tracking-card shadow-sm">
          <CardBody>
            <h4 className="tracking-title text-center mb-4 text-primary fw-bold">
              🧾 Mess Reduction Request Status
            </h4>
            <div className="timeline">
              {steps.map((step, index) => (
                <div key={index} className="timeline-step">
                  <div className="step-indicator">
                    <div
                      className={`circle ${index <= currentStep ? "active" : ""}`}
                    />
                    {index !== steps.length - 1 && <div className="line" />}
                  </div>
                  <div
                    className={`step-label ${
                      index <= currentStep ? "text-success fw-semibold" : ""
                    }`}
                  >
                    {step}
                  </div>
                </div>
              ))}
            </div>

            {request.status === "Rejected" && (
              <div className="alert alert-danger mt-4" role="alert">
                ❌ <strong>Rejected:</strong> {request.rejectionReason}
              </div>
            )}
          </CardBody>
        </Card>
      </Container>
    </div>
  );
}

export default MessReductionTracking;
