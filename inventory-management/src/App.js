import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

const App = () => {
  return (
    <div className="app-container"> {/* Main wrapper for sticky footer */}
      <Router>
        <div className="content"> {/* Content wrapper */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/addproduct" element={<AddProducts />} />
            <Route path="/productdetails" element={<ProductDetails />} />
            <Route path="/VendorDetails" element={<VendorDetails />} />
            <Route path="/AddVendor" element={<AddVendor/>} />
            <Route path= "/ProductCategorization" element={<ProductCategorization/>} />
            <Route path='/customers' element={<CustomerPage/>} />
            <Route path='/add-customer' element={<AddCustomer/>} />
            <Route path="/edit-customer/:id" element={<AddCustomer />} />

          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
