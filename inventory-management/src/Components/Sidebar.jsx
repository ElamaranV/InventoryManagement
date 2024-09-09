import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaPlus, FaListAlt, FaUsers } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h1 className="sidebar-title">Ea Inventory</h1>
      <hr />
      <NavLink to="/addproduct" className="sidebar-link"> {/* Updated path to /addproduct */}
        <FaPlus className="sidebar-icon" />
        Add Products
      </NavLink>
      <NavLink to="/productdetails" className="sidebar-link">
        <FaListAlt className="sidebar-icon" />
        Product Details
      </NavLink>
      <NavLink to="/customer-details" className="sidebar-link">
        <FaUsers className="sidebar-icon" />
        Customer Details
      </NavLink>
    </div>
  );
};

export default Sidebar;