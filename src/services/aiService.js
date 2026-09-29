import { API_CONFIG, apiFetch, simulateDelay } from './api';
import { PRODUCTS } from '../data/mockData';

export const aiService = {
  async sendMessage(message, history = []) {
    if (!API_CONFIG.USE_MOCK_API) {
      return apiFetch('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message, history })
      });
    }

    await simulateDelay(400);
    return {
      id: `msg-ai-${Date.now()}`,
      sender: 'ai',
      text: 'Here are a few products that may match your request.',
      recommendedProducts: PRODUCTS.slice(0, 3),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }
};
