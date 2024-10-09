const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productTitle: { type: String, required: true },
  productDescription: { type: String, required: true },
  category: { type: String, required: true },
  vendor: { type: String, required: true },
  collection: { type: String },
  tags: { type: String },
  sku: { type: String, required: true }, // SKU (Stock Keeping Unit)
  weight: { type: String }, // Product weight
  dimensions: { type: String }, // Dimensions in L x W x H
  regularPrice: { type: Number, required: true },
  salePrice: { type: Number },
  variants: {
    option1: { type: String }, // Variant option 1 (e.g., Size, Color)
    option2: { type: String }  // Variant option 2 (e.g., Size, Color)
  },
  images: [{ type: String }], // Array of image URLs or file paths
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
