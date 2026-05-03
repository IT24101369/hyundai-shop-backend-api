const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentId: { type: String, required: true, unique: true },
    cardNumber: { type: String }, // Storing partially or masked in production, but following website's lead for now
    expiry: { type: String },
    cvv: { type: String },
    status: { type: String, default: 'PAID' },
    orderId: { type: String },
    paymentDate: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
