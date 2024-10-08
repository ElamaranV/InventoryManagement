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

module.exports = router;
