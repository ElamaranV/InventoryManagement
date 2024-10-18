import React, { useState, useEffect, useRef } from 'react';
import './AddProducts.css';
import Footer from '../Footer';
import Sidebar from '../Sidebar';
import axios from 'axios';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';

const AddProduct = () => {
  const [productTitle, setProductTitle] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [category, setCategory] = useState('');
  const [vendor, setVendor] = useState('');
  const [collection, setCollection] = useState('');
  const [regularPrice, setRegularPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [variantOption1, setVariantOption1] = useState('');
  const [variantOption2, setVariantOption2] = useState('');
  const [sku, setSku] = useState('');
  const [weight, setWeight] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [images, setImages] = useState([]);
  const [units, setUnits] = useState('');
  const [vendorsList, setVendorsList] = useState([]);
  const [openingStock, setOpeningStock] = useState('');
  const [openingStockPrice, setOpeningStockPrice] = useState('');
  const [reorderPoint, setReorderPoint] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/vendors');
        setVendorsList(response.data);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };

    fetchVendors();
  }, []);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setImages(files);
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  const handlePublish = async () => {
    alertify.set('notifier', 'position', 'top-center');

    if (!productTitle || !productDescription || !category || !vendor || !sku || !regularPrice || !units) {
      alertify.error("Please fill out all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append('productTitle', productTitle);
    formData.append('productDescription', productDescription);
    formData.append('category', category);
    formData.append('vendor', vendor);
    formData.append('collection', collection);
    formData.append('regularPrice', regularPrice);
    formData.append('salePrice', salePrice);
    formData.append('sku', sku);
    formData.append('weight', weight);
    formData.append('dimensions', dimensions);
    formData.append('variants', JSON.stringify({ option1: variantOption1, option2: variantOption2 }));
    formData.append('units', units);
    formData.append('openingStock', openingStock);
    formData.append('openingStockPrice', openingStockPrice);
    formData.append('reorderPoint', reorderPoint);

    images.forEach((image, index) => {
      formData.append(`images`, image);
    });

    try {
      await axios.post('http://localhost:5000/api/product', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alertify.success('Product Published Successfully!');
      // Clear form fields
      setProductTitle('');
      setProductDescription('');
      setCategory('');
      setVendor('');
      setCollection('');
      setRegularPrice('');
      setSalePrice('');
      setVariantOption1('');
      setVariantOption2('');
      setSku('');
      setWeight('');
      setDimensions('');
      setImages([]);
      setUnits('');
      setOpeningStock('');
      setOpeningStockPrice('');
      setReorderPoint('');
    } catch (error) {
      alertify.error('There was an error publishing the product!');
      console.error('There was an error publishing the product!', error);
    }
  };

  return (
    <>
      <div className="add-product-container">
        <div className='add-product-contents'>
          <Sidebar />

          <div className="main-content">
            <div className="header">
              <h1>Add a product</h1>
              <p>Orders placed across your store</p>
            </div>
            <div className="product-info">
              <div className="product-title">
                <label>Product Title <span style={{ color: 'red' }}>*</span></label>
                <input 
                  type="text" 
                  placeholder="Write title here..." 
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)} 
                />
              </div>
              <div className="product-description">
                <label>Product Description <span style={{ color: 'red' }}>*</span></label>
                <textarea 
                  placeholder="Write a description here..." 
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="display-images">
              <label>Display Images</label>
              <div className="image-upload">
                <input 
                  type="file" 
                  multiple 
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
                <button onClick={openFileDialog} className="browse-btn">
                  Browse from device
                </button>
              </div>
              {images.length > 0 && (
                <div className="image-preview">
                  {images.map((image, index) => (
                    <img 
                      key={index} 
                      src={URL.createObjectURL(image)} 
                      alt={`Preview ${index}`} 
                      className="preview-image"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="organize">
              <h3>Organize</h3>
              <div className="category">
                <label>Category <span style={{ color: 'red' }}>*</span></label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home & Furniture">Home & Furniture</option>
                  <option value="Sports and Outdoors">Sports and Outdoors</option>
                  <option value="Health and wellness">Health and wellness</option>
                  <option value="Toy and Baby products">Toy and Baby products</option>
                  <option value="Books and Media">Books and Media</option>
                  <option value="Groceries">Groceries</option>
                </select>
              </div>

              <div className="vendor">
                <label>Vendor <span style={{ color: 'red' }}>*</span></label>
                <select 
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                >
                  <option value="">Select Vendor</option>
                  {vendorsList.map((vendor) => (
                    <option key={vendor._id} value={vendor.vendorName}>
                      {vendor.vendorName}
                    </option>
                  ))}
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

              <div className="sku">
                <label>SKU <span style={{ color: 'red' }}>*</span></label>
                <input 
                  type="text" 
                  placeholder="Stock Keeping Unit" 
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                />
              </div>
              <div className="weight">
                <label>Weight</label>
                <input 
                  type="text" 
                  placeholder="Weight in kg" 
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
              <div className="dimensions">
                <label>Dimensions</label>
                <input 
                  type="text" 
                  placeholder="L x W x H in cm" 
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                />
              </div>
              <div className="units">
                <label>Units <span style={{ color: 'red' }}>*</span></label>
                <input 
                  type="number" 
                  placeholder="Number of units available" 
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                />
              </div>
            </div>

            <div className="pricing-section">
              <h3>Pricing</h3>
              <div className="pricing">
                <label>Regular Price <span style={{ color: 'red' }}>*</span></label>
                <input 
                  type="text" 
                  placeholder="₹₹₹" 
                  value={regularPrice}
                  onChange={(e) => setRegularPrice(e.target.value)}
                />
                <label>Sale Price</label>
                <input 
                  type="text" 
                  placeholder="₹₹₹" 
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                />
              </div>
            </div>

            <div className="variants">
              <h3>Variants</h3>
              <div className="variant-options">
                <div className="option">
                  <label>Option 1</label>
                  <input
                    type="text"
                    placeholder="Enter option 1 (e.g., Size or Color)"
                    value={variantOption1}
                    onChange={(e) => setVariantOption1(e.target.value)}
                  />
                </div>
                <div className="option">
                  <label>Option 2</label>
                  <input
                    type="text"
                    placeholder="Enter option 2 (e.g., Size or Color)"
                    value={variantOption2}
                    onChange={(e) => setVariantOption2(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="track-inventory-section">
              <h3>Track Inventory</h3>
              <div className="inventory-fields">
                <div className="inventory-field">
                  <label>Opening Stock</label>
                  <input 
                    type="number" 
                    placeholder="Enter opening stock quantity"
                    value={openingStock}
                    onChange={(e) => setOpeningStock(e.target.value)}
                  />
                </div>
                <div className="inventory-field">
                  <label>Opening Stock Price</label>
                  <input 
                    type="number" 
                    placeholder="Enter opening stock price"
                    value={openingStockPrice}
                    onChange={(e) => setOpeningStockPrice(e.target.value)}
                  />
                </div>
                <div className="inventory-field">
                  <label>Reorder Point</label>
                  <input 
                    type="number" 
                    placeholder="Enter reorder point"
                    value={reorderPoint}
                    onChange={(e) => setReorderPoint(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="save-publish">
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
