import React, { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import './ProductDetails.css';
import Sidebar from '../Sidebar';
import axios from 'axios';
import Footer from "../Footer";

const ProductDetails = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [vendorFilter, setVendorFilter] = useState('');

    // Fetch products from the backend
    useEffect(() => {
        const fetchProducts = async () => {
           try {
            const response = await axios.get('http://localhost:3000/api/products');
            setProducts(response.data);
           } catch (error) {
               console.error("Error fetching products: ", error);
           }
        };

        fetchProducts();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCategoryFilter = (event) => {
        setCategoryFilter(event.target.value);
    };

    const handleVendorFilter = (event) => {
        setVendorFilter(event.target.value);
    };

    const handleEdit = (id) => {
        console.log(`Edit product with id: ${id}`);
    };

    const handleDelete = (id) => {
        console.log(`Delete product with id: ${id}`);
    };

    // Apply filters
    const filteredProducts = products.filter(product =>
        product.productTitle.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (categoryFilter === '' || product.category === categoryFilter) &&
        (vendorFilter === '' || product.vendor === vendorFilter)
    );

    return (
        <>
        <div className="product-details-container">
            <Sidebar />
            <div className="product-details-content">
                <h1 className="page-title">Products</h1>

                <div className="search-and-filter-container">
                    <div className="search-container">
                        <FaSearch className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Search Products" 
                            className="search-input" 
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>

                    <div className="filter-container">
                        <select 
                            className="filter-dropdown"
                            value={categoryFilter}
                            onChange={handleCategoryFilter}
                        >
                            <option value="">All Categories</option>
                            <option value="Category 1">Category 1</option>
                            <option value="Category 2">Category 2</option>
                        </select>

                        <select 
                            className="filter-dropdown"
                            value={vendorFilter}
                            onChange={handleVendorFilter}
                        >
                            <option value="">All Vendors</option>
                            <option value="Vendor 1">Vendor 1</option>
                            <option value="Vendor 2">Vendor 2</option>
                        </select>

                        <button className="add-product-button">Add Product</button>
                    </div>
                </div>

                <div className="table-container">
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Tags</th>
                                <th>Vendor</th>
                                <th>Published On</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product._id}> {/* Use product._id */}
                                    <td>
                                        <img 
                                            src={product.imageUrl || '/default-image.jpg'}  // Fallback image
                                            alt={product.productTitle}
                                            className="product-image" 
                                        />
                                    </td>
                                    <td>{product.productTitle}</td> {/* Ensure field matches */}
                                    <td>${product.regularPrice.toFixed(2)}</td>
                                    <td>{product.category}</td>
                                    {/* <td>{product.tags ? product.tags.join(', ') : 'No tags'}</td> */}
                                    <td>{product.vendor}</td>
                                    <td>{product.publishedOn}</td>
                                    <td>
                                        <button onClick={() => handleEdit(product._id)} className="action-button edit"><FaEdit /></button>
                                        <button onClick={() => handleDelete(product._id)} className="action-button delete"><FaTrash /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <Footer />
        </>
    );
};

export default ProductDetails;
