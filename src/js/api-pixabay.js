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
    per_page: 40,
  });

  const response = await axiosPixabay.get(`${BASE_URL}?${params}`);

  const totalHits = response.data.totalHits;
  console.log(totalHits);

  const dataComponents = response.data.hits.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      return {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      };
    }
  );

  return dataComponents;
}

export { fetchImages };
