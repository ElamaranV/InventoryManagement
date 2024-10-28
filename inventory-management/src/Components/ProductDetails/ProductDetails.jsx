import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import './ProductDetails.css';
import Sidebar from '../Sidebar';
import axios from 'axios';
import Footer from "../Footer";

const ProductDetails = () => {
    const [products, setProducts] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [vendorFilter, setVendorFilter] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchVendors();
    }, []);

    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products: ", error);
        }
    };

    const fetchVendors = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/vendors');
            setVendors(response.data);
        } catch (error) {
            console.error("Error fetching vendors: ", error);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCategoryFilter = (event) => {
        setCategoryFilter(event.target.value);
    };

    const handleVendorFilter = (event) => {
        setVendorFilter(event.target.value);
    };

    const handleEdit = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/products/${id}`);
            const productToEdit = response.data;
            console.log("Editing product:", productToEdit);
            // You could implement the edit functionality here
        } catch (error) {
            console.error("Error fetching product for edit: ", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await axios.delete(`http://localhost:5000/api/products/${id}`);
                fetchProducts();
            } catch (error) {
                console.error("Error deleting product: ", error);
            }
        }
    };

    const openModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedProduct(null);
        setIsModalOpen(false);
    };

    const filteredProducts = products.filter(product =>
        product.productTitle.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (categoryFilter === '' || product.category === categoryFilter) &&
        (vendorFilter === '' || product.vendor === vendorFilter)
    );

    const handleAddP = () => {
        navigate('/addProduct')
    }

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
                                <option value="Electronics">Electronics</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Home & Furniture">Home & Furniture</option>
                                <option value="Sports and Outdoors">Sports and Outdoors</option>
                                <option value="Health and wellness">Health and wellness</option>
                                <option value="Toy and Baby products">Toy and Baby products</option>
                                <option value="Books and Media">Books and Media</option>
                                <option value="Groceries">Groceries</option>
                            </select>

                            <select 
                                className="filter-dropdown"
                                value={vendorFilter}
                                onChange={handleVendorFilter}
                            >
                                <option value="">All Vendors</option>
                                {vendors.map(vendor => (
                                    <option key={vendor._id} value={vendor.vendorName}>
                                        {vendor.vendorName}
                                    </option>
                                ))}
                            </select>

                            <button className="add-product-button" onClick={handleAddP}>Add Product</button>
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
                                    <th>Vendor</th>
                                    <th>Published On</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map(product => (
                                    <tr key={product._id}>
                                        <td>
                                            <img 
                                                src={product.imageUrl || '/default-image.jpg'}
                                                alt={product.productTitle}
                                                className="product-image" 
                                            />
                                        </td>
                                        <td>
                                            <a href="#" onClick={() => openModal(product)} className="product-title-link">
                                                {product.productTitle}
                                            </a>
                                        </td>
                                        <td>Rs.{product.regularPrice.toFixed(2)}</td>
                                        <td>{product.category}</td>
                                        <td>{product.vendor}</td>
                                        <td>{new Date(product.publishedOn).toLocaleDateString()}</td> {/* Format date */}
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

            {isModalOpen && selectedProduct && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button onClick={closeModal} className="close-modal"><FaTimes /></button>
                        <h2 className={selectedProduct.openingStock < selectedProduct.reorderPoint ? 'red-highlight' : ''}>
                            {selectedProduct.productTitle}
                        </h2>
                        <img 
                            src={selectedProduct.imageUrl || '/default-image.jpg'}
                            alt={selectedProduct.productTitle}
                            className="modal-product-image" 
                        />
                        <p className={selectedProduct.openingStock < selectedProduct.reorderPoint ? 'red-highlight' : ''}>
                            <strong>Description:</strong> {selectedProduct.productDescription}
                        </p>
                        <p className={selectedProduct.openingStock < selectedProduct.reorderPoint ? 'red-highlight' : ''}>
                            <strong>Category:</strong> {selectedProduct.category}
                        </p>
                        <p className={selectedProduct.openingStock < selectedProduct.reorderPoint ? 'red-highlight' : ''}>
                            <strong>Vendor:</strong> {selectedProduct.vendor}
                        </p>
                        <p className={selectedProduct.openingStock < selectedProduct.reorderPoint ? 'red-highlight' : ''}>
                            <strong>Regular Price:</strong> Rs.{selectedProduct.regularPrice.toFixed(2)}
                        </p>
                        <p className={selectedProduct.openingStock < selectedProduct.reorderPoint ? 'red-highlight' : ''}>
                            <strong>Sale Price:</strong> Rs.{selectedProduct.salePrice ? selectedProduct.salePrice.toFixed(2) : 'N/A'}
                        </p>
                        <p className={selectedProduct.openingStock < selectedProduct.reorderPoint ? 'red-highlight' : ''}>
                            <strong>SKU:</strong> {selectedProduct.sku}
                        </p>
                        <p className={selectedProduct.openingStock < selectedProduct.reorderPoint ? 'red-highlight' : ''}>
                            <strong>Weight:</strong> {selectedProduct.weight}
                        </p>
                        <p className={selectedProduct.openingStock < selectedProduct.reorderPoint ? 'red-highlight' : ''}>
                            <strong>Dimensions:</strong> {selectedProduct.dimensions}
                        </p>
                        <p className={selectedProduct.openingStock < selectedProduct.reorderPoint ? 'red-highlight' : ''}>
                            <strong>Opening Stock:</strong> {selectedProduct.openingStock}
                        </p>
                        <p className={selectedProduct.openingStock < selectedProduct.reorderPoint ? 'red-highlight' : ''}>
                            <strong>Reorder Point:</strong> {selectedProduct.reorderPoint}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductDetails;