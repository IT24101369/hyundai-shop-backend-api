const express = require('express');
const router = express.Router();
const { processPayment, getPayments, createPaymentIntent } = require('../controllers/paymentController');

router.route('/')
  .post(processPayment)
  .get(getPayments);

router.post('/create-intent', createPaymentIntent);

module.exports = router;
