export const env = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API === 'true',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
}
