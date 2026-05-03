const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');

router.route('/').get(getOrders).post(createOrder);
router.route('/user/:email').get(getUserOrders);
router.route('/:id').get(getOrderById).delete(deleteOrder);
router.route('/:id/status').put(updateOrderStatus);

module.exports = router;
