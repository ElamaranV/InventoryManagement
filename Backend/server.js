const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads')); // Serve static files from uploads directory

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to avoid duplicate file names
  },
});

// Initialize Multer
const upload = multer({ storage });

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/inventory', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Product Schema
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
  images: { type: [String] }, // Store image filenames
});

// Product Model
const Product = mongoose.model('Product', productSchema);

// Create product endpoint
app.post('/api/product', upload.array('images'), async (req, res) => {
  try {
    const { productTitle, productDescription, category, vendor, collection, regularPrice, salePrice, variants, sku, weight, dimensions } = req.body;
    const images = req.files.map(file => file.filename); // Get the uploaded file names

    // Log the request body and images to understand what data you're receiving
    console.log('Request Body:', req.body);
    console.log('Uploaded Images:', images);

    // Create a product object and save it to the database
    const newProduct = new Product({
      productTitle,
      productDescription,
      category,
      vendor,
      collection,
      regularPrice,
      salePrice,
      variants: JSON.parse(variants),
      sku,
      weight,
      dimensions,
      images, // Save the images array to the database
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully!', product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error); // More descriptive error logging
    res.status(500).json({ message: 'Error creating product', error });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
