const Complaint = require('../models/Complaint');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Public (Customer)
const createComplaint = async (req, res) => {
  try {
    const {
      customerName,
      email,
      phone,
      orderId,
      productName,
      category,
      priority,
      hTrackingNumber,
      description,
    } = req.body;

    // Generate a simple ticket ID (e.g., TKT-123456)
    const ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;

    const complaint = new Complaint({
      ticketId,
      customerName,
      email,
      phone,
      orderId,
      productName,
      category,
      priority,
      hTrackingNumber,
      description,
    });

    const createdComplaint = await complaint.save();
    res.status(201).json(createdComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private/Admin
const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({}).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get complaints for a specific customer by email
// @route   GET /api/complaints/my
// @access  Private/Customer
const getMyComplaints = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const complaints = await Complaint.find({ email }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update complaint status or assigned staff
// @route   PUT /api/complaints/:id
// @access  Private/Admin
const updateComplaint = async (req, res) => {
  try {
    const { status, assignedStaff, severity } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (complaint) {
      complaint.status = status || complaint.status;
      complaint.assignedStaff = assignedStaff || complaint.assignedStaff;
      complaint.severity = severity || complaint.severity;

      const updatedComplaint = await complaint.save();
      res.json(updatedComplaint);
    } else {
      res.status(404).json({ message: 'Complaint not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a complaint
// @route   DELETE /api/complaints/:id
// @access  Private/Admin
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (complaint) {
      await Complaint.deleteOne({ _id: complaint._id });
      res.json({ message: 'Complaint removed' });
    } else {
      res.status(404).json({ message: 'Complaint not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getMyComplaints,
  updateComplaint,
  deleteComplaint,
};
