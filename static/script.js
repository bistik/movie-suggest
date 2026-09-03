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
  p.remove();
  activeIdx = -1;
}

document.getElementById('watched-movies').addEventListener('click', (e) => {
  if (e.target.closest('.remove-movie')) {
    e.target.closest('.movie')?.remove();
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
