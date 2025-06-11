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

const AdminSidebar = () => {
  return (
    <div style={{ width: '100%' }}>
      <h4 className="text-white mb-4">🛠️ Admin Panel</h4>

      <Nav className="flex-column">
        <NavLink
          to="/admin-dashboard"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          📊 Administrator Dashboard
        </NavLink>

        <NavLink
          to="/admin-dashboard/user-details"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          👤 User Details (Editable)
        </NavLink>

        <NavLink
          to="/admin-dashboard/analytics"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          🏠 analytics (Approval/Rejection)
        </NavLink>

        <NavLink
          to="/admin-dashboard/admin-create"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
         👤 Assign Role (CRUD)
        </NavLink>

        <NavLink
          to="/admin-dashboard/admin-settings"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          Admin Setting (Editable)
        </NavLink>

        <NavLink
          to="/admin-dashboard/store-manager"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          🍽️ Manage Store(Approval/Rejection)
        </NavLink>


        <NavLink
          to="/admin-dashboard/grievance-support"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          💬 Student Grievance Support
        </NavLink>

        <NavLink
          to="/admin-dashboard/rules"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          📜 Rules & Regulations
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

export default AdminSidebar;
