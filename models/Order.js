const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  address: { type: String, required: true },
  city: { type: String },
  paymentMethod: { type: String, required: true }, // 'CARD' or 'COD'
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
  status: { type: String, default: 'Pending' }, // Pending, Processing, Shipped, Out for Delivery, Delivered
  paymentStatus: { type: String, default: 'Non Paid' }, // Non Paid, Paid
  riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  riderName: { type: String },
  trackingId: { type: String, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
