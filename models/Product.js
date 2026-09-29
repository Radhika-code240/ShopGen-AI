const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    brand: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    description: {
      type: String
    },
    image: {
      type: String
    },
    rating: {
      type: Number,
      default: 0
    },
    stock: {
      type: Number,
      default: 0
    },
    specifications: {
      type: Object
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
