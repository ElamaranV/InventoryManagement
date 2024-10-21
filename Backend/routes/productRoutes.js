const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// POST: Create a new product
router.post('/', async (req, res) => {
    const {
        productTitle,
        productDescription,
        category,
        vendor,
        collection,
        sku,
        weight,
        dimensions,
        regularPrice,
        salePrice,
        images,
        units,
        openingStock,
        openingStockPrice,
        reorderPoint
    } = req.body;

    // Log the incoming request body for debugging
    console.log('Request Body:', req.body);

    // Convert numeric fields from string to number
    const parsedRegularPrice = parseFloat(regularPrice);
    const parsedSalePrice = salePrice ? parseFloat(salePrice) : undefined;
    const parsedUnits = parseInt(units, 10);
    const parsedOpeningStock = parseInt(openingStock, 10);
    const parsedOpeningStockPrice = parseFloat(openingStockPrice);
    const parsedReorderPoint = parseInt(reorderPoint, 10);

    // Validate numeric fields
    if (isNaN(parsedRegularPrice) || isNaN(parsedUnits) || isNaN(parsedOpeningStock) ||
        isNaN(parsedOpeningStockPrice) || isNaN(parsedReorderPoint)) {
        return res.status(400).json({ message: 'Invalid numeric fields' });
    }

    try {
        const newProduct = new Product({
            productTitle,
            productDescription,
            category,
            vendor,
            collection,
            sku,
            weight,
            dimensions,
            regularPrice: parsedRegularPrice,
            salePrice: parsedSalePrice,
            images,
            units: parsedUnits,
            openingStock: parsedOpeningStock,
            openingStockPrice: parsedOpeningStockPrice,
            reorderPoint: parsedReorderPoint
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error saving product:', error);
        res.status(500).json({ message: 'Error saving product', error });
    }
});

// GET: Fetch all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: 'Error fetching products', error });
    }
});

// GET: Fetch a single product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: 'Error fetching product', error });
    }
});

// DELETE: Delete a product by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: 'Error deleting product', error });
    }
});

// PUT: Update a product by ID
router.put('/:id', async (req, res) => {
    // Log the incoming request body for debugging
    console.log('Update Request Body:', req.body);

    try {
        const updatedFields = {};
        
        // Dynamically build the update object based on the fields present in the request
        for (const [key, value] of Object.entries(req.body)) {
            if (key === 'regularPrice' || key === 'salePrice' || key === 'openingStockPrice') {
                updatedFields[key] = parseFloat(value);
            } else if (key === 'units' || key === 'openingStock' || key === 'reorderPoint') {
                updatedFields[key] = parseInt(value, 10);
            } else {
                updatedFields[key] = value;
            }

            // Validate numeric fields
            if (['regularPrice', 'salePrice', 'openingStockPrice', 'units', 'openingStock', 'reorderPoint'].includes(key) && isNaN(updatedFields[key])) {
                return res.status(400).json({ message: `Invalid numeric field: ${key}` });
            }
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updatedFields,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product', error });
    }
});

// New route: PUT: Update product stock
router.put('/:id/stock', async (req, res) => {
    const { openingStockQuantity } = req.body;

    // Log the incoming request body for debugging
    console.log('Stock Update Request Body:', req.body);

    // Validate and parse the openingStockQuantity
    const parsedOpeningStockQuantity = parseInt(openingStockQuantity, 10);
    if (isNaN(parsedOpeningStockQuantity)) {
        return res.status(400).json({ message: 'Invalid openingStockQuantity' });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { openingStock: parsedOpeningStockQuantity },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product stock:', error);
        res.status(500).json({ message: 'Error updating product stock', error });
    }
});
module.exports = router;