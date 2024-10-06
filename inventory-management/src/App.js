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
import CustomerDetails from './Components/CustomerDetails/customerDetails';
import AddCustomer from './Components/addCustomer/AddCustomer';

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
            <Route path="/customerDetails" element={<CustomerDetails />} />
            <Route path="/AddCustomer" element={<AddCustomer />} />
            <Route path= "/ProductCategorization" element={<ProductCategorization/>} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
