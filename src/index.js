import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { PixabayApiService } from './js/pixabay-service';
import { createMarkup } from './js/markup';

// ===================================================================

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  loaderContainer: document.querySelector('.loader-container'),
};
const pixabayApiService = new PixabayApiService();
const galleryLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

let totalShownImages = 0;

refs.loadMoreBtn.hidden = true;

refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(evt) {
  evt.preventDefault();
  clearGallery();
  showElement(refs.loaderContainer);

  pixabayApiService.query = evt.currentTarget.elements.searchQuery.value;
  if (!pixabayApiService.query) {
    Notify.info('Please, enter your search query.');
    hideElement(refs.loaderContainer);

    return;
  }

  pixabayApiService.resetPage();
  totalShownImages = 0;

  loadImages();
}

function onLoadMore() {
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
    } else {
      smoothScroll();
    }

    totalShownImages += images.length;

    if (totalShownImages < totalHits) {
      showElement(refs.loadMoreBtn);
    } else {
      hideElement(refs.loadMoreBtn);
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
}

function hideElement(element) {
  element.classList.add('is-hidden');
}

function showElement(element) {
  element.classList.remove('is-hidden');
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
