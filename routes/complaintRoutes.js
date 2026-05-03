const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  getMyComplaints,
  updateComplaint,
  deleteComplaint,
} = require('../controllers/complaintController');

router.route('/').get(getComplaints).post(createComplaint);
router.route('/my').get(getMyComplaints);
router.route('/:id').put(updateComplaint).delete(deleteComplaint);

module.exports = router;
