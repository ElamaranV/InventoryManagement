import React from 'react';
import './customerDetails.css';
import { FaUserAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import Sidebar from '../Sidebar';

const CustomerDetails = () => {
  const customers = [
    { id: 1, name: 'John Doe', phone: '555-555-5555', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', phone: '555-123-4567', email: 'jane@example.com' },
    { id: 3, name: 'Sam Wilson', phone: '555-987-6543', email: 'sam@example.com' },
  ];

  return (
    <div>
      <Sidebar/>
    <div className="container mt-4 customer-details">

      <h2 className="text-center mb-4">Customer Details</h2>

      <div className="row">
        {customers.map((customer) => (
          <div className="col-md-4" key={customer.id}>
            <div className="card customer-card mb-4">
              <div className="card-body">
                <div className="customer-icon">
                  <FaUserAlt className="customer-icon-img" />
                </div>
                <h5 className="card-title">{customer.name}</h5>
                <p className="card-text">
                  <FaPhoneAlt /> {customer.phone}
                </p>
                <p className="card-text">
                  <FaEnvelope /> {customer.email}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-center mb-4 mt-5">Customer List</h3>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.name}</td>
                <td>{customer.phone}</td>
                <td>{customer.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default CustomerDetails;
