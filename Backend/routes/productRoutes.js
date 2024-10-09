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
    tags,
    regularPrice,
    salePrice,
    variants,
  } = req.body;

  try {
    const newProduct = new Product({
      productTitle,
      productDescription,
      category,
      vendor,
      collection,
      tags,
      regularPrice,
      salePrice,
      variants,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error saving product', error });
  }
});

// GET: Retrieve all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();  // Retrieve all products from MongoDB
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving products', error });
  }
});

// GET: Retrieve a product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);  // Find product by ID
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving product', error });
  }
});

// PUT: Update a product by ID
router.put('/:id', async (req, res) => {
  const {
    productTitle,
    productDescription,
    category,
    vendor,
    collection,
    tags,
    regularPrice,
    salePrice,
    variants,
  } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        productTitle,
        productDescription,
        category,
        vendor,
        collection,
        tags,
        regularPrice,
        salePrice,
        variants,
      },
      { new: true }  // Return the updated product
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
});

// DELETE: Delete a product by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
});

module.exports = router;
