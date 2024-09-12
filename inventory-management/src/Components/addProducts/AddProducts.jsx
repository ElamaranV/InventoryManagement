import React from 'react';
import './AddProducts.css';
import Footer from '../Footer';
import Sidebar from '../Sidebar';

const AddProduct = () => {
  return (
    <div className="add-product-container">
      <div className='add-product-contents'>
        
        <Sidebar/>

        <div className="main-content">
          {/* Product Title and Description */}
          <div className="header">
            <h1>Add a product</h1>
            <p>Orders placed across your store</p>
          </div>
          <div className="product-info">
            <div className="product-title">
              <label>Product Title</label>
              <input type="text" placeholder="Write title here..." />
            </div>
            <div className="product-description">
              <label>Product Description</label>
              <textarea placeholder="Write a description here..."></textarea>
            </div>
          </div>

          {/* Display Images */}
          <div className="display-images">
            <label>Display Images</label>
            <div className="image-upload">
              <p>Drag your photo here or <span>Browse from device</span></p>
            </div>
          </div>

          {/* Organize Section */}
          <div className="organize">
            <h3>Organize</h3>
            <div className="category">
              <label>Category</label>
              <select>
                <option>Men's Clothing</option>
                <option>Women's Clothing</option>
              </select>
            </div>
            <div className="vendor">
              <label>Vendor</label>
              <select>
                <option>Men's Clothing</option>
                <option>Women's Clothing</option>
              </select>
            </div>
            <div className="collection">
              <label>Collection</label>
              <input type="text" placeholder="Collection" />
            </div>
            <div className="tags">
              <label>Tags</label>
              <input type="text" placeholder="Men's Clothing" />
            </div>
          </div>

          {/* Pricing Section */}
          <div className="pricing-section">
            <h3>Pricing</h3>
            <div className="pricing">
              <label>Regular Price</label>
              <input type="text" placeholder="$$$" />
              <label>Sale Price</label>
              <input type="text" placeholder="$$$" />
            </div>
          </div>

          {/* Variants Section */}
          <div className="variants">
            <h3>Variants</h3>
            <div className="variant-options">
              <div className="option">
                <label>Option 1</label>
                <select>
                  <option>Size</option>
                  <option>Color</option>
                </select>
              </div>
              <div className="option">
                <label>Option 2</label>
                <select>
                  <option>Size</option>
                  <option>Color</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save and Publish Section */}
          <div className="save-publish">
            <button className="discard-btn">Discard</button>
            <button className="save-draft-btn">Save Draft</button>
            <button className="publish-btn">Publish Product</button>
          </div>
        </div>
        
     
      </div>
    </div>
  );
};

export default AddProduct;
