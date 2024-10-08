const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for cross-origin requests

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/EA_INVENTORY', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error: ', err));

// Routes
app.use('/api/products', productRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
