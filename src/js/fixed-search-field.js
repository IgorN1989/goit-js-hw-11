window.onscroll = () => changeSearchBackground();

function changeSearchBackground() {
  const search = document.querySelector('.form-container');
  const searchOffsetTrigger = search.offsetHeight;
  const pageOffset = window.scrollY;

  if (pageOffset > searchOffsetTrigger) {
    search.classList.add('no-transparency');
  } else {
    search.classList.remove('no-transparency');
  }
}
