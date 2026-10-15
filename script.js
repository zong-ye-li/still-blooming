(() => {
  const themes = { rose: '#d9aaa8', lilac: '#bca7cf', sage: '#b7cba5' };
  const themeButtons = [...document.querySelectorAll('[data-theme]')];
  function setTheme(name) {
    if (!Object.hasOwn(themes, name)) return;
    document.documentElement.style.setProperty('--theme', themes[name]);
    themeButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.theme === name)));
    try { localStorage.setItem('still-blooming-feature-theme', name); } catch {}
  }
  themeButtons.forEach(button => button.addEventListener('click', () => setTheme(button.dataset.theme)));
  try { setTheme(localStorage.getItem('still-blooming-feature-theme')); } catch {}
  const chapterLinks = [...document.querySelectorAll('.chapter-nav a[href]:not(.to-top)')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const current = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!current) return;
      const section = current.target.closest('section');
      chapterLinks.forEach(link => {
        if (link.hash === '#' + section.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-10% 0px -55% 0px', threshold: 0 });
    document.querySelectorAll('.chapter-heading').forEach(heading => observer.observe(heading));
  }
  const shots = [...document.querySelectorAll('[data-viewer]')];
  const dialog = document.querySelector('.image-dialog');
  if (typeof dialog.showModal !== 'function') return;
  const image = document.querySelector('#viewer-image'), stage = document.querySelector('.viewer-stage');
  const size = document.querySelector('#viewer-size'), close = document.querySelector('#viewer-close');
  const previous = document.querySelector('#viewer-prev'), next = document.querySelector('#viewer-next');
  let index = 0;
  function show(position) {
    index = position;
    const source = shots[index].querySelector('img');
    image.src = source.src; image.alt = source.alt;
    document.querySelector('#viewer-caption').textContent = shots[index].closest('figure').querySelector('figcaption').textContent;
    document.querySelector('#viewer-count').textContent = 'Screenshot ' + (index + 1) + ' / ' + shots.length;
    previous.disabled = index === 0; next.disabled = index === shots.length - 1;
    stage.classList.remove('actual-size'); size.setAttribute('aria-pressed', 'false'); size.textContent = 'Actual size';
    stage.scrollTo(0, 0);
  }
  shots.forEach((shot, position) => shot.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); show(position); dialog.showModal(); document.body.classList.add('viewer-open'); close.focus();
  }));
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.body.classList.remove('viewer-open'));
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  size.addEventListener('click', () => { const actual = stage.classList.toggle('actual-size'); size.setAttribute('aria-pressed', String(actual)); size.textContent = actual ? 'Fit to screen' : 'Actual size'; stage.scrollTo(0, 0); });
  previous.addEventListener('click', () => { if (index > 0) show(index - 1); });
  next.addEventListener('click', () => { if (index < shots.length - 1) show(index + 1); });
  dialog.addEventListener('keydown', event => {
    if (event.target === stage && stage.classList.contains('actual-size')) return;
    if (event.key === 'ArrowLeft' && index > 0) { event.preventDefault(); show(index - 1); }
    if (event.key === 'ArrowRight' && index < shots.length - 1) { event.preventDefault(); show(index + 1); }
  });
})();
