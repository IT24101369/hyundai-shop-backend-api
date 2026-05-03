const express = require('express');
const router = express.Router();
const {
  getPromotions,
  createPromotion,
  deletePromotion,
  validatePromotion,
  updatePromotionStatus,
} = require('../controllers/promotionController');

router.get('/', getPromotions);
router.post('/', createPromotion);
router.put('/:id', updatePromotionStatus);
router.delete('/:id', deletePromotion);
router.get('/validate/:code', validatePromotion);

module.exports = router;
