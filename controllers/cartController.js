const Cart = require('../models/Cart');

// @desc    Get logged-in user's cart
// @route   GET /api/cart
// @access  Private (Protected)
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      // If user doesn't have a cart document yet, return empty cart structure
      cart = { user: req.user._id, items: [] };
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching cart', error: error.message });
  }
};

// @desc    Add product to cart or increase quantity
// @route   POST /api/cart
// @access  Private (Protected)
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Please provide a productId' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      // Create new cart if none exists
      cart = new Cart({
        user: req.user._id,
        items: [{ product: productId, quantity: Number(quantity) }]
      });
    } else {
      // Check if product already exists in cart items
      const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        // Product exists -> update quantity
        cart.items[itemIndex].quantity += Number(quantity);
      } else {
        // Product does not exist -> add to items array
        cart.items.push({ product: productId, quantity: Number(quantity) });
      }
    }

    await cart.save();
    cart = await cart.populate('items.product');

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error adding to cart', error: error.message });
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:productId
// @access  Private (Protected)
const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({ message: 'Please provide a quantity' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (Number(quantity) <= 0) {
      // If quantity is 0 or less, remove item
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = Number(quantity);
    }

    await cart.save();
    cart = await cart.populate('items.product');

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating cart item', error: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private (Protected)
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();
    cart = await cart.populate('items.product');

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error removing cart item', error: error.message });
  }
};

// @desc    Clear the logged-in user's cart
// @route   DELETE /api/cart/clear
// @access  Private (Protected)
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [] } },
      { returnDocument: 'after' }
    );

    res.status(200).json(cart || { user: req.user._id, items: [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error clearing cart', error: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
