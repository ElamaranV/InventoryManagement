import React from 'react';
import './Dashboard.css';
import { FaShoppingCart, FaMoneyBillAlt, FaUserCircle } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Sidebar from '../Sidebar';
import Footer from '../Footer';

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
  return (
    <div className="dashboard-layout">
      <Sidebar />
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
          <h3>Total sells</h3>
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
          <h3>Recent Customers</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Elamaran</td>
                <td>ela@gmail.com</td>
                <td>23232323</td>
              </tr>
              <tr>
                <td>Athish</td>
                <td>athish@example.com</td>
                <td>987-654-3210</td>
              </tr>
              <tr>
                <td>Krish</td>
                <td>krish@example.com</td>
                <td>555-123-4567</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
