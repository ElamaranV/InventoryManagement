// src/components/CustomerPage.jsx
import React from "react";
import { ChevronDown, Menu, Plus, Search, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Sidebar from "../Sidebar"; // Importing Sidebar
import Footer from "../Footer"; // Importing Footer

export default function CustomerPage() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

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
            <h2 className="h5">All Contacts</h2>
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
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>John Doe</td>
                    <td>Acme Inc</td>
                    <td>john@acme.com</td>
                    <td>(123) 456-7890</td>
                    <td>$1,000.00</td>
                    <td>$500.00</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <Footer /> {/* Add Footer here */}
    </div>
  );
}
