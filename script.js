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

  const testimonyTabs = [...document.querySelectorAll('[data-testimony-target]')];
  const testimonyPanels = [...document.querySelectorAll('[data-testimony-panel]')];
  const testimonyNote = document.querySelector('[data-testimony-note]');
  const testimonyNotes = [
    'Testimonio 01 · La experiencia contada por quienes hicieron parte del encuentro.',
    'Testimonio 02 · Aprendizajes y conexiones que permanecen después del congreso.',
    'Testimonio 03 · Una mirada personal a lo vivido junto a la comunidad.'
  ];

  const activateTestimony = (tab, shouldFocus = false) => {
    const targetId = tab.dataset.testimonyTarget;
    const activeIndex = testimonyTabs.indexOf(tab);

    testimonyTabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-selected', String(isActive));
      item.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    testimonyPanels.forEach((panel) => {
      const isActive = panel.id === targetId;
      const video = panel.querySelector('video');
      if (!isActive) video?.pause();
      panel.hidden = !isActive;
      panel.classList.toggle('is-active', isActive);

      if (isActive && video && !video.dataset.prepared) {
        video.preload = 'metadata';
        video.load();
        video.dataset.prepared = 'true';
      }
    });

    if (testimonyNote) testimonyNote.textContent = testimonyNotes[activeIndex] || '';
    if (shouldFocus) tab.focus();
  };

  testimonyTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTestimony(tab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const offset = event.key === 'ArrowRight' ? 1 : -1;
      const nextTab = testimonyTabs[(index + offset + testimonyTabs.length) % testimonyTabs.length];
      activateTestimony(nextTab, true);
    });
  });

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
