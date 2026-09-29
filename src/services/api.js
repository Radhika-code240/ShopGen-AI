// API Service Configuration & Wrapper

// Central toggle: Set USE_MOCK_API to false when connecting to Node.js/Express backend
export const API_CONFIG = {
  USE_MOCK_API: false,
  BASE_URL: 'http://localhost:5000/api',
  SIMULATED_DELAY_MS: 300
};

// Helper helper to simulate network delay for realistic async frontend workflow
export const simulateDelay = (ms = API_CONFIG.SIMULATED_DELAY_MS) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Generic HTTP fetch wrapper ready for backend REST API integration
export async function apiFetch(endpoint, options = {}) {
  if (API_CONFIG.USE_MOCK_API) {
    throw new Error(`Mock mode active. Calling endpoint '${endpoint}' should be handled by service mock logic.`);
  }

  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('shopgen_token') || ''}`
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP Request Failed: ${response.status}`);
  }

  return response.json();
}
