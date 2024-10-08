import React, { useState } from 'react';
import './AddProducts.css';
import Footer from '../Footer';
import Sidebar from '../Sidebar';
import axios from 'axios';

const AddProduct = () => {
  // State for form fields
  const [productTitle, setProductTitle] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [category, setCategory] = useState('');
  const [vendor, setVendor] = useState('');
  const [collection, setCollection] = useState('');
  const [tags, setTags] = useState('');
  const [regularPrice, setRegularPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [variantOption1, setVariantOption1] = useState('');
  const [variantOption2, setVariantOption2] = useState('');

  // Function to handle form submission
  const handlePublish = async () => {
    const productDetails = {
      productTitle,
      productDescription,
      category,
      vendor,
      collection,
      tags,
      regularPrice,
      salePrice,
      variants: { option1: variantOption1, option2: variantOption2 },
    };

    try {
      // Make a POST request to save data in MongoDB
      await axios.post('http://localhost:3000/api/products', productDetails);
      alert('Product Published Successfully!');

      // Clear form fields after successful submission
      setProductTitle('');
      setProductDescription('');
      setCategory('');
      setVendor('');
      setCollection('');
      setTags('');
      setRegularPrice('');
      setSalePrice('');
      setVariantOption1('');
      setVariantOption2('');
    } catch (error) {
      console.error('There was an error publishing the product!', error);
    }
  };

  return (
    <>
      <div className="add-product-container">
        <div className='add-product-contents'>
          <Sidebar />

          <div className="main-content">
            {/* Product Title and Description */}
            <div className="header">
              <h1>Add a product</h1>
              <p>Orders placed across your store</p>
            </div>
            <div className="product-info">
              <div className="product-title">
                <label>Product Title</label>
                <input 
                  type="text" 
                  placeholder="Write title here..." 
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)} 
                />
              </div>
              <div className="product-description">
                <label>Product Description</label>
                <textarea 
                  placeholder="Write a description here..." 
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                ></textarea>
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
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option>Men's Clothing</option>
                  <option>Women's Clothing</option>
                </select>
              </div>
              <div className="vendor">
                <label>Vendor</label>
                <select 
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                >
                  <option>Men's Clothing</option>
                  <option>Women's Clothing</option>
                </select>
              </div>
              <div className="collection">
                <label>Collection</label>
                <input 
                  type="text" 
                  placeholder="Collection" 
                  value={collection}
                  onChange={(e) => setCollection(e.target.value)}
                />
              </div>
              <div className="tags">
                <label>Tags</label>
                <input 
                  type="text" 
                  placeholder="Men's Clothing" 
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </div>

            {/* Pricing Section */}
            <div className="pricing-section">
              <h3>Pricing</h3>
              <div className="pricing">
                <label>Regular Price</label>
                <input 
                  type="text" 
                  placeholder="$$$" 
                  value={regularPrice}
                  onChange={(e) => setRegularPrice(e.target.value)}
                />
                <label>Sale Price</label>
                <input 
                  type="text" 
                  placeholder="$$$" 
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                />
              </div>
            </div>

            {/* Variants Section */}
            <div className="variants">
              <h3>Variants</h3>
              <div className="variant-options">
                <div className="option">
                  <label>Option 1</label>
                  <select 
                    value={variantOption1}
                    onChange={(e) => setVariantOption1(e.target.value)}
                  >
                    <option>Size</option>
                    <option>Color</option>
                  </select>
                </div>
                <div className="option">
                  <label>Option 2</label>
                  <select 
                    value={variantOption2}
                    onChange={(e) => setVariantOption2(e.target.value)}
                  >
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
              <button className="publish-btn" onClick={handlePublish}>
                Publish Product
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddProduct;
