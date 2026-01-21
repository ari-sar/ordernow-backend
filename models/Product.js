const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  userId: { 
    type: Number, 
    required: true, 
    index: true // Helps search faster
  }
});

module.exports = mongoose.model('Product', productSchema);