import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import { AuthProvider } from './auth/AuthContext';
import Home from './Components/Home';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import AddProducts from './Components/addProducts/AddProducts'; 
import ProductDetails from './Components/ProductDetails/ProductDetails';
import ProductCategorization from './Components/ProductCategorization/productcategorization';
import './Styles/App.css';
import Footer from './Components/Footer';
import VendorDetails from './Components/VendorDetails/VendorDetails';
import AddVendor from './Components/AddVendor/AddVendor';
import CustomerPage from './Components/CustomerPage/CustomerPage';
import AddCustomer from './Components/CustomerPage/AddCustomer';
import SalesOrder from './Components/SalesOrder/SalesOrder'
import InvoiceTable from './Components/Invoice/InvoiceTable';

const App = () => {
  return (
    <AuthProvider>
    <div className="app-container"> {/* Main wrapper for sticky footer */}
      <Router>
        <div className="content"> {/* Content wrapper */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
            <Route path="/addproduct" element={<AddProducts />} />
            <Route path="/productdetails" element={<ProductDetails />} />
            <Route path="/VendorDetails" element={<VendorDetails />} />
            <Route path="/AddVendor" element={<AddVendor/>} />
            <Route path= "/ProductCategorization" element={<ProductCategorization/>} />
            <Route path='/customers' element={<CustomerPage/>} />
            <Route path='/add-customer' element={<AddCustomer/>} />
            <Route path="/edit-customer/:id" element={<AddCustomer />} />
            <Route path = "/SalesOrder" element ={<SalesOrder/>} />
            <Route path='/invoice' element = {<InvoiceTable/>} />
          </Routes>
        </div>
      </Router>
    </div>
    </AuthProvider>
  );
};

export default App;
