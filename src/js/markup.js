function createMarkup(arr) {
  const defaultImg =
    'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';

  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
<div class="photo-card">
    <div class="image-container">
        <a class="original-image" href="${largeImageURL || defaultImg}">
        <img class="preview-image" src="${
          webformatURL || defaultImg
        }" alt="${tags}" loading="lazy" />
        </a>
    </div>
    <div class="info">
        <p class="info-item">
            <b>Likes</b>${likes || '-'}
        </p>
        <p class="info-item">
            <b>Comments</b>${comments || '-'}
        </p>
        <p class="info-item">
            <b>Views</b>${views || '-'}
        </p>
        <p class="info-item">
            <b>Downloads</b>${downloads || '-'}
        </p>
    </div>
</div>`
    )
    .join('');
}

export { createMarkup };
