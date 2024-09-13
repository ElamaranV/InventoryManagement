import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import AddProducts from './Components/addProducts/AddProducts'; // Ensure the component name is capitalized
import ProductDetails from './Components/ProductDetails/ProductDetails';
import './Styles/App.css';
import Footer from './Components/Footer';
import CustomerDetails from './Components/CustomerDetails/customerDetails';
import AddCustomer from './Components/addCustomer/AddCustomer';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/addproduct" element={<AddProducts />} /> {/* Updated route path */}
        <Route path= "/productdetails" element={<ProductDetails/>}></Route>
        <Route path="/customerDetails" element={<CustomerDetails/>}></Route>
        <Route path="/AddCustomer" element={<AddCustomer/>}></Route>
      </Routes>
    </Router>
  );
};

export default App;