import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaPlus, FaListAlt, FaUsers, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IoAddCircleSharp } from "react-icons/io5";
import { MdDashboard, MdCategory } from "react-icons/md";
import './Sidebar.css';
import Footer from './Footer';

const Sidebar = () => {
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const toggleProducts = () => {
    setIsProductsOpen(!isProductsOpen);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg sidebar">
        <img src="/logo.jpg" alt='logo' className='sidebar-logo' />
        <h1 className="navbar-brand sidebar-title urbanist-bold">Ea Inventory</h1>
        <div className="navbar-collapse">
          <ul className="navbar-nav flex-column">
            <li className="nav-item">
              <NavLink to="/dashboard" className="nav-link sidebar-link">
                <MdDashboard className="sidebar-icon" />
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <div className="nav-link sidebar-link" onClick={toggleProducts}>
                <FaListAlt className="sidebar-icon" />
                Products
                {isProductsOpen ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
              </div>
              {isProductsOpen && (
                <ul className="sub-menu">
                  <li>
                    <NavLink to="/addproduct" className="nav-link sidebar-link">
                      <FaPlus className="sidebar-icon" />
                      Add Products
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/productdetails" className="nav-link sidebar-link">
                      <FaListAlt className="sidebar-icon" />
                      Product Details
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/productcategorization" className="nav-link sidebar-link">
                      <MdCategory className="sidebar-icon" />
                      Product Categorization
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
            <li className="nav-item">
              <NavLink to="/customerDetails" className="nav-link sidebar-link">
                <FaUsers className="sidebar-icon" />
                Vendor Details
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/AddCustomer" className="nav-link sidebar-link">
                <IoAddCircleSharp className='sidebar-icon' />
                Add Customer
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;