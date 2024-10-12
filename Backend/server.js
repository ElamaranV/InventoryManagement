const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const vendorRoutes = require('./routes/vendorRoutes');

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
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
.catch(err => console.error('MongoDB connection error:', err));

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
  images: { type: [String] },
});

// Product Model
const Product = mongoose.model('Product', productSchema);

// Create product endpoint
app.post('/api/product', upload.array('images'), async (req, res) => {
  try {
    const { productTitle, productDescription, category, vendor, collection, regularPrice, salePrice, variants, sku, weight, dimensions } = req.body;
    const images = req.files.map(file => file.filename);

    console.log('Request Body:', req.body);
    console.log('Uploaded Images:', images);

    const newProduct = new Product({
      productTitle,
      productDescription,
      category,
      vendor,
      collection,
      regularPrice: Number(regularPrice),
      salePrice: salePrice ? Number(salePrice) : undefined,
      variants: variants ? JSON.parse(variants) : undefined,
      sku,
      weight,
      dimensions,
      images,
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully!', product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

app.get('/test', (req, res) => {
  res.send('Test route working');
});

// Use vendor routes
app.get('/api/vendors', (req, res) => {
  res.json([{ name: 'Test Vendor' }]);
});

app.use('*', (req, res) => {
  console.log(`Received request for ${req.originalUrl}`);
  res.status(404).send('Route not found');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});