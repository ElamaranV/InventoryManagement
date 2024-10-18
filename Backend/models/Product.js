const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
    productTitle: { type: String, required: true },
    productDescription: { type: String, required: true },
    category: { type: String, required: true },
    vendor: { type: String, required: true },
    collection: { type: String },
    regularPrice: { type: Number, required: true },
    salePrice: { type: Number },
    variants: { type: Object },
    sku: { type: String, required: true },
    weight: { type: String },
    dimensions: { type: String },
    images: { type: [String] },
    units: { type: Number, required: true },
    openingStock: { type: Number, required: true, default: 0 }, // Added field
    openingStockPrice: { type: Number, required: true, default: 0 }, // Added field
    reorderPoint: { type: Number, required: true, default: 0 } // Added field
});

// Check if the model already exists before compiling
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product;
