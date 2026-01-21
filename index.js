const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { connectMySQL } = require('./config/db.mysql');

// Import Routes
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const productRoutes = require('./routes/products'); // <--- 1. Import the new file

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connections
// (Keep your existing connection strings)
mongoose.connect('mongodb+srv://admin:admin@cluster0.4dls21x.mongodb.net/?appName=Cluster0')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

connectMySQL();

// Route Middlewares
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes); // <--- 2. Mount the route here

// Start Server
app.listen(3000, () => console.log('Server running on port 3000'));