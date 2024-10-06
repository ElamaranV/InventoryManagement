import React, { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import './ProductDetails.css';
import Sidebar from '../Sidebar';
import Footer from "../Footer";

const ProductDetails = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [vendorFilter, setVendorFilter] = useState('');

    // Simulated data fetching
    useEffect(() => {
        // In a real application, this would be an API call
        const fetchProducts = async () => {
            // Simulated API response
            const response = [
                { id: 1, name: 'Product 1', price: 10.00, category: 'Category 1', tags: ['tag1', 'tag2'], vendor: 'Vendor 1', publishedOn: '2024-01-01', imageUrl: 'https://via.placeholder.com/50' },
                { id: 2, name: 'Product 2', price: 20.00, category: 'Category 2', tags: ['tag3', 'tag4'], vendor: 'Vendor 2', publishedOn: '2024-02-01', imageUrl: 'https://via.placeholder.com/50' },
                // Add more products as needed
            ];
            setProducts(response);
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
        // Implement edit functionality
        console.log(`Edit product with id: ${id}`);
    };

    const handleDelete = (id) => {
        // Implement delete functionality
        console.log(`Delete product with id: ${id}`);
    };

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
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
                                <tr key={product.id}>
                                    <td><img src={product.imageUrl} alt={product.name} className="product-image" /></td>
                                    <td>{product.name}</td>
                                    <td>${product.price.toFixed(2)}</td>
                                    <td>{product.category}</td>
                                    <td>{product.tags.join(', ')}</td>
                                    <td>{product.vendor}</td>
                                    <td>{product.publishedOn}</td>
                                    <td>
                                        <button onClick={() => handleEdit(product.id)} className="action-button edit"><FaEdit /></button>
                                        <button onClick={() => handleDelete(product.id)} className="action-button delete"><FaTrash /></button>
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
}

export default ProductDetails;