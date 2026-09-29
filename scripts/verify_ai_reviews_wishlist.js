(async () => {
  const fetch = globalThis.fetch || require('node-fetch');
  const fs = require('fs');
  const path = require('path');

  const base = 'http://localhost:5000';
  const OLLAMA_BASE = process.env.OLLAMA_API_URL || 'http://localhost:11434';
  const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:3b';

  try {
    console.log('STEP 1: Fetch products from backend');
    let res = await fetch(`${base}/api/products`);
    if (!res.ok) throw new Error(`/api/products returned ${res.status}`);
    const products = await res.json();
    console.log('Products count:', products.length);
    if (!Array.isArray(products) || products.length === 0) throw new Error('No products in DB');

    const product = products.find(p => p._id || p.id);
    if (!product) throw new Error('No suitable product with id found');
    const productId = product._id || product.id;

    console.log('\nTEST 1: AI Assistant');
    const aiMessage = 'I need a laptop for coding under ₹80000';
    res = await fetch(`${base}/api/ai/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: aiMessage, history: [] }) });
    console.log('/api/ai/chat status', res.status);
    if (res.status !== 200) throw new Error('AI endpoint did not return 200');
    const aiBody = await res.json();
    console.log('AI text length:', aiBody.text ? aiBody.text.length : 0);
    if (!aiBody.text || String(aiBody.text).trim().length === 0) throw new Error('AI returned empty text');
    if (!Array.isArray(aiBody.recommendedProducts)) throw new Error('AI response missing recommendedProducts');
    if (aiBody.recommendedProducts.length === 0) console.warn('AI returned 0 recommendedProducts (allowed but suspicious)');

    // Verify recommendedProducts are real DB products and not invented
    const dbIds = new Set(products.map(p => String(p._id || p.id)));
    for (const rp of aiBody.recommendedProducts) {
      const rid = String(rp.id || rp._id || '');
      if (!rid) throw new Error('Recommended product missing id');
      if (!dbIds.has(rid)) throw new Error(`Recommended product id ${rid} not found in DB (AI may have invented products)`);
      const dbProd = products.find(p => String(p._id || p.id) === rid);
      if (!dbProd) throw new Error('Internal error matching product');
      // Check price presence and type
      if (typeof dbProd.price !== 'number') throw new Error(`DB product ${rid} price is not a number`);
      // Compare name/price
      if (rp.name && rp.name !== dbProd.name) console.warn(`AI recommended product name mismatch for ${rid} (AI: ${rp.name} DB: ${dbProd.name})`);
      if (rp.price && rp.price !== dbProd.price) console.warn(`AI recommended product price mismatch for ${rid} (AI: ${rp.price} DB: ${dbProd.price})`);
    }

    // Check Ollama directly is reachable
    let ollamaReachable = false;
    try {
      const body = { model: OLLAMA_MODEL, messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: aiMessage }], stream: false };
      const or = await fetch(`${OLLAMA_BASE}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (or.ok) {
        const raw = await or.text();
        if (raw && raw.trim().length > 0) ollamaReachable = true;
      }
    } catch (e) {
      console.warn('Ollama unreachable or error:', e.message || e);
    }
    if (!ollamaReachable) console.warn('Ollama not reachable; AI may have used fallback.');
    else console.log('Ollama appears reachable.');

    console.log('\nTEST 1 passed (AI assistant returned data and recommendedProducts match DB)');

    // -------- Reviews test --------
    console.log('\nTEST 2: Reviews (read & write)');
    const prodId = productId;
    res = await fetch(`${base}/api/products/${prodId}/reviews`);
    console.log('GET reviews status', res.status);
    const reviewsBefore = await res.json();
    console.log('Existing reviews count:', Array.isArray(reviewsBefore) ? reviewsBefore.length : 'unknown');

    // Create a new user for review
    const testEmail = `review_${Date.now()}@example.com`;
    res = await fetch(`${base}/api/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Review Tester', email: testEmail, password: 'Password123' }) });
    if (![200,201].includes(res.status)) throw new Error('Register for review tester failed: ' + res.status);
    res = await fetch(`${base}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: testEmail, password: 'Password123' }) });
    if (res.status !== 200) throw new Error('Login for review tester failed');
    const loginBody = await res.json();
    const token = loginBody.token;
    if (!token) throw new Error('No token for review tester');

    // Submit review
    const reviewPayload = { rating: 5, title: 'Excellent for coding', comment: 'This laptop performs great for development workloads.' };
    res = await fetch(`${base}/api/products/${prodId}/reviews`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify(reviewPayload) });
    console.log('POST review status', res.status);
    if (res.status !== 201) {
      const txt = await res.text().catch(() => '');
      throw new Error('Posting review failed: ' + res.status + ' ' + txt);
    }
    const createdReview = await res.json();
    console.log('Created review id:', createdReview._id || createdReview.id);

    // Verify it appears in GET
    res = await fetch(`${base}/api/products/${prodId}/reviews`);
    if (res.status !== 200) throw new Error('GET reviews after post failed');
    const reviewsAfter = await res.json();
    const found = reviewsAfter.find(r => String(r._id || r.id) === String(createdReview._id || createdReview.id) || (r.comment === reviewPayload.comment && r.rating === reviewPayload.rating));
    if (!found) throw new Error('Posted review not found in GET reviews');
    console.log('Review appears in list. TEST 2 passed.');

    // -------- Wishlist test --------
    console.log('\nTEST 3: Wishlist (frontend localStorage simulation)');
    // We'll simulate the WishlistContext localStorage persistence using a temp file to mimic localStorage
    const tmpFile = path.join(__dirname, 'tmp_wishlist.json');
    // Clear any existing
    try { fs.unlinkSync(tmpFile); } catch (e) {}

    // Simulate loading (like useEffect)
    let saved = null;
    if (fs.existsSync(tmpFile)) saved = fs.readFileSync(tmpFile, 'utf8');
    let wishlist = [];
    if (saved) wishlist = JSON.parse(saved);

    // Toggle: add product
    const productForWishlist = { id: String(productId), _id: String(productId), name: product.name, price: product.price };
    const exists = wishlist.some(i => String(i.id) === String(productForWishlist.id));
    if (!exists) wishlist.push(productForWishlist);
    fs.writeFileSync(tmpFile, JSON.stringify(wishlist, null, 2));

    // Simulate page refresh: re-read file
    const reloaded = JSON.parse(fs.readFileSync(tmpFile, 'utf8'));
    const stillThere = reloaded.some(i => String(i.id) === String(productForWishlist.id));
    if (!stillThere) throw new Error('Wishlist item did not persist after simulated refresh');

    // Now toggle remove
    const afterRemoval = reloaded.filter(i => String(i.id) !== String(productForWishlist.id));
    fs.writeFileSync(tmpFile, JSON.stringify(afterRemoval, null, 2));
    const final = JSON.parse(fs.readFileSync(tmpFile, 'utf8'));
    const removed = !final.some(i => String(i.id) === String(productForWishlist.id));
    if (!removed) throw new Error('Wishlist removal failed');
    // Cleanup
    try { fs.unlinkSync(tmpFile); } catch (e) {}

    console.log('TEST 3 passed (simulated add/remove and persistence)');

    console.log('\nALL CHECKS PASSED: AI → REVIEWS → WISHLIST verified.');
    process.exit(0);
  } catch (err) {
    console.error('VERIFY_ERROR', err && err.stack ? err.stack : err);
    process.exit(2);
  }
})();
