// Mock cat data
export const mockCats = [
  {
    id: '1',
    name: 'Whiskers',
    pic: 'https://cataas.com/cat?type=medium&rand=1',
    age: 3,
    breed: 'Tabby',
    description: 'A playful and curious tabby who loves to explore.'
  },
  {
    id: '2',
    name: 'Mittens',
    pic: 'https://cataas.com/cat?type=medium&rand=2',
    age: 2,
    breed: 'Siamese',
    description: 'A vocal and affectionate Siamese who loves attention.'
  },
  {
    id: '3',
    name: 'Oliver',
    pic: 'https://cataas.com/cat?type=medium&rand=3',
    age: 5,
    breed: 'Maine Coon',
    description: 'A gentle giant who loves to cuddle.'
  },
  {
    id: '4',
    name: 'Luna',
    pic: 'https://cataas.com/cat?type=medium&rand=4',
    age: 1,
    breed: 'Tuxedo',
    description: 'A playful kitten with endless energy.'
  },
  {
    id: '5',
    name: 'Leo',
    pic: 'https://cataas.com/cat?type=medium&rand=5',
    age: 4,
    breed: 'Bengal',
    description: 'An active and intelligent cat who loves to climb.'
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const catApi = {
  // Get all cats
  getAllCats: async () => {
    await delay(300); // Simulate network delay
    return [...mockCats];
  },
  
  // Get a single cat by ID
  getCatById: async (id) => {
    await delay(200); // Simulate network delay
    const cat = mockCats.find(cat => cat.id === id);
    if (!cat) {
      throw new Error(`Cat with ID ${id} not found`);
    }
    return { ...cat }; // Return a copy to prevent direct mutation
  },
  
  // Search cats by name or description
  searchCats: async (query) => {
    await delay(300); // Simulate network delay
    if (!query) return [...mockCats];
    
    const lowerQuery = query.toLowerCase();
    return mockCats.filter(
      cat => 
        cat.name.toLowerCase().includes(lowerQuery) ||
        cat.breed.toLowerCase().includes(lowerQuery) ||
        cat.description.toLowerCase().includes(lowerQuery)
    );
  }
};

export default catApi;
