import { get } from '../utils/api';

// Base URL for the API
const API_BASE = '/api';

/**
 * Service for interacting with cat-related API endpoints
 */
const catService = {
  /**
   * Get all cats
   * @param {Object} [location] - Optional location object with lat and lng
   * @returns {Promise<Array>} - List of cats
   */
  getAllCats: async (location = null) => {
    try {
      let url = `${API_BASE}/cats`;
      
      // If location is provided, add it as query parameters
      if (location && location.lat !== undefined && location.lng !== undefined) {
        url += `?lat=${location.lat}&lng=${location.lng}`;
      }
      
      const response = await get(url);
      // The API returns { cats: [...], totalCats: X }
      return response.cats || [];
    } catch (error) {
      console.error('Failed to fetch cats:', error);
      throw error;
    }
  },

  /**
   * Get a single cat by ID
   * @param {string|number} id - The cat's ID
   * @returns {Promise<Object>} - The cat data
   */
  getCatById: async (id) => {
    try {
      return await get(`${API_BASE}/cats/${id}`);
    } catch (error) {
      console.error(`Failed to fetch cat with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Search for cats by name, breed, or description
   * @param {string} query - The search query
   * @returns {Promise<Array>} - List of matching cats
   */
  searchCats: async (query) => {
    try {
      // In a real app, this would be: return api.get('/cats/search', { q: query });
      return await catApi.searchCats(query);
    } catch (error) {
      console.error('Failed to search cats:', error);
      throw error;
    }
  },

  /**
   * Add a new cat to the collection
   * @param {Object} catData - The cat data to add
   * @returns {Promise<Object>} - The added cat data
   */
  addCat: async (catData) => {
    try {
      return await post(`${API_BASE}/cats`, catData);
    } catch (error) {
      console.error('Failed to add cat:', error);
      throw error;
    }
  },
};

export default catService;
