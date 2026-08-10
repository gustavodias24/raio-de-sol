(() => {
  const body = document.body;
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.nav');

  const closeMenu = () => {
    body.classList.remove('menu-open');
    if (menuButton) {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menu');
    }
  };

  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const willOpen = !body.classList.contains('menu-open');
      body.classList.toggle('menu-open', willOpen);
      menuButton.setAttribute('aria-expanded', String(willOpen));
      menuButton.setAttribute('aria-label', willOpen ? 'Fechar menu' : 'Abrir menu');
    });

    navigation.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  const updateHeader = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 12);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  document.querySelectorAll('.accordion__item button').forEach((button) => {
    button.addEventListener('click', () => {
      const currentItem = button.closest('.accordion__item');
      const alreadyOpen = currentItem.classList.contains('is-open');

      document.querySelectorAll('.accordion__item').forEach((item) => {
        item.classList.remove('is-open');
        item.querySelector('button')?.setAttribute('aria-expanded', 'false');
      });

      if (!alreadyOpen) {
        currentItem.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });

  const revealElements = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            activeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px' }
    );

    revealElements.forEach((element) => observer.observe(element));
  }

  const year = document.getElementById('current-year');
  if (year) year.textContent = new Date().getFullYear();
})();
