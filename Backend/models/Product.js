const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productTitle: { type: String, required: true },
  productDescription: { type: String, required: true },
  category: { type: String, required: true },
  vendor: { type: String, required: true },
  collection: { type: String },
  tags: { type: [String] },
  regularPrice: { type: Number, required: true },
  salePrice: { type: Number },
  variants: {
    option1: { type: String },
    option2: { type: String },
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
