import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { PixabayApiService } from './pixabay-service';
import { createMarkup } from './markup';

// ===================================================================

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  guard: document.querySelector('.js-guard'),
  loaderContainer: document.querySelector('.loader-container'),
};
const pixabayApiService = new PixabayApiService();
const galleryLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
const observer = new IntersectionObserver(onLoadMore, { rootMargin: '600px' });
let totalShownImages = 0;

refs.form.addEventListener('submit', onSearch);

function onSearch(evt) {
  evt.preventDefault();
  clearGallery();

  pixabayApiService.query = evt.currentTarget.elements.searchQuery.value.trim();
  if (!pixabayApiService.query) {
    Notify.info('Please, enter your search query.');
    return;
  }

  pixabayApiService.resetPage();
  showElement(refs.loaderContainer);
  loadImages();
}

async function loadImages() {
  try {
    const data = await pixabayApiService.fetchImages();
    const totalHits = data.totalHits;
    const images = data.hits;

    if (!images.length) {
      Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    appendGalleryMarkup(images);

    if (!totalShownImages) {
      Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    totalShownImages += images.length;

    if (totalShownImages < totalHits) {
      observer.observe(refs.guard);
    } else {
      observer.unobserve(refs.guard);
    }
  } catch (err) {
    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  } finally {
    hideElement(refs.loaderContainer);
    galleryLightbox.refresh();
  }
}

function appendGalleryMarkup(images) {
  refs.gallery.insertAdjacentHTML('beforeend', createMarkup(images));
}

function clearGallery() {
  refs.gallery.innerHTML = '';
  totalShownImages = 0;
}

function hideElement(element) {
  element.classList.add('is-hidden');
}

function showElement(element) {
  element.classList.remove('is-hidden');
}

function onLoadMore(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadImages();
    }
  });
}
