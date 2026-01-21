const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { 
    type: Number, 
    required: true // This ID comes from your MySQL Users table
  },
  productIds: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' // References your Product collection
  }],
  totalAmount: { 
    type: Number, 
    required: true 
  },
  orderDate: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Order', orderSchema);