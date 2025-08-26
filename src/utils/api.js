/**
 * API Utility for making HTTP requests
 * This uses the Fetch API with error handling and JSON parsing
 */

// Base URL for the API (empty for now as we're using mock data)
const API_BASE_URL = '';

/**
 * Make an API request
 * @param {string} endpoint - The API endpoint (e.g., '/cats')
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<any>} - The parsed JSON response
 */
export const fetchApi = async (endpoint, options = {}) => {
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Create the full URL
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Create the request config
  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    
    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || 'Something went wrong');
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    // Parse and return the JSON response
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Make a GET request
 * @param {string} endpoint - The API endpoint
 * @param {Object} query - Query parameters as an object
 * @returns {Promise<any>} - The response data
 */
export const get = async (endpoint, query = {}) => {
  const queryString = new URLSearchParams(query).toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;
  return fetchApi(url, { method: 'GET' });
};

/**
 * Make a POST request
 * @param {string} endpoint - The API endpoint
 * @param {Object} data - The data to send in the request body
 * @returns {Promise<any>} - The response data
 */
export const post = async (endpoint, data = {}) => {
  return fetchApi(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Make a PUT request
 * @param {string} endpoint - The API endpoint
 * @param {Object} data - The data to send in the request body
 * @returns {Promise<any>} - The response data
 */
export const put = async (endpoint, data = {}) => {
  return fetchApi(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * Make a DELETE request
 * @param {string} endpoint - The API endpoint
 * @returns {Promise<any>} - The response data
 */
export const del = async (endpoint) => {
  return fetchApi(endpoint, { method: 'DELETE' });
};

// Export all HTTP methods
export default {
  get,
  post,
  put,
  del,
  request: fetchApi,
};
