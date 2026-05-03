const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      default: 'Smartphone',
    },
    image: {
      type: String,
      required: true,
      default: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop',
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    reviews: {
      type: [reviewSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
