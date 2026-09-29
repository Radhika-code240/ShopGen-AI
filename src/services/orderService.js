import { MOCK_ORDERS } from '../data/mockData';
import { API_CONFIG, simulateDelay, apiFetch } from './api';

// Helper to normalize backend order objects for frontend component compatibility
const mapOrder = (rawOrder) => {
  if (!rawOrder) return null;

  const items = (rawOrder.items || []).map((item) => {
    const prod = item.product || {};
    return {
      id: prod._id || prod.id || item._id,
      _id: prod._id || prod.id || item._id,
      name: prod.name || 'Product',
      price: prod.price || 0,
      quantity: item.quantity || 1,
      image: prod.image || '',
      product: {
        ...prod,
        id: prod._id || prod.id
      }
    };
  });

  const rawAddr = rawOrder.shippingAddress || {};
  const shippingAddress = {
    fullName: rawAddr.fullName || '',
    address: rawAddr.street || rawAddr.address || '',
    street: rawAddr.street || rawAddr.address || '',
    city: rawAddr.city || '',
    state: rawAddr.state || '',
    pincode: rawAddr.pincode || rawAddr.zipCode || '',
    zipCode: rawAddr.pincode || rawAddr.zipCode || ''
  };

  const id = rawOrder._id || rawOrder.id;
  const totalPrice = rawOrder.totalAmount !== undefined ? rawOrder.totalAmount : (rawOrder.totalPrice || 0);

  return {
    ...rawOrder,
    id,
    _id: id,
    date: rawOrder.createdAt ? new Date(rawOrder.createdAt).toISOString().split('T')[0] : (rawOrder.date || ''),
    status: rawOrder.status || 'Placed',
    totalPrice,
    totalAmount: totalPrice,
    itemsCount: items.length,
    items,
    shippingAddress
  };
};

export const orderService = {
  // GET /api/orders
  async getOrders() {
    if (!API_CONFIG.USE_MOCK_API) {
      const res = await apiFetch('/orders');
      const rawOrders = Array.isArray(res) ? res : [];
      return rawOrders.map(mapOrder);
    }

    await simulateDelay(300);
    const savedOrders = localStorage.getItem('shopgen_orders');
    if (savedOrders) {
      return JSON.parse(savedOrders);
    }
    localStorage.setItem('shopgen_orders', JSON.stringify(MOCK_ORDERS));
    return MOCK_ORDERS;
  },

  // GET /api/orders/:id
  async getOrderById(id) {
    if (!API_CONFIG.USE_MOCK_API) {
      const res = await apiFetch(`/orders/${id}`);
      return mapOrder(res);
    }

    await simulateDelay(300);
    const orders = await this.getOrders();
    return orders.find(o => o.id === id || o._id === id);
  },

  // POST /api/orders
  async createOrder(shippingAddressInput) {
    if (!API_CONFIG.USE_MOCK_API) {
      // Backend expects { shippingAddress: { street, city, state, pincode } }
      const shippingAddress = {
        street: shippingAddressInput.street || shippingAddressInput.address || '',
        city: shippingAddressInput.city || '',
        state: shippingAddressInput.state || '',
        pincode: shippingAddressInput.pincode || shippingAddressInput.zipCode || ''
      };

      const res = await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify({ shippingAddress })
      });

      // Backend returns { message: "...", order: { ... } }
      const createdRawOrder = res.order || res;
      return mapOrder(createdRawOrder);
    }

    await simulateDelay(600);

    const orders = await this.getOrders();
    const newOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Processing',
      totalPrice: shippingAddressInput.totalAmount || 0,
      itemsCount: (shippingAddressInput.items || []).length,
      items: (shippingAddressInput.items || []).map(item => ({
        id: item.product?.id || item.product?._id,
        name: item.product?.name,
        price: item.product?.price,
        quantity: item.quantity,
        image: item.product?.image
      })),
      shippingAddress: shippingAddressInput.shippingAddress || shippingAddressInput
    };

    const updatedOrders = [newOrder, ...orders];
    localStorage.setItem('shopgen_orders', JSON.stringify(updatedOrders));

    return newOrder;
  }
};
