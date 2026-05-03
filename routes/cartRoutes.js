const express = require('express');
const router = express.Router();
const { addItem, getItems, updateItem, deleteItem, clearCart } = require('../controllers/cartController');

router.route('/').get(getItems).post(addItem);
router.route('/clear').delete(clearCart);
router.route('/:id').put(updateItem).delete(deleteItem);

module.exports = router;
