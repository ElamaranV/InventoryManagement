import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import AddProducts from './Components/AddProducts'; // Ensure the component name is capitalized
import ProductDetails from './Components/ProductDetails';
import './Styles/App.css';
import Footer from './Components/Footer';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/addproduct" element={<AddProducts />} /> {/* Updated route path */}
        <Route path= "/productdetails" element={<ProductDetails/>}></Route>
      </Routes>
      <Footer/>
    </Router>
  );
};

export default App;