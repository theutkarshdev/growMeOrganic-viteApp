export default class ProductService {
    async getArtworks(page: number, rows: number = 10) {
      try {
        const response = await fetch(
          `https://api.artic.edu/api/v1/artworks?page=${page}&limit=${rows}`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch artworks: ${response.statusText}`);
        }
        
        const data = await response.json();
        return {
          artworks: data.data || [],
          total: data.pagination?.total || 0,
        };
      } catch (error) {
        console.error("Error fetching artworks:", error);
        return {
          artworks: [],
          total: 0,
        };
      }
    }
  }
  