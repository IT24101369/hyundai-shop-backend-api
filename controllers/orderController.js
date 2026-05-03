const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Payment = require('../models/Payment');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (for now)
const createOrder = async (req, res) => {
  try {
    const {
      customerName, phone, email, address, city, paymentMethod,
      items, subtotal, deliveryFee, grandTotal, customerLat, customerLng, status
    } = req.body;

    // Check and update stock for each item
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${item.name}. Available: ${product.stock}` });
      }
      product.stock -= item.quantity;
      await product.save();
    }

    const paymentStatus = paymentMethod === 'Card Payment' ? 'Paid' : 'Non Paid';
    const trackingId = 'TRK' + Math.floor(100000 + Math.random() * 900000);

    const order = new Order({
      customerName, phone, email, address, city, paymentMethod,
      items, subtotal, deliveryFee, grandTotal, paymentStatus,
      customerLat, customerLng, trackingId,
      status: status || 'Pending'
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status || order.status;

      if (order.paymentMethod === 'Cash on Delivery') {
        if (order.status === 'Delivered') {
          order.paymentStatus = 'Paid';
          
          // Update linked payment record in history
          try {
            await Payment.findOneAndUpdate(
              { orderId: order._id.toString() },
              { status: 'PAID' }
            );
          } catch (paymentErr) {
            console.error('Error updating linked payment record:', paymentErr);
          }
        } else {
          order.paymentStatus = 'Non Paid';
        }
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      await Order.deleteOne({ _id: order._id });
      res.json({ message: 'Order removed' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public
const getOrderById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Order ID format' });
    }
    const order = await Order.findById(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get orders for a specific user
// @route   GET /api/orders/user/:email
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ email: req.params.email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  deleteOrder,
};
