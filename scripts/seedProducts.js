const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

function normalizeCategory(cat) {
  const value = String(cat || '').trim().toLowerCase();
  const aliases = {
    laptop: 'laptops',
    laptops: 'laptops',
    smartphone: 'smartphones',
    smartphones: 'smartphones',
    headphone: 'headphones',
    headphones: 'headphones',
    smartwatch: 'smartwatches',
    smartwatches: 'smartwatches',
    tablet: 'tablets',
    tablets: 'tablets',
    smarthome: 'smarthome',
    'smart home': 'smarthome'
  };
  return aliases[value] || value || 'uncategorized';
}

/**
 * Normalize price directly in Rupees for backend storage.
 */
function normalizePrice(price) {
  if (price === undefined || price === null) return 0;
  const n = Number(price);
  if (Number.isNaN(n)) return 0;
  return Math.round(n);
}

async function seedProducts() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not configured in environment. Aborting.');
    process.exit(1);
  }

  // The frontend catalog is an ES module while this backend package is CommonJS.
  const mock = await import('../../src/data/mockData.js');
  const PRODUCTS = mock.PRODUCTS || [];

  // Use same connection style as backend/server.js; do not pass deprecated options
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB for seeding (syntax-safe run).');

  let created = 0;
  let skipped = 0;
  const desiredKeys = [];

  for (const p of PRODUCTS) {
    const name = p.name || p.title || 'Unnamed Product';
    const brand = p.brand || 'Unknown';
    const category = normalizeCategory(p.category || p.categoryId || 'Uncategorized');
    const price = normalizePrice(p.price);

    const doc = {
      name,
      brand,
      category,
      price,
      description: p.description || '',
      image: p.image || (Array.isArray(p.images) ? p.images[0] : '') || 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80',
      rating: typeof p.rating === 'number' ? p.rating : 0,
      stock: typeof p.stock === 'number' ? p.stock : 0,
      specifications: p.specifications || {}
    };
    desiredKeys.push({ name: doc.name, brand: doc.brand });

    try {
      const result = await Product.updateOne(
        { name: doc.name, brand: doc.brand },
        { $set: doc },
        { upsert: true }
      );
      if (result.upsertedCount > 0) {
        created++;
        console.log(`Created product: ${doc.name} (${doc.brand})`);
      } else {
        skipped++;
        console.log(`Updated existing product: ${doc.name} (${doc.brand})`);
      }
    } catch (e) {
      console.error('Failed to create product', doc.name, e && e.message ? e.message : e);
    }
  }

  // Keep MongoDB aligned with the canonical ten-product catalog. Existing
  // records are retained when their name and brand match a seeded product.
  await Product.deleteMany({ $nor: desiredKeys });

  // Remove duplicate records for a canonical product while keeping the first
  // record, which preserves existing references where possible.
  for (const key of desiredKeys) {
    const matches = await Product.find(key).sort({ _id: 1 }).select('_id').lean();
    if (matches.length > 1) {
      await Product.deleteMany({ _id: { $in: matches.slice(1).map(product => product._id) } });
    }
  }

  const finalCount = await Product.countDocuments();

  console.log(`Seeding complete. Created: ${created}. Updated: ${skipped}. Catalog count: ${finalCount}.`);

  await mongoose.disconnect();
}

module.exports = { seedProducts };

// If run directly, execute. When required for syntax check, this will not run.
if (require.main === module) {
  seedProducts().catch(err => {
    console.error('Seeding failed:', err && err.stack ? err.stack : err);
    process.exit(1);
  });
}
