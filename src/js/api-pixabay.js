import axios from 'axios';

// ========================================================

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '32119761-f60b77538f277e08da301bce8';
const axiosPixabay = axios.create();

async function fetchImages(value) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: value,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });

  const response = await axiosPixabay.get(`${BASE_URL}?${params}`);

  const dataComponents = response.data.hits.map(item => {
    return ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    } = item);
  });
  return dataComponents;
}

export { fetchImages };
