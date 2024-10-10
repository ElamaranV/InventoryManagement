const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Joi = require('joi');
require('dotenv').config(); // Load environment variables

// Initialize Express
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json());
app.use(express.static('uploads')); // Serve static files from the uploads directory

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

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
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/EA_INVENTORY';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Define product schema and model
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
  weight: { type: Number },
  dimensions: { type: String },
  images: { type: [String], required: true } // Store the filenames of uploaded images
});

const Product = mongoose.model('Product', productSchema);

// Define the validation schema using Joi
const productValidationSchema = Joi.object({
  productTitle: Joi.string().required(),
  productDescription: Joi.string().required(),
  category: Joi.string().required(),
  vendor: Joi.string().required(),
  collection: Joi.string().optional(),
  regularPrice: Joi.number().required(),
  salePrice: Joi.number().optional(),
  sku: Joi.string().required(),
  weight: Joi.number().optional(),
  dimensions: Joi.string().optional(),
  variants: Joi.object().optional()
});

// Route for product creation with multiple images
app.post('/api/Product', upload.array('images', 10), async (req, res) => {
  // Validate the incoming product data
  const { error } = productValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const {
      productTitle, productDescription, category, vendor, collection,
      regularPrice, salePrice, sku, weight, dimensions, variants
    } = req.body;

    const images = req.files.map(file => file.filename); // Get the uploaded file names

    // Create and save new product to the database
    const newProduct = new Product({
      productTitle,
      productDescription,
      category,
      vendor,
      collection,
      regularPrice,
      salePrice,
      sku,
      weight,
      dimensions,
      variants: JSON.parse(variants || '{}'), // Parse variants only if provided
      images // Save image filenames
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully!', product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating product', error });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
