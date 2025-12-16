const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  productName: String,
  selectedSize: String,
  size: String,
  color: String,
  quantity: String,
  price: String,
  name: String,
  customer: String,
  address: String,
  postcode: String,
  whatsapp: String,
  selectedImage: String,
  paymentMethod: String,
  totalPrice: String,
  product: String,
  unit: String,
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'processing', 'completed']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);