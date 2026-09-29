import { API_CONFIG, simulateDelay, apiFetch } from './api';

const MOCK_USER = {
  id: 'usr-101',
  name: 'Alex Chen',
  email: 'alex.chen@example.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  role: 'customer'
};

export const authService = {
  // POST /api/auth/login
  async login(email, password) {
    if (!API_CONFIG.USE_MOCK_API) {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      const user = {
        id: res._id,
        _id: res._id,
        name: res.name,
        email: res.email,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        role: 'customer'
      };

      if (res.token) {
        localStorage.setItem('shopgen_token', res.token);
      }
      localStorage.setItem('shopgen_user', JSON.stringify(user));

      return { user, token: res.token, message: res.message };
    }

    await simulateDelay(400);

    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    // Mock validation
    const user = { ...MOCK_USER, email };
    const token = 'mock-jwt-token-xyz123';

    localStorage.setItem('shopgen_user', JSON.stringify(user));
    localStorage.setItem('shopgen_token', token);

    return { user, token, message: 'Login successful!' };
  },

  // POST /api/auth/register
  async register(name, email, password) {
    if (!API_CONFIG.USE_MOCK_API) {
      const res = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });

      const user = res.user ? {
        id: res.user._id,
        _id: res.user._id,
        name: res.user.name,
        email: res.user.email,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        role: 'customer'
      } : null;

      if (res.token) {
        localStorage.setItem('shopgen_token', res.token);
      }
      if (user) {
        localStorage.setItem('shopgen_user', JSON.stringify(user));
      }

      return { user, token: res.token, message: res.message };
    }

    await simulateDelay(500);

    if (!name || !email || !password) {
      throw new Error('All fields are required for registration.');
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      role: 'customer'
    };
    const token = `mock-jwt-token-${Date.now()}`;

    localStorage.setItem('shopgen_user', JSON.stringify(newUser));
    localStorage.setItem('shopgen_token', token);

    return { user: newUser, token, message: 'Account created successfully!' };
  },

  getCurrentUser() {
    const saved = localStorage.getItem('shopgen_user');
    if (saved) {
      return JSON.parse(saved);
    }
    return API_CONFIG.USE_MOCK_API ? MOCK_USER : null;
  },

  logout() {
    localStorage.removeItem('shopgen_user');
    localStorage.removeItem('shopgen_token');
  }
};
