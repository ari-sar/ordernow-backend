const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// 1. GET Products (Filtered by User ID)
// URL: /api/products?userId=1
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    
    // Create a filter object. If userId exists, use it.
    // If no userId is sent, return empty array or handle error (depending on preference)
    const filter = userId ? { userId: userId } : {};

    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. CREATE Product
router.post('/', async (req, res) => {
  try {
    // Ensure userId is passed from frontend
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 3. UPDATE Product
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } // Return the updated document
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4. DELETE Product
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;