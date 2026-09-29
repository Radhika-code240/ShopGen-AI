const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// All cart routes are protected with JWT authMiddleware
router.route('/')
  .get(protect, getCart)
  .post(protect, addToCart);

router.delete('/clear', protect, clearCart);

router.route('/:productId')
  .put(protect, updateCartItem)
  .delete(protect, removeFromCart);

module.exports = router;
