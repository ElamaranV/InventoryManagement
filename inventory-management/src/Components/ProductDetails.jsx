import React from "react";
import './ProductDetails.css'; 
import Sidebar from './Sidebar';

const ProductDetails = () => {
    return (
        <div className="ProductDetails-Container">
            <Sidebar />
            <div className="ProductDetails-Content">
                <h1>Products</h1>

                <div className="search-container">
                    <input 
                        type="text" 
                        placeholder="Search Products" 
                        className="search-input" 
                    />
                </div>

                <div className="filter-container">
                    <select className="filter-dropdown">
                        <option value="">Select Category</option>
                        <option value="category1">Category 1</option>
                        <option value="category2">Category 2</option>
                        <option value="category3">Category 3</option>
                    </select>

                    <select className="filter-dropdown">
                        <option value="">Select Vendor</option>
                        <option value="vendor1">Vendor 1</option>
                        <option value="vendor2">Vendor 2</option>
                        <option value="vendor3">Vendor 3</option>
                    </select>

                    <button className="add-product-button">Add Product</button>
                </div>

                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Product Image</th>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Tags</th>
                            <th>Vendors</th>
                            <th>Published On</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Sample data rows */}
                        <tr>
                            <td><img src="image_url" alt="Product" className="product-image" /></td>
                            <td>Sample Product 1</td>
                            <td>$10.00</td>
                            <td>Category 1</td>
                            <td>tag1, tag2</td>
                            <td>Vendor 1</td>
                            <td>2024-01-01</td>
                        </tr>
                        <tr>
                            <td><img src="image_url" alt="Product" className="product-image" /></td>
                            <td>Sample Product 2</td>
                            <td>$20.00</td>
                            <td>Category 2</td>
                            <td>tag3, tag4</td>
                            <td>Vendor 2</td>
                            <td>2024-02-01</td>
                        </tr>
                        {/* Add more rows as needed */}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProductDetails;