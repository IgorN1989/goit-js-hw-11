import axios from 'axios';

// ===================================================================

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '32119761-f60b77538f277e08da301bce8';
const axiosPixabay = axios.create();

class PixabayApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    const params = new URLSearchParams({
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: 40,
    });
    const response = await axiosPixabay.get(`${BASE_URL}?${params}`);

    this.incrementPage();

    return response.data;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}

export { PixabayApiService };
