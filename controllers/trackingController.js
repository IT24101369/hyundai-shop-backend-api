const mongoose = require('mongoose');
const Order = require('../models/Order');
const RiderLocation = require('../models/RiderLocation');

// @desc    Update rider location
// @route   POST /api/tracking/location/update
const updateLocation = async (req, res) => {
  try {
    const { riderId, orderId, latitude, longitude } = req.body;

    console.log(`Updating Location - Rider: ${riderId}, Order: ${orderId}, Lat: ${latitude}, Lng: ${longitude}`);

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(riderId)) {
      console.log('Validation FAILED for Rider ID:', riderId);
      return res.status(400).json({ message: 'Invalid Rider ID' });
    }
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      console.log('Validation FAILED for Order ID:', orderId);
      return res.status(400).json({ message: 'Invalid Order ID' });
    }

    const location = await RiderLocation.findOneAndUpdate(
      { riderId },
      { orderId, latitude, longitude },
      { upsert: true, new: true }
    );

    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order location for customer
// @route   GET /api/tracking/location/order/:orderId
const getOrderLocation = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.orderId)) {
      return res.status(400).json({ message: 'Invalid Order ID' });
    }

    const location = await RiderLocation.findOne({ orderId: req.params.orderId });
    if (location) {
      res.json(location);
    } else {
      res.status(404).json({ message: 'Tracking data not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept order by rider
// @route   POST /api/tracking/orders/:orderId/accept
const acceptOrder = async (req, res) => {
  try {
    const { riderId, riderName } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (order) {
      order.riderId = riderId;
      order.riderName = riderName;
      order.status = 'Out for Delivery';
      order.trackingId = 'TRK' + Math.floor(100000 + Math.random() * 900000);
      
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all available orders for riders
// @route   GET /api/tracking/orders/available
const getAvailableOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: 'Processing' }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  updateLocation,
  getOrderLocation,
  acceptOrder,
  getAvailableOrders,
};
