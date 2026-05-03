const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    orderId: {
      type: String,
    },
    productName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
      default: 'Medium',
    },
    hTrackingNumber: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      default: 'Normal',
    },
    status: {
      type: String,
      required: true,
      default: 'PENDING', // PENDING, IN_PROGRESS, RESOLVED
    },
    assignedStaff: {
      type: String,
      default: 'Unassigned',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Complaint', complaintSchema);
