import React, { useState } from 'react';
import './AddCustomer.css'; // Importing custom styles
import Sidebar from '../Sidebar';
import Footer from '../Footer';

const AddCustomer = () => {
  const [customer, setCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({
      ...customer,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Customer Info: ', customer);
    // Add your form submission logic here
  };

  return (
    <>
    <Sidebar></Sidebar>
    <div className="container add-customer-form">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4 mt-5">
            <h2 className="text-center mb-4">Add New Customer</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  value={customer.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  value={customer.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={customer.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  name="phone"
                  value={customer.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  className="form-control"
                  id="address"
                  name="address"
                  value={customer.address}
                  onChange={handleChange}
                  rows="3"
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-block mt-4">
                Add Customer
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <Footer></Footer>
    </>
  );
};

export default AddCustomer;
