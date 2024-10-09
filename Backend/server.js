const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// Initialize Express
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json());
app.use(express.static('uploads')); // Serve static files from the uploads directory

// Set up storage for images with Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set your uploads directory here
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Create a unique filename
  }
});

// Initialize upload with Multer and filter images only
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit for each file
  fileFilter: (req, file, cb) => {
    // Accept only images
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE')); // Custom error for invalid file types
    }
  }
});

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/EA_INVENTORY';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected'); // Log message on successful connection
})
.catch(err => {
  console.error('MongoDB connection error:', err); // Log error message if connection fails
});

// Define your product schema and model here (example schema)
const productSchema = new mongoose.Schema({
  productTitle: String,
  productDescription: String,
  category: String,
  vendor: String,
  collection: String,
  regularPrice: Number,
  salePrice: Number,
  variants: Array,
  sku: String,
  weight: Number,
  dimensions: String,
  images: [String]
});

const Product = mongoose.model('Product', productSchema);

// Route for product creation with multiple images
app.post('/api/product', upload.array('images'), async (req, res) => {
  try {
    const { productTitle, productDescription, category, vendor, collection, tags, regularPrice, salePrice, variants, sku, weight, dimensions } = req.body;
    const images = req.files.map(file => file.filename); // Get the uploaded file names

    // Create a product object and save it to the database
    const newProduct = new Product({
      productTitle,
      productDescription,
      category,
      vendor,
      collection,
      regularPrice,
      salePrice,
      variants,
      sku,
      weight,
      dimensions,
      images
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully!', product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating product', error });
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
