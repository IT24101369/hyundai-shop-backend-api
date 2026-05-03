const express = require('express');
const router = express.Router();
const {
  updateLocation,
  getOrderLocation,
  acceptOrder,
  getAvailableOrders,
} = require('../controllers/trackingController');

router.get('/orders/available', getAvailableOrders);
router.post('/orders/:orderId/accept', acceptOrder);
router.post('/location/update', updateLocation);
router.get('/location/order/:orderId', getOrderLocation);

module.exports = router;
