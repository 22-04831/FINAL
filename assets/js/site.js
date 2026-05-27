
function $(selector, root=document){return root.querySelector(selector)}
function $all(selector, root=document){return [...root.querySelectorAll(selector)]}

// Evidence gallery logic, only runs on evidence.html
if (document.body.dataset.page === 'evidence' && window.EVIDENCE_ITEMS) {
  const items = window.EVIDENCE_ITEMS;
  const filter = $('#categoryFilter');
  const strip = $('#thumbStrip');
  const featuredImg = $('#featuredImg');
  const featuredCat = $('#featuredCat');
  const featuredTitle = $('#featuredTitle');
  const featuredDesc = $('#featuredDesc');
  const featuredSource = $('#featuredSource');
  const modal = $('#imageModal');
  const modalImage = $('#modalImage');
  const modalCaption = $('#modalCaption');
  const params = new URLSearchParams(location.search);
  const initialFilter = params.get('filter') || 'All';
  let currentItems = [];
  let currentIndex = 0;

  if ([...filter.options].some(o => o.value === initialFilter)) filter.value = initialFilter;

  function renderList() {
    const value = filter.value;
    currentItems = value === 'All' ? items : items.filter(item => item.category === value);
    currentIndex = 0;
    strip.innerHTML = '';
    currentItems.forEach((item, index) => {
      const button = document.createElement('button');
      button.className = 'thumb';
      button.dataset.label = item.category;
      button.innerHTML = `<img src="${item.image}" alt="${item.title}">`;
      button.addEventListener('click', () => setFeatured(index));
      strip.appendChild(button);
    });
    setFeatured(0);
  }

  function setFeatured(index) {
    if (!currentItems.length) return;
    currentIndex = index;
    const item = currentItems[index];
    featuredImg.src = item.image;
    featuredImg.alt = item.title;
    featuredCat.textContent = item.category;
    featuredTitle.textContent = item.title;
    featuredDesc.textContent = item.desc;
    featuredSource.textContent = `${item.source} • ${item.pageLabel}`;
    $all('.thumb', strip).forEach((thumb, i) => thumb.classList.toggle('active', i === index));
  }

  filter.addEventListener('change', renderList);
  featuredImg.addEventListener('click', () => {
    const item = currentItems[currentIndex];
    if (!item) return;
    modalImage.src = item.image;
    modalImage.alt = item.title;
    modalCaption.textContent = `${item.title} — ${item.source}, ${item.pageLabel}`;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  });
  $('#closeModal').addEventListener('click', () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  });
  modal.addEventListener('click', (event) => {
    if (event.target === modal) $('#closeModal').click();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') $('#closeModal')?.click();
    if (event.key === 'ArrowRight' && currentItems.length) setFeatured((currentIndex + 1) % currentItems.length);
    if (event.key === 'ArrowLeft' && currentItems.length) setFeatured((currentIndex - 1 + currentItems.length) % currentItems.length);
  });
  renderList();
}
