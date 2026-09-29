const Review = require('../models/Review');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// @desc    Get reviews for a specific product
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    const { id: productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const reviews = await Review.find({ product: productId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching reviews', error: error.message });
  }
};

// @desc    Create a new product review
// @route   POST /api/products/:id/reviews
// @access  Private (Protected)
const createReview = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const userId = req.user._id;
    const { rating, title, comment } = req.body;

    // 1. Input Validation
    if (!rating || !comment) {
      return res.status(400).json({ message: 'Please provide both rating and comment' });
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    // 2. Check Product existence
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // 3. Prevent duplicate reviews by the same user for this product
    const alreadyReviewed = await Review.findOne({ product: productId, user: userId });
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // 4. Create Review
    const review = await Review.create({
      user: userId,
      product: productId,
      rating: numericRating,
      title: title || '',
      comment
    });

    // 5. Recalculate average rating & review count on Product model
    const allReviews = await Review.find({ product: productId });
    product.reviewsCount = allReviews.length;
    product.rating = (
      allReviews.reduce((sum, item) => sum + item.rating, 0) / allReviews.length
    );
    await product.save();

    // 6. Populate user info before returning response
    const populatedReview = await Review.findById(review._id).populate('user', 'name email');

    res.status(201).json(populatedReview);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }
    res.status(500).json({ message: 'Server error creating review', error: error.message });
  }
};

module.exports = {
  getProductReviews,
  createReview
};
