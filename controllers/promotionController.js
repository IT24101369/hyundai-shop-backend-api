const Promotion = require('../models/Promotion');

// @desc    Get all promotions
// @route   GET /api/promotions
// @access  Private/Admin
const getPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find({}).sort({ createdAt: -1 });
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new promotion
// @route   POST /api/promotions
// @access  Private/Admin
const createPromotion = async (req, res) => {
  try {
    const { promoCode, discountPercentage, isActive } = req.body;

    const promotionExists = await Promotion.findOne({ promoCode });

    if (promotionExists) {
      return res.status(400).json({ message: 'Promotion code already exists' });
    }

    const promotion = await Promotion.create({
      promoCode,
      discountPercentage,
      isActive,
    });

    res.status(201).json(promotion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a promotion
// @route   DELETE /api/promotions/:id
// @access  Private/Admin
const deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (promotion) {
      await Promotion.deleteOne({ _id: promotion._id });
      res.json({ message: 'Promotion removed' });
    } else {
      res.status(404).json({ message: 'Promotion not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Validate a promo code
// @route   GET /api/promotions/validate/:code
// @access  Public
const validatePromotion = async (req, res) => {
  try {
    const { code } = req.params;
    const promotion = await Promotion.findOne({ 
      promoCode: code.toUpperCase(), 
      isActive: true 
    });

    if (promotion) {
      res.json(promotion);
    } else {
      res.status(404).json({ message: 'Invalid or inactive promo code' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a promotion status
// @route   PUT /api/promotions/:id
// @access  Private/Admin
const updatePromotionStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const promotion = await Promotion.findById(req.params.id);

    if (promotion) {
      promotion.isActive = isActive;
      const updatedPromotion = await promotion.save();
      res.json(updatedPromotion);
    } else {
      res.status(404).json({ message: 'Promotion not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPromotions,
  createPromotion,
  deletePromotion,
  validatePromotion,
  updatePromotionStatus,
};
