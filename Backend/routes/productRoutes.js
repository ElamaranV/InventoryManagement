const express = require('express'); 
const router = express.Router(); 
const Product = require('../models/Product'); 
 
// POST: Create a new product 
router.post('/', async (req, res) => { 
  const { 
    productTitle, 
    productDescription, 
    category, 
    vendor, 
    collection, 
    sku, 
    weight, 
    dimensions, 
    regularPrice, 
    salePrice, 
    variants, 
    images 
  } = req.body; 
 
  try { 
    // Create a new product instance with all the fields from the request
    const newProduct = new Product({ 
      productTitle, 
      productDescription, 
      category, 
      vendor, 
      collection, 
      sku, 
      weight, 
      dimensions, 
      regularPrice, 
      salePrice, 
      variants, 
      images
    }); 
 
    // Save the product to the database
    const savedProduct = await newProduct.save(); 
    res.status(201).json(savedProduct); // Respond with the newly created product
  } catch (error) { 
    console.error('Error saving product:', error); // Log the error for debugging
    res.status(500).json({ message: 'Error saving product', error }); // Respond with an error message
  } 
}); 
 
module.exports = router;
