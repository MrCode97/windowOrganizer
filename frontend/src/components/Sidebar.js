// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';


function Sidebar() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/calendar">Calendar</Link>
        </li>
        <li>
          <Link to="/default">Default Calendar</Link>
        </li>
      </ul>
      {/* Search field goes here */}
    </div>
  );
}

export default Sidebar;