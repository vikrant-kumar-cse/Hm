import React from 'react';
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

const MessManagerSidebar = () => {
  return (
    <div style={{ width: '100%' }}>
      <h4 className="text-white mb-4">👨‍🍳 Mess Manager Panel</h4>

      <div className="flex-column">
        <NavLink
          to="/mess_manager-dashboard"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          📊 Dashboard
        </NavLink>

        <NavLink
          to="/mess_manager-dashboard/menu"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          🍽️ Manage Menu
        </NavLink>

        <NavLink
          to="/mess_manager-dashboard/attendance"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          📝 Mess Attendance
        </NavLink>

        <NavLink
          to="/mess_manager-dashboard/feedback"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          💬 Student Feedback
        </NavLink>

        <NavLink
          to="/mess_manager-dashboard/stock"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          📦 Inventory/Stock
        </NavLink>

        <NavLink
          to="/mess_manager-dashboard/settings"
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
      </div>
    </div>
  );
};

export default MessManagerSidebar;
