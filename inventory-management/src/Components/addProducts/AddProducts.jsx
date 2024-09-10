import React from 'react';
import Sidebar from '../Sidebar';
import './AddProducts.css';

const AddProducts = () => {
  return (
    <div className='AddProducts_Container'>
      <Sidebar />
      <div className='Addp_contents'>
        <h1>Add Products</h1>
        <p>Orderes Placed Across Your Store</p>

        <div className='form-container'>
          <div className='form-field'>
            <label htmlFor='productTitle'>Product Title</label>
            <input type='text' id='productTitle' placeholder='Enter product title' />
          </div>

          <div className='form-field'>
            <label htmlFor='productDescription'>Product Description</label>
            <textarea id='productDescription' placeholder='Enter product description' rows='4'></textarea>
          </div>

          <div className='button-container'>
            <button className='discard-button'>Discard</button>
            <button className='add-button'>Add Product</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProducts;