import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const CaretakerSidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-100">
      <h3 className="text-center mb-4">Caretaker Panel</h3>
      <ul className="nav flex-column w-100">
        <li className="nav-item mb-2">
          <Link to="/caretaker-dashboard" className={`nav-link ${isActive('/caretaker-dashboard') ? 'text-warning' : 'text-white'}`}>
            Dashboard
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/caretaker-rooms" className={`nav-link ${isActive('/caretaker-rooms') ? 'text-warning' : 'text-white'}`}>
            Manage Rooms
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/caretaker-students" className={`nav-link ${isActive('/caretaker-students') ? 'text-warning' : 'text-white'}`}>
            Manage Students
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default CaretakerSidebar;
