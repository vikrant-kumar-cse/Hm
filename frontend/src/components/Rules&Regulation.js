import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // This is necessary for JS components like accordion

const RulesAndRegulations = () => {
  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">🏠 Hostel & 🍽️ Mess Rules and Regulations</h2>

      <div className="accordion" id="rulesAccordion">

        {/* Hostel Rules */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingHostel">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseHostel" aria-expanded="true" aria-controls="collapseHostel">
              🏠 Hostel Rules
            </button>
          </h2>
          <div id="collapseHostel" className="accordion-collapse collapse show" aria-labelledby="headingHostel" data-bs-parent="#rulesAccordion">
            <div className="accordion-body">
              <ul>
                <li>Hostel allotment is done on a merit and availability basis.</li>
                <li>Only bonafide students of the college are allowed.</li>
                <li>Rooms must be kept clean and hygienic at all times.</li>
                <li>No shifting of rooms without permission.</li>
                <li>Defacing walls, doors or furniture is strictly prohibited.</li>
                <li>Hostel gate closes at 10:00 PM. Late entry requires permission.</li>
                <li>Prohibited items: alcohol, drugs, cigarettes, heaters, etc.</li>
                <li>Only registered guardians allowed during visiting hours.</li>
                <li>Ragging is strictly prohibited as per UGC norms.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mess Rules */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingMess">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMess" aria-expanded="false" aria-controls="collapseMess">
              🍽️ Mess Rules
            </button>
          </h2>
          <div id="collapseMess" className="accordion-collapse collapse" aria-labelledby="headingMess" data-bs-parent="#rulesAccordion">
            <div className="accordion-body">
              <ul>
                <li>Breakfast: 7:30 AM – 9:00 AM</li>
                <li>Lunch: 12:30 PM – 2:00 PM</li>
                <li>Dinner: 7:30 PM – 9:00 PM</li>
                <li>Maintain discipline and hygiene in the mess area.</li>
                <li>Food wastage is not tolerated.</li>
                <li>Entry into kitchen area is strictly prohibited.</li>
                <li>Fees are to be paid monthly/semester-wise in advance.</li>
                <li>No refund for skipped meals.</li>
                <li>Menu and feedback system is available weekly.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* General Guidelines */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingGeneral">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseGeneral" aria-expanded="false" aria-controls="collapseGeneral">
              📋 General Guidelines
            </button>
          </h2>
          <div id="collapseGeneral" className="accordion-collapse collapse" aria-labelledby="headingGeneral" data-bs-parent="#rulesAccordion">
            <div className="accordion-body">
              <ul>
                <li>Carry your student ID card at all times.</li>
                <li>Report medical emergencies to the warden immediately.</li>
                <li>Mobile phone use must not disturb others, especially at night.</li>
                <li>Decisions by the hostel committee are final and binding.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Violation & Penalty */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingPenalty">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePenalty" aria-expanded="false" aria-controls="collapsePenalty">
              ⚠️ Violation & Penalty
            </button>
          </h2>
          <div id="collapsePenalty" className="accordion-collapse collapse" aria-labelledby="headingPenalty" data-bs-parent="#rulesAccordion">
            <div className="accordion-body">
              <ul>
                <li>Violation of rules can lead to:
                  <ul>
                    <li>Warnings</li>
                    <li>Monetary fines</li>
                    <li>Suspension or expulsion from hostel</li>
                  </ul>
                </li>
                <li>Repeated violations will be reported to college authorities.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RulesAndRegulations;
