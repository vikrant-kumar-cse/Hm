import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Mess_Red_Info.css';

const MessReduction_info = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const data = [
    {
      sno: '01',
      name: 'vivek tiwari ',
      uniqueId: '01',
      date: '01',
      days: '01',
      reason: 'Medical check up'
    },
    {
      sno: '02',
      name: 'vivek kumar ',
      uniqueId: '02',
      date: '02',
      days: '02',
      reason: 'Family Emergency'
    }
  ];

  return (
    <div className={isMobile ? 'p-2 mobile-style' : 'p-4 desktop-style'}>
      <h3 className="mb-4">Student Mess Reductions</h3>
      {data.map((student, index) => (
        <div key={index} className="mess-card mb-4">
          <table className="mess-table">
            <tbody>
              <tr>
                <td><strong>S No. :-</strong></td>
                <td>{student.sno}</td>
                <td rowSpan="6" style={{
                  width: '150px',
                }} className="action-cell">
                  <Button color="primary" className="mb-2 w-100">Preview</Button>
                  <Button color="success" className=" mb-2 w-100">Approve</Button>
                  <Button color="danger" className=" mb-2 w-100">Reject </Button>
                </td>
              </tr>
              <tr>
                <td><strong>Name :-</strong></td>
                <td>{student.name}</td>
              </tr>
              <tr>
                <td><strong>Unique Id :-</strong></td>
                <td>{student.uniqueId}</td>
              </tr>
              <tr>
                <td><strong>Date :-</strong></td>
                <td>{student.date}</td>
              </tr>
              <tr>
                <td><strong>Number of Days :-</strong></td>
                <td>{student.days}</td>
              </tr>
              <tr>
                <td><strong>Reason :-</strong></td>
                <td>{student.reason}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default MessReduction_info;