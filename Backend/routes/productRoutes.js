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
    res.status(201).json(savedProduct); 
  } catch (error) { 
    console.error('Error saving product:', error); 
    res.status(500).json({ message: 'Error saving product', error }); 
  } 
}); 

router.get('/', async (req, res) => {
  try {
    // console.log('Fetching Products'); 
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: 'Error fetching products', error });
  }
});
 
module.exports = router;
