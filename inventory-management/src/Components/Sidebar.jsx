import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaPlus, FaListAlt, FaUsers } from 'react-icons/fa';
import './Sidebar.css';
import Footer from './Footer';

const Sidebar = () => {
  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-light bg-light sidebar">
      <h1 className="navbar-brand sidebar-title">Ea Inventory</h1>
      <div className="navbar-collapse">
        <ul className="navbar-nav flex-column">
          <li className="nav-item">
            <NavLink to="/addproduct" className="nav-link sidebar-link">
              <FaPlus className="sidebar-icon" />
              Add Products
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/productdetails" className="nav-link sidebar-link">
              <FaListAlt className="sidebar-icon" />
              Product Details
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/customer-details" className="nav-link sidebar-link">
              <FaUsers className="sidebar-icon" />
              Customer Details
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
    </>
  );
};

export default Sidebar;
