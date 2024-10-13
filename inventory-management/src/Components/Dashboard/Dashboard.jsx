import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { FaShoppingCart, FaMoneyBillAlt, FaUserCircle } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import axios from 'axios';

const data = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 2000 },
  { name: 'Apr', sales: 2780 },
  { name: 'May', sales: 1890 },
  { name: 'Jun', sales: 2390 },
  { name: 'Jul', sales: 3490 },
];

const Dashboard = () => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/vendors'); // Change to your API endpoint
        setVendors(response.data.slice(0, 3)); // Fetch the top 3 recent vendors
      } catch (error) {
        console.error('Error fetching vendor data:', error);
      }
    };
    
    fetchVendors();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar/>
      <div className="dashboard-content">
        <h2>Ecommerce Dashboard</h2>
        <p className="dashboard-subtitle">Here’s what’s going on at your business right now</p>
        <div className="dashboard-cards">
          <div className="card">
            <FaShoppingCart className="card-icon" />
            <h3>57 new orders</h3>
            <p>Awaiting processing</p>
          </div>
          <div className="card">
            <FaMoneyBillAlt className="card-icon" />
            <h3>5 orders</h3>
            <p>On hold</p>
          </div>
          <div className="card">
            <FaUserCircle className="card-icon" />
            <h3>15 products</h3>
            <p>Out of stock</p>
          </div>
        </div>
        
        <div className="dashboard-chart">
          <h3>Total Sales</h3>
          <p>Payment received across all channels</p>
          <LineChart width={976} height={400} data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#8884d8" />
          </LineChart>
        </div>

        <div className="dashboard-recent">
  <h3 className="mb-4">Recent Vendors</h3>
  <div className="table-responsive">
    <table className="table table-striped table-hover table-bordered">
      <thead className="thead-dark">
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
        </tr>
      </thead>
      <tbody>
        {vendors.map(vendor => (
          <tr key={vendor._id}>
            <td>{vendor.vendorName}</td>
            <td>{vendor.email}</td>
            <td>{vendor.phoneNumber}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

      </div>
    </div>
  );
};

export default Dashboard;
