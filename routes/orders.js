const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product'); // To validate prices/products if needed

// 1. CREATE Order (POST /api/orders)
router.post('/', async (req, res) => {
  try {
    const { userId, productIds, totalAmount } = req.body;

    // Basic Validation
    if (!userId || !productIds || productIds.length === 0) {
      return res.status(400).json({ error: "User ID and at least one Product ID are required." });
    }

    const newOrder = new Order({
      userId,
      productIds,
      totalAmount
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET Order by ID (GET /api/orders/:id)
router.get('/:id', async (req, res) => {
  try {
    // .populate() replaces the product IDs with the actual product data
    const order = await Order.findById(req.params.id).populate('productIds');
    
    if (!order) return res.status(404).json({ message: "Order not found" });
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. GET Orders for a specific User (Bonus helper)
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Find orders matching the userId and populate product details
    const orders = await Order.find({ userId: userId }).populate('productIds');
    
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. UPDATE Order (PUT /api/orders/:id)
router.put('/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } // Return the updated document
    );
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 5. DELETE Order (DELETE /api/orders/:id)
router.delete('/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(204).send(); // 204 = No Content (Successful delete)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;