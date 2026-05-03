const express = require('express');
const router = express.Router();
const {
  getUsers,
  deleteUser,
  updateUserRole,
} = require('../controllers/userController');

// User routes
router.route('/').get(getUsers);
router.route('/:id').delete(deleteUser).put(updateUserRole);

module.exports = router;
