import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const linkStyle = {
  textDecoration: 'none',
  padding: '10px 15px',
  borderRadius: '8px',
  marginBottom: '8px',
  display: 'block',
  fontWeight: '500',
  color: 'white',
};

const activeStyle = {
  backgroundColor: '#2d3748',
  color: '#00d1b2',
};

const WardenSidebar = () => {
  return (
    <div style={{ width: '100%' }}>
      <h4 className="text-white mb-4">🏢 Warden Panel</h4>

      <Nav className="flex-column">
        <NavLink
          to="/warden-dashboard"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          📊 Warden Dashboard
        </NavLink>

        <NavLink
          to="/warden-dashboard/room-allocation"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          🛏️ Room Allocation
        </NavLink>

        <NavLink
          to="/warden-dashboard/student-records"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          👨‍🎓 Student Records
        </NavLink>

        <NavLink
          to="/warden-dashboard/attendance"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          📝 Attendance Monitoring
        </NavLink>

        <NavLink
          to="/warden-dashboard/leave-requests"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          📨 Leave Requests
        </NavLink>

        <NavLink
          to="/warden-dashboard/complaints"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          🗣️ Student Complaints
        </NavLink>

        <NavLink
          to="/warden-dashboard/hostel-rules"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          📋 Hostel Rules
        </NavLink>

        <NavLink
          to="/warden-dashboard/settings"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          ⚙️ Settings
        </NavLink>

        <NavLink
          to="/logout"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          🔓 Logout
        </NavLink>
      </Nav>
    </div>
  );
};

export default WardenSidebar;
