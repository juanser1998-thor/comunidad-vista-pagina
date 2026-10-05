(() => {
  const header = document.querySelector('[data-header]');
  const menu = document.querySelector('[data-menu]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const galleryItems = [...document.querySelectorAll('.gallery-item')];
  const lightbox = document.querySelector('[data-lightbox]');
  const lightboxImage = document.querySelector('[data-lightbox-image]');
  const lightboxCaption = document.querySelector('[data-lightbox-caption]');
  const visibleItems = galleryItems;
  let currentIndex = 0;

  const setHeaderState = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 24);
  };

  const closeMenu = () => {
    menu?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-menu-open');
  };

  menuToggle?.addEventListener('click', () => {
    const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(willOpen));
    menu?.classList.toggle('is-open', willOpen);
    document.body.classList.toggle('is-menu-open', willOpen);
  });

  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

  const showLightboxItem = (index) => {
    if (!visibleItems.length || !lightboxImage || !lightboxCaption) return;
    currentIndex = (index + visibleItems.length) % visibleItems.length;
    const item = visibleItems[currentIndex];
    lightboxImage.src = item.dataset.full;
    lightboxImage.alt = item.querySelector('img')?.alt || '';
    lightboxCaption.textContent = item.dataset.caption || '';
  };

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      showLightboxItem(visibleItems.indexOf(item));
      lightbox?.showModal();
    });
  });

  document.querySelector('[data-lightbox-close]')?.addEventListener('click', () => lightbox?.close());
  document.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => showLightboxItem(currentIndex - 1));
  document.querySelector('[data-lightbox-next]')?.addEventListener('click', () => showLightboxItem(currentIndex + 1));

  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close();
  });

  lightbox?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showLightboxItem(currentIndex - 1);
    if (event.key === 'ArrowRight') showLightboxItem(currentIndex + 1);
  });

  window.addEventListener('scroll', setHeaderState, { passive: true });
  setHeaderState();
})();
