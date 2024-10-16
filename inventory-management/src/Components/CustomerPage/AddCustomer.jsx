// src/components/AddCustomer.jsx
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap'; // Import Bootstrap Modal
import Footer from '../Footer'; // Import Footer

export default function AddCustomer() {
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    companyName: '',
    email: '',
    workPhone: '',
    receivables: '',
    payables: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle customer submission (e.g., send to server or add to state)
    console.log('New Customer Details:', newCustomer);
    // Reset form
    setNewCustomer({
      name: '',
      companyName: '',
      email: '',
      workPhone: '',
      receivables: '',
      payables: '',
    });
  };

  return (
    <div className="container">
      <h1 className="mt-4">Add New Customer</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={newCustomer.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Company Name</label>
          <input
            type="text"
            name="companyName"
            className="form-control"
            value={newCustomer.companyName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={newCustomer.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Work Phone</label>
          <input
            type="text"
            name="workPhone"
            className="form-control"
            value={newCustomer.workPhone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Receivables</label>
          <input
            type="text"
            name="receivables"
            className="form-control"
            value={newCustomer.receivables}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Payables</label>
          <input
            type="text"
            name="payables"
            className="form-control"
            value={newCustomer.payables}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Customer</button>
      </form>
      <Footer /> {/* Include Footer */}
    </div>
  );
}
