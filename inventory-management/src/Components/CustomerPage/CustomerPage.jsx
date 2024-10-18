import React, { useEffect, useState } from "react";
import { ChevronDown, Menu, Plus, Search, Settings, User, Edit, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom"; 
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import axios from 'axios';

export default function CustomerPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/customers');
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  // Delete customer
  const deleteCustomer = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/customers/${id}`);
      setCustomers(customers.filter(customer => customer._id !== id)); // Remove from UI
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  // Edit customer
  const editCustomer = (id) => {
    navigate(`/edit-customer/${id}`); // Navigate to the edit customer form
  };

  // Handle search operation
  const filteredCustomers = customers.filter(customer =>
    customer.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="d-flex flex-column vh-100">
      <header className="d-flex align-items-center justify-content-between border-bottom p-3 bg-light">
        <button
          className="d-lg-none btn btn-outline-secondary"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h6" />
          <span className="sr-only">Toggle sidebar</span>
        </button>
        <div className="d-flex align-items-center">
          <h1 className="h4 mb-0">Contacts</h1>
          <div className="position-relative mx-3">
            <Search className="position-absolute" style={{ left: "10px", top: "10px" }} />
            <input
              className="form-control ps-5"
              type="search"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term
            />
          </div>
        </div>
        <div className="d-flex align-items-center">
          <button className="btn btn-link" title="Settings">
            <Settings className="h5" />
          </button>
          <button className="btn btn-link" title="User menu">
            <User className="h5" />
          </button>
        </div>
      </header>

      <div className="d-flex flex-grow-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main content */}
        <main className="flex-grow-1 overflow-auto p-4" style={{ marginLeft: '250px' }}>
          <div className="d-flex justify-content-between mb-4">
            <h2 className="h5">All Customers</h2>
            <div>
              <button className="btn btn-primary me-2" onClick={() => navigate('/add-customer')}>
                <Plus className="me-2" />
                New
              </button>
              <button className="btn btn-outline-secondary dropdown-toggle">
                Actions
                <ChevronDown className="ms-2" />
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>Name</th>
                  <th>Company Name</th>
                  <th>Email</th>
                  <th>Work Phone</th>
                  <th>Receivables</th>
                  <th>Payables</th>
                  <th>Actions</th> {/* Added Actions Column */}
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer, i) => (
                    <tr key={i}>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>{customer.displayName}</td>
                      <td>{customer.companyName}</td>
                      <td>{customer.email}</td>
                      <td>{customer.workPhone}</td>
                      <td>{customer.receivables}</td>
                      <td>{customer.payables}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => editCustomer(customer._id)} // Edit action
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteCustomer(customer._id)} // Delete action
                        >
                          <Trash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <Footer /> {/* Add Footer here */}
    </div>
  );
}
