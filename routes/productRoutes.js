const express = require('express');
const router = express.Router();
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
} = require('../controllers/productController');

const { protect, admin } = require('../middleware/authMiddleware');

// All product routes
router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/:id')
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);
router.route('/:id/reviews').post(addReview);

module.exports = router;
