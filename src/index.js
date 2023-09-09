import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { fetchImages } from './js/api-pixabay';
import { createMarkup } from './js/markup';

// ========================================================

const elements = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const optionsForLightBox = {
  captionsData: 'alt',
  captionDelay: 250,
  download: true,
};

const galleryLightbox = new SimpleLightbox('.gallery a', optionsForLightBox);

elements.form.addEventListener('submit', onSubmitForm);

async function onSubmitForm(evt) {
  evt.preventDefault();
  elements.gallery.innerHTML = '';

  const searchValue = new FormData(evt.currentTarget).get('searchQuery');
  if (!searchValue) {
    Notify.warning('Please enter query for search');
    return;
  }

  try {
    const images = await fetchImages(searchValue);
    console.log(images);
    if (!images.length) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    Notify.info(`Hooray! We found ${totalHits} images.`);
    elements.gallery.innerHTML = createMarkup(images);
  } catch (err) {
    Notify.failure(`Oops! Something went wrong! Try reloading the page!`);
  } finally {
    galleryLightbox.refresh();
    elements.form.reset();
  }
}
