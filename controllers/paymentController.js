const Payment = require('../models/Payment');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Process a new payment
// @route   POST /api/payments
// @access  Public
const processPayment = async (req, res) => {
  try {
    const {
      fullName, email, address, city, amount, 
      paymentMethod, cardNumber, expiry, cvv, paymentId,
      status, orderId
    } = req.body;

    // Advanced Backend Validations
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid payment amount.' });
    }

    const nameRegex = /^[a-zA-Z\s.'-]+$/;
    if (!fullName || !nameRegex.test(fullName)) {
      console.log('Validation Failed: Invalid Full Name:', fullName);
      return res.status(400).json({ message: 'Invalid Full Name. Please use only letters and basic characters.' });
    }

    if (paymentMethod === 'CARD') {
      // Basic Card Number Validation (16 digits)
      if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
        return res.status(400).json({ message: 'Invalid card number. Must be 16 digits.' });
      }

      // CVV Validation (3 digits)
      if (!cvv || cvv.length < 3 || cvv.length > 4) {
        return res.status(400).json({ message: 'Invalid CVV.' });
      }

      // Expiry Validation (MM/YY)
      const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
      if (!expiry || !expiryRegex.test(expiry)) {
        return res.status(400).json({ message: 'Invalid expiry date format (MM/YY).' });
      }
    }

    const payment = new Payment({
      fullName,
      email,
      address,
      city,
      amount,
      paymentMethod,
      paymentId: paymentId || 'PAY-' + Date.now(),
      cardNumber: cardNumber ? cardNumber.replace(/\d(?=\d{4})/g, '*') : null, // Masking card number
      expiry,
      cvv: cvv ? '***' : null, // Not storing CVV for security
      status: status || 'PAID',
      orderId: orderId || null
    });

    const savedPayment = await payment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    console.error('Payment Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create Stripe PaymentIntent
// @route   POST /api/payments/create-intent
// @access  Public
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'lkr' } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects cents
      currency: currency,
      payment_method_types: ['card'],
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Stripe Intent Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private/Admin
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({}).sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  processPayment,
  getPayments,
  createPaymentIntent,
};
