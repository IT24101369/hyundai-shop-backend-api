const CartItem = require('../models/CartItem');

const addItem = async (req, res) => {
  try {
    const { productId, name, price, image, quantity } = req.body;
    
    // Check if item already exists in cart
    const existingItem = await CartItem.findOne({ productId });
    if (existingItem) {
      existingItem.quantity += (quantity || 1);
      const updated = await existingItem.save();
      return res.json(updated);
    }

    const item = new CartItem({ productId, name, price, image, quantity: quantity || 1 });
    const saved = await item.save();
    res.json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getItems = async (req, res) => {
  try {
    const items = await CartItem.find({});
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const item = await CartItem.findById(req.params.id);
    if (item) {
      item.quantity = req.body.quantity;
      const updated = await item.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await CartItem.findById(req.params.id);
    if (item) {
      await CartItem.deleteOne({ _id: item._id });
      res.json({ message: 'Item removed' });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    await CartItem.deleteMany({});
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addItem, getItems, updateItem, deleteItem, clearCart };
