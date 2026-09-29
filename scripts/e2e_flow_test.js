(async () => {
  try {
    const fetch = globalThis.fetch || require('node-fetch');
    const base = 'http://localhost:5000';
    const email = `e2e_${Date.now()}@example.com`;
    console.log('TEST_EMAIL', email);

    // Register
    let res = await fetch(`${base}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'E2E User', email, password: 'Password123' })
    });
    console.log('REGISTER status', res.status);
    let bodyText = await res.text();
    try { console.log('REGISTER body', JSON.parse(bodyText)); } catch (e) { console.log('REGISTER body raw', bodyText); }

    // Login
    res = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'Password123' })
    });
    console.log('LOGIN status', res.status);
    const loginBody = await res.json();
    console.log('LOGIN body', loginBody);
    const token = loginBody.token;
    if (!token) throw new Error('Login failed: no token');
    const authHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    // Get products
    res = await fetch(`${base}/api/products`);
    console.log('GET /products status', res.status);
    const products = await res.json();
    if (!Array.isArray(products) || products.length === 0) throw new Error('No products available');
    console.log('PRODUCTS count', products.length);
    const prod = products[0];
    const prodId = prod._id || prod.id;
    console.log('USING_PRODUCT', prodId, prod.name || prod.title);

    // Add to cart
    res = await fetch(`${base}/api/cart`, {
      method: 'POST', headers: authHeaders, body: JSON.stringify({ productId: prodId, quantity: 1 })
    });
    console.log('ADD TO CART status', res.status);
    let cart = await res.json();
    console.log('CART items after add', cart.items.map(i => ({ productId: i.product._id || i.product.id, qty: i.quantity })));

    // Update quantity
    res = await fetch(`${base}/api/cart/${prodId}`, {
      method: 'PUT', headers: authHeaders, body: JSON.stringify({ quantity: 2 })
    });
    console.log('UPDATE QTY status', res.status);
    cart = await res.json();
    console.log('CART after update', cart.items.map(i => ({ productId: i.product._id || i.product.id, qty: i.quantity })));

    // Remove item
    res = await fetch(`${base}/api/cart/${prodId}`, { method: 'DELETE', headers: authHeaders });
    console.log('REMOVE status', res.status);
    cart = await res.json();
    console.log('CART after remove length', cart.items.length);

    // Add again
    res = await fetch(`${base}/api/cart`, {
      method: 'POST', headers: authHeaders, body: JSON.stringify({ productId: prodId, quantity: 1 })
    });
    console.log('ADD AGAIN status', res.status);
    cart = await res.json();
    console.log('CART after add again', cart.items.map(i => ({ productId: i.product._id || i.product.id, qty: i.quantity })));

    // Place order
    const shipping = { street: '123 Test St', city: 'Testville', state: 'TS', pincode: '123456' };
    res = await fetch(`${base}/api/orders`, { method: 'POST', headers: authHeaders, body: JSON.stringify({ shippingAddress: shipping }) });
    console.log('PLACE ORDER status', res.status);
    const orderRes = await res.json();
    console.log('ORDER RESPONSE', orderRes.message || JSON.stringify(orderRes));

    // Get orders
    res = await fetch(`${base}/api/orders`, { method: 'GET', headers: authHeaders });
    console.log('GET ORDERS status', res.status);
    const orders = await res.json();
    console.log('ORDERS count', Array.isArray(orders) ? orders.length : 0);
    if (Array.isArray(orders) && orders.length > 0) console.log('LATEST ORDER ID', orders[0]._id || orders[0].id);

    console.log('E2E_FLOW_DONE');
    process.exit(0);
  } catch (err) {
    console.error('E2E_ERROR', err && err.stack ? err.stack : err);
    process.exit(1);
  }
})();
