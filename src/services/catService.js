import { catApi } from '../data/cats';

/**
 * Service for interacting with cat-related API endpoints
 */
const catService = {
  /**
   * Get all cats
   * @returns {Promise<Array>} - List of cats
   */
  getAllCats: async () => {
    try {
      // In a real app, this would be: return api.get('/cats');
      return await catApi.getAllCats();
    } catch (error) {
      console.error('Failed to fetch cats:', error);
      throw error;
    }
  },

  /**
   * Get a single cat by ID
   * @param {string} id - The cat's ID
   * @returns {Promise<Object>} - The cat data
   */
  getCatById: async (id) => {
    try {
      // In a real app, this would be: return api.get(`/cats/${id}`);
      return await catApi.getCatById(id);
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
      // In a real app, this would be: return api.post('/cats', catData);
      // For now, we'll just return the data with a new ID
      const newCat = {
        ...catData,
        id: Date.now().toString(),
      };
      // In a real implementation, we would add this to our mock data
      return newCat;
    } catch (error) {
      console.error('Failed to add cat:', error);
      throw error;
    }
  },
};

export default catService;
