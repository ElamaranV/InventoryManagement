const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const nodemailer = require('nodemailer');
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

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  otp: String,
  otpExpiresAt: Date
});

const User = mongoose.model('User', userSchema);

// Nodemailer setup for sending OTP emails
const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: 'hathish113@gmail.com', 
    pass: 'pqaa siov azdw yyrw',  
  },
});

// User Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login attempt for email:', email);
    
    // Check if user exists in the database
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('User not found for email:', email);
      return res.json({ success: false, message: 'User not found' });
    }

    if (user.password !== password) {
      console.log('Invalid password for email:', email);
      return res.json({ success: false, message: 'Invalid password' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
    user.otp = otp;
    user.otpExpiresAt = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes

    await user.save(); 

    // Send OTP via email
    const mailOptions = {
      from: 'no-reply@gmail.com',
      to: email,
      subject: 'Login OTP for EA INVENTORY',
      text: `Dear User, 
       We received a request to log in to your account. Please use the verification code below to complete the login process:
                      Verification Code: ${otp}

      This code is valid for the next 5 minutes. If you did not request this, please ignore this message. 

        Thank you, 
        EA INVENTORY`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.json({ success: false, message: 'Error sending OTP', error: error.message });
      }
      console.log('Email sent successfully:', info.response);
      res.json({ success: true, message: 'OTP sent to email' });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
});


app.post('/api/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user || !user.otp) {
      return res.json({ success: false, message: 'OTP expired or invalid' });
    }

    // Check if OTP has expired
    const currentTime = Date.now();
    if (currentTime > user.otpExpiresAt) {
      return res.json({ success: false, message: 'OTP expired' });
    }

    // Verify the OTP
    if (user.otp === otp) {
      // OTP is correct, so we clear it from the database
      user.otp = undefined;
      user.otpExpiresAt = undefined;
      await user.save();

      return res.json({ success: true, message: 'OTP verified. Login successful.' });
    } else {
      return res.json({ success: false, message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

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