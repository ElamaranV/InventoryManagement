const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const vendorRoutes = require('./routes/vendorRoutes');
const productRoutes = require('./routes/productRoutes');
const customerRoutes = require('./routes/customerRoutes');  
const salesOrderRoutes = require('./routes/salesorder');
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
  
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.post('/api/product', upload.array('images'), async (req, res) => {
  try {
    const { productTitle, productDescription, category, vendor, collection, regularPrice, salePrice, variants, sku, weight, dimensions, units, openingStock, openingStockPrice, reorderPoint } = req.body;
    const images = req.files.map(file => file.filename);

    console.log('Request Body:', req.body);
    console.log('Uploaded Images:', images);

    // Import the Product model from the separate Product file
    const Product = require('./models/Product');

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
      units, 
      openingStock, 
      openingStockPrice, 
      reorderPoint
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

 //Routes
app.use('/api/products', productRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/salesorders', salesOrderRoutes);

app.use('*', (req, res) => {
  console.log(`Received request for ${req.originalUrl}`);
  res.status(404).send('Route not found');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
