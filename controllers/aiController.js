const aiProvider = require('../services/aiProvider');
const Product = require('../models/Product');

let mockProductsPromise;

async function getMockProducts() {
  if (!mockProductsPromise) {
    mockProductsPromise = import('../../src/data/mockData.js').then(module => module.PRODUCTS || []);
  }
  return mockProductsPromise;
}

// AI chat handler: prefer real AI provider, fall back to keyword stub
const handleChat = async (req, res) => {
  try {
    const { message = '', history = [] } = req.body || {};
    const PRODUCTS = await getMockProducts();

    // Identify basic filters (category, max price) from the message to find real products
    const q = String(message || '').toLowerCase();
    let category = null;
    if (q.includes('laptop') || q.includes('coding') || q.includes('notebook')) category = 'laptops';
    else if (q.includes('headphone') || q.includes('audio')) category = 'headphones';
    else if (q.includes('watch') || q.includes('smartwatch')) category = 'smartwatches';
    else if (q.includes('phone') || q.includes('smartphone')) category = 'smartphones';
    else if (q.includes('tablet')) category = 'tablets';
    else if (q.includes('smart home') || q.includes('smarthome')) category = 'smarthome';

    let maxPrice = null;
    const priceMatch = q.match(/[₹$]?\s*((?:\d{1,3}(?:,\d{3})+)|\d{2,7})/);
    if (priceMatch) {
      maxPrice = parseInt(priceMatch[1].replace(/,/g, ''), 10);
    }

    // Build MongoDB query: match category/name case-insensitively and handle price
    let foundProducts = [];
    try {
      const mongoQuery = {};
      const andClauses = [];

      if (category) {
        const nameRegex = new RegExp(category.replace(/s$/i, ''), 'i');
        const catRegex = new RegExp(category, 'i');
        andClauses.push({ $or: [ { category: { $regex: catRegex } }, { name: { $regex: nameRegex } } ] });
      }

      if (maxPrice !== null && !Number.isNaN(maxPrice)) {
        andClauses.push({ price: { $lte: maxPrice } });
      }

      if (andClauses.length > 0) mongoQuery.$and = andClauses;

      foundProducts = await Product.find(mongoQuery).limit(6).lean();
    } catch (dbErr) {
      console.error('Product DB query error:', dbErr && dbErr.stack ? dbErr.stack : dbErr);
      foundProducts = [];
    }

    // Build a concise product summary to include in the AI prompt so Ollama cites real products
    let augmentedMessage = String(message || '');
    const realRecommendedProducts = (foundProducts || []).map(p => {
      return {
        id: p._id ? String(p._id) : (p.id || ''),
        name: p.name,
        brand: p.brand,
        category: p.category,
        price: p.price,
        image: p.image,
        rating: p.rating,
        description: p.description,
        specifications: p.specifications
      };
    });

    if (realRecommendedProducts.length > 0) {
      augmentedMessage += '\n\nAvailable ShopGen products matching the request:\n';
      realRecommendedProducts.forEach(p => {
        const priceInRupees = new Intl.NumberFormat('en-IN').format(Math.round(Number(p.price || 0)));
        augmentedMessage += `- ID: ${p.id}; Name: ${p.name}; Price: ₹${priceInRupees}; Rating: ${p.rating}\n`;
      });
      augmentedMessage += '\nPlease base your recommendation on the real products listed above. Do not invent product names, prices, or specs.';
    }

    // Attempt to get real AI response from Ollama using augmented message
    try {
      const aiText = await aiProvider.generateResponse({ message: augmentedMessage, history });
      console.debug('AI provider returned text length:', aiText ? String(aiText).length : 0);
      if (aiText && aiText.trim().length > 0) {
        return res.status(200).json({
          id: `msg-ai-${Date.now()}`,
          sender: 'ai',
          text: aiText.trim(),
          recommendedProducts: realRecommendedProducts,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    } catch (providerErr) {
      console.error('AI provider error:', providerErr && providerErr.stack ? providerErr.stack : (providerErr.message || providerErr));
      // Continue to fallback below
    }

    // Fallback keyword-based behavior (preserve previous logic)
    const query = String(message).toLowerCase();

    let responseText = '';
    let recommendedProducts = [];
    let intent = 'general';

    if (query.includes('laptop') || query.includes('coding') || query.includes('80000') || query.includes('80,000') || query.includes('800')) {
      intent = 'recommendation';
      const laptops = (PRODUCTS || []).filter(p => p.category === 'laptops' && p.price <= 80000);
      recommendedProducts = laptops;
      responseText = `Based on your requirement for a high-performance laptop suitable for coding under ₹80,000, I have found ${laptops.length} top-rated options.`;
    } else if (query.includes('headphone') || query.includes('audio') || query.includes('travel') || query.includes('anc')) {
      intent = 'recommendation';
      const audio = (PRODUCTS || []).filter(p => p.category === 'headphones');
      recommendedProducts = audio;
      responseText = `For travel and noise cancellation, here are our best wireless audio devices.`;
    } else if (query.includes('compare') || query.includes('vs')) {
      intent = 'comparison';
      recommendedProducts = (PRODUCTS || []).slice(0, 2);
      responseText = `I've prepared a comparison between the top candidates. See the recommendations below.`;
    } else if (query.includes('review') || query.includes('summarize')) {
      intent = 'review_summary';
      const target = (PRODUCTS || [])[0];
      responseText = `Here is the aggregated AI Review Breakdown for ${target ? target.name : 'this product'} based on verified buyer reviews.`;
      recommendedProducts = target ? [target] : [];
    } else if (query.includes('watch') || query.includes('fitness') || query.includes('smartwatch')) {
      intent = 'recommendation';
      recommendedProducts = (PRODUCTS || []).filter(p => p.category === 'smartwatches');
      responseText = `Here is our top recommendation for outdoor fitness and health monitoring.`;
    } else {
      intent = 'general';
      recommendedProducts = (PRODUCTS || []).slice(0, 3);
      responseText = `I'm ShopGen AI, your shopping copilot. Here are a few popular items.`;
    }

    const aiMsg = {
      id: `msg-ai-${Date.now()}`,
      sender: 'ai',
      text: responseText,
      recommendedProducts,
      intent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    return res.status(200).json(aiMsg);
  } catch (error) {
    console.error('AI chat handler error:', error);
    return res.status(200).json({
      id: `msg-ai-${Date.now()}`,
      sender: 'ai',
      text: 'Sorry, the AI service is temporarily unavailable. Please try again later.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  }
};

module.exports = { handleChat };
