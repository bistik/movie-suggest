let activeIdx = -1;

function items() {
  return document.querySelectorAll('#title-suggestions .movie');
}

function highlight() {
  items().forEach((p, i) => p.classList.toggle('active', i === activeIdx));
}

function selectSuggestion(p) {
  const selected = p.cloneNode(true);
  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'remove-movie';
  removeBtn.textContent = '×';
  removeBtn.setAttribute('aria-label', 'Remove ' + (selected.querySelector('.movie-title')?.textContent ?? 'movie'));
  selected.append(removeBtn);
  document.getElementById('watched-movies').append(selected);
  const movieId = p.dataset.movieId;
  if (movieId) {
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 'ids';
    hiddenInput.value = movieId;
    document.getElementById('suggest-form').append(hiddenInput);
  }
  p.remove();
  activeIdx = -1;
}

document.getElementById('watched-movies').addEventListener('click', (e) => {
  const removeBtn = e.target.closest('.remove-movie');
  if (removeBtn) {
    const movie = removeBtn.closest('.movie');
    const movieId = movie?.dataset.movieId;
    if (movieId) {
      document.querySelector(`#suggest-form input[name="ids"][value="${movieId}"]`)?.remove();
    }
    movie?.remove();
  }
});

document.body.addEventListener('htmx:configRequest', (e) => {
  const elt = e.detail.elt;
  if (elt?.name === 'title' && elt.value.trim().length < 2) {
    e.preventDefault();
    document.getElementById('title-suggestions').innerHTML = '';
    activeIdx = -1;
  }
});

document.getElementById('title-suggestions').addEventListener('click', (e) => {
  const p = e.target.closest('.movie');
  if (p) selectSuggestion(p);
});

document.querySelector('input[name="title"]').addEventListener('keydown', (e) => {
  const list = items();
  if (!list.length) return;
  if (e.key === 'ArrowDown') {
    activeIdx = (activeIdx + 1) % list.length;
    highlight();
    e.preventDefault();
  } else if (e.key === 'ArrowUp') {
    activeIdx = (activeIdx - 1 + list.length) % list.length;
    highlight();
    e.preventDefault();
  } else if (e.key === 'Enter' && activeIdx >= 0) {
    selectSuggestion(list[activeIdx]);
    e.preventDefault();
  } else if (e.key === 'Escape') {
    document.getElementById('title-suggestions').innerHTML = '';
    activeIdx = -1;
  }
});

document.getElementById('title-suggestions').addEventListener('htmx:afterSwap', () => {
  activeIdx = -1;
  highlight();
});
