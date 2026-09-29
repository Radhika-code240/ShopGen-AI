const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @desc    Create new order from user's cart
// @route   POST /api/orders
// @access  Private (Protected)
const createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ message: 'Please provide a shipping address' });
    }

    // 1. Get the logged-in user's cart with populated product details
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    // 2. Check if cart exists and is not empty
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty. Add items before placing an order.' });
    }

    // 3. Calculate total amount from actual product prices in database
    let totalAmount = 0;
    const orderItems = cart.items.map(item => {
      totalAmount += item.product.price * item.quantity;
      return {
        product: item.product._id,
        quantity: item.quantity
      };
    });

    // 4. Create and save the order in MongoDB
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      status: 'Placed',
      shippingAddress
    });

    // 5. Clear the user's cart after successful order placement
    cart.items = [];
    await cart.save();

    // 6. Return the populated order
    const populatedOrder = await Order.findById(order._id).populate('items.product');

    res.status(201).json({
      message: 'Order placed successfully',
      order: populatedOrder
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error placing order', error: error.message });
  }
};

// @desc    Get all orders for logged-in user
// @route   GET /api/orders
// @access  Private (Protected)
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching orders', error: error.message });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private (Protected)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure the order belongs to the logged-in user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching order', error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById
};
