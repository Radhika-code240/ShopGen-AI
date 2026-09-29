const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct } = require('../controllers/productController');
const { getProductReviews, createReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Route: /api/products
router.route('/')
  .get(getProducts)
  .post(createProduct);

// Route: /api/products/:id
router.route('/:id')
  .get(getProductById);

// Route: /api/products/:id/reviews
router.route('/:id/reviews')
  .get(getProductReviews)
  .post(protect, createReview);

module.exports = router;
