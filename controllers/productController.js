const Product = require('../models/Product');

// @desc    Get all products (supports basic filters/search/sort/pagination)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      sortBy,
      minRating,
      page = 1,
      limit = 0
    } = req.query;

    const query = {};

    if (category && category !== 'all') {
      const categoryAliases = {
        laptop: ['laptop', 'laptops'],
        laptops: ['laptop', 'laptops'],
        smartphone: ['smartphone', 'smartphones'],
        smartphones: ['smartphone', 'smartphones'],
        headphone: ['headphone', 'headphones'],
        headphones: ['headphone', 'headphones'],
        smartwatch: ['smartwatch', 'smartwatches', 'smartwatche'],
        smartwatches: ['smartwatch', 'smartwatches', 'smartwatche'],
        tablet: ['tablet', 'tablets'],
        tablets: ['tablet', 'tablets'],
        smarthome: ['smarthome', 'smart home']
      };
      const categoryValues = categoryAliases[String(category).toLowerCase()] || [category];
      query.category = { $in: categoryValues.map(value => new RegExp(`^${value}$`, 'i')) };
    }

    if (brand && brand !== 'all') {
      query.brand = { $regex: new RegExp(brand, 'i') };
    }

    // Frontend and DB store and filter prices in Rupees
    if (minPrice !== undefined && minPrice !== null && String(minPrice).trim() !== '') {
      const minVal = Number(minPrice);
      if (!Number.isNaN(minVal)) {
        query.price = { ...(query.price || {}), $gte: minVal };
      }
    }

    if (maxPrice !== undefined && maxPrice !== null && String(maxPrice).trim() !== '') {
      const maxVal = Number(maxPrice);
      if (!Number.isNaN(maxVal) && maxVal > 0) {
        query.price = { ...(query.price || {}), $lte: maxVal };
      }
    }

    if (minRating !== undefined && minRating !== null && String(minRating).trim() !== '') {
      const r = Number(minRating);
      if (!Number.isNaN(r)) query.rating = { $gte: r };
    }

    if (search) {
      const s = search.trim();
      query.$or = [
        { name: { $regex: s, $options: 'i' } },
        { brand: { $regex: s, $options: 'i' } },
        { description: { $regex: s, $options: 'i' } },
        { category: { $regex: s, $options: 'i' } }
      ];
    }

    // Sorting
    let sortObj = {};
    if (sortBy) {
      if (sortBy === 'price-low') sortObj = { price: 1 };
      else if (sortBy === 'price-high') sortObj = { price: -1 };
      else if (sortBy === 'rating') sortObj = { rating: -1 };
      else if (sortBy === 'popular') sortObj = { rating: -1 };
    }

    const skip = Math.max(0, (Number(page) - 1) * Number(limit || 0));

    let queryExec = Product.find(query);
    if (limit && Number(limit) > 0) {
      queryExec = queryExec.skip(skip).limit(Number(limit));
    }

    if (Object.keys(sortObj).length) queryExec = queryExec.sort(sortObj);

    const products = await queryExec.exec();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching products', error: error.message });
  }
};

// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching product', error: error.message });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Public
const createProduct = async (req, res) => {
  try {
    const { name, brand, category, price, description, image, rating, stock, specifications } = req.body;

    if (!name || !brand || !category || price === undefined) {
      return res.status(400).json({ message: 'Please provide all required fields: name, brand, category, price' });
    }

    const newProduct = await Product.create({
      name,
      brand,
      category,
      price,
      description,
      image,
      rating,
      stock,
      specifications
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating product', error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct
};
