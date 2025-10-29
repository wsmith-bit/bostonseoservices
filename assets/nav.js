const mount = document.getElementById('site-nav');

if (!mount) {
  console.warn('Navigation mount point #site-nav not found.');
} else {
  const navHTML = `
    <div class="site-header" role="banner">
      <div class="inner">
        <a class="brand" href="/" aria-label="Boston SEO Services home">
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3l9 8h-3v9h-5v-6h-2v6H6v-9H3z"></path></svg>
          <span>Boston SEO Services</span>
        </a>
        <button type="button" class="menu-toggle" aria-expanded="false" aria-controls="primary-menu">
          <span class="bars"><span class="bar"></span></span>
          <span class="sr-only">Menu</span>
        </button>
      </div>
      <div class="overlay" data-js="overlay" hidden aria-hidden="true"></div>
      <nav aria-label="Primary navigation">
        <ul id="primary-menu" class="primary" data-js="menu">
          <li><a href="/how-ai-search-is-changing-business-2025.html">How AI Search Is Changing Business</a></li>
          <li><a href="/nyc-seo-services.html">NYC SEO Services</a></li>
          <li class="dropdown" aria-expanded="false">
            <button type="button" class="dropdown-toggle" data-js="dropdown-toggle" aria-haspopup="true" aria-expanded="false" aria-controls="ai-guides-submenu">
              AI Guides
              <svg class="chev" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 10l5 5 5-5z"></path></svg>
            </button>
            <ul class="dropdown-menu" id="ai-guides-submenu">
              <li><a href="/ultimate-guide-to-ai-search-optimization.html">Ultimate Guide to AI Search Optimization</a></li>
              <li><a href="/ai-first-seo-strategies-2025.html">AI-First SEO Strategies 2025</a></li>
              <li><a href="/ai-search-visibility-audit-tool.html">AI Search Visibility Audit Tool</a></li>
            </ul>
          </li>
          <li><a href="/contact.html">Contact</a></li>
        </ul>
      </nav>
    </div>
  `;

  mount.innerHTML = navHTML.trim();

  const header = mount.querySelector('.site-header');
  const menuBtn = header.querySelector('.menu-toggle');
  const menu = header.querySelector('[data-js="menu"]');
  const overlay = header.querySelector('[data-js="overlay"]');
  const dropBtn = header.querySelector('[data-js="dropdown-toggle"]');
  const dropdown = dropBtn ? dropBtn.closest('.dropdown') : null;
  const submenu = header.querySelector('#ai-guides-submenu');
  const brandLink = header.querySelector('.brand');

  const focusableSelectors = 'a[href]:not([tabindex="-1"]), button:not([disabled]):not([aria-hidden="true"]), [tabindex]:not([tabindex="-1"])';
  const mediaQuery = window.matchMedia('(min-width: 768px)');
  let lastFocusedElement = null;

  const isDesktop = () => mediaQuery.matches;
  const isMenuOpen = () => menuBtn.getAttribute('aria-expanded') === 'true';
  const getFocusableItems = () =>
    Array.from(menu.querySelectorAll(focusableSelectors)).filter((el) =>
      el.offsetParent !== null || el.getClientRects().length > 0
    );

  if (submenu) {
    submenu.setAttribute('aria-hidden', 'true');
  }

  const toggleDropdown = (force) => {
    if (!dropdown || !dropBtn || !submenu) return;
    const isOpen = dropdown.getAttribute('aria-expanded') === 'true';
    const shouldOpen = typeof force === 'boolean' ? force : !isOpen;
    dropdown.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    dropBtn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    submenu.setAttribute('aria-hidden', shouldOpen ? 'false' : 'true');
    if (shouldOpen) {
      dropBtn.classList.add('active');
    } else {
      dropBtn.classList.remove('active');
    }
  };

  const openMenu = () => {
    if (isDesktop()) return;
    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    menu.hidden = false;
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('show');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    header.dataset.menuState = 'open';
    const focusables = getFocusableItems();
    const first = focusables[0];
    if (first) {
      requestAnimationFrame(() => first.focus());
    }
  };

  const closeMenu = ({ focusToggle = true } = {}) => {
    menuBtn.setAttribute('aria-expanded', 'false');
    header.dataset.menuState = 'closed';
    overlay.classList.remove('show');
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    if (!isDesktop()) {
      menu.hidden = true;
    } else {
      menu.hidden = false;
    }
    toggleDropdown(false);
    if (focusToggle) {
      requestAnimationFrame(() => {
        menuBtn.focus();
        lastFocusedElement = null;
      });
    } else if (lastFocusedElement) {
      requestAnimationFrame(() => {
        if (lastFocusedElement) {
          lastFocusedElement.focus();
          lastFocusedElement = null;
        }
      });
    } else {
      lastFocusedElement = null;
    }
  };

  const syncMenuToViewport = (event) => {
    const matches = event?.matches ?? isDesktop();
    if (matches) {
      closeMenu({ focusToggle: false });
      menu.hidden = false;
    } else if (!isMenuOpen()) {
      menu.hidden = true;
    }
  };

  syncMenuToViewport(mediaQuery);
  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', syncMenuToViewport);
  } else if (typeof mediaQuery.addListener === 'function') {
    mediaQuery.addListener(syncMenuToViewport);
  }

  menuBtn.addEventListener('click', () => {
    if (isMenuOpen()) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', () => closeMenu());

  menu.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof HTMLAnchorElement && !isDesktop()) {
      closeMenu({ focusToggle: false });
    }
  });

  const handleKeydown = (event) => {
    if (event.key === 'Escape') {
      if (isMenuOpen() && !isDesktop()) {
        event.preventDefault();
        closeMenu();
        return;
      }
      if (dropdown && dropdown.getAttribute('aria-expanded') === 'true') {
        toggleDropdown(false);
      }
    }

    if (event.key === 'Tab' && isMenuOpen() && !isDesktop()) {
      const focusables = getFocusableItems();
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) {
        event.preventDefault();
        menuBtn.focus();
        return;
      }
      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          menuBtn.focus();
        } else if (document.activeElement === menuBtn) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          event.preventDefault();
          menuBtn.focus();
        } else if (document.activeElement === menuBtn) {
          event.preventDefault();
          first.focus();
        }
      }
    }
  };

  document.addEventListener('keydown', handleKeydown);

  if (dropBtn && dropdown) {
    dropBtn.addEventListener('click', () => {
      const isOpen = dropdown.getAttribute('aria-expanded') === 'true';
      toggleDropdown(!isOpen);
    });

    dropdown.addEventListener('mouseenter', () => {
      if (isDesktop()) toggleDropdown(true);
    });
    dropdown.addEventListener('mouseleave', () => {
      if (isDesktop()) toggleDropdown(false);
    });
    dropdown.addEventListener('focusin', () => toggleDropdown(true));
    dropdown.addEventListener('focusout', (event) => {
      const next = event.relatedTarget;
      if (!(next instanceof HTMLElement) || !dropdown.contains(next)) {
        toggleDropdown(false);
      }
    });

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && dropdown && !dropdown.contains(target)) {
        toggleDropdown(false);
      }
    });
  }

  const setActiveLink = () => {
    const normalisePath = (path) => {
      if (!path) return '/';
      const url = new URL(path, window.location.origin);
      let pathname = url.pathname.toLowerCase();
      pathname = pathname.replace(/index\.html?$/i, '/');
      pathname = pathname.replace(/\/+$/, '');
      return pathname || '/';
    };

    const currentPath = normalisePath(window.location.pathname);
    const links = header.querySelectorAll('a[href]');
    links.forEach((link) => {
      const linkPath = normalisePath(link.getAttribute('href'));
      if (linkPath === currentPath) {
        link.classList.add('active');
      }
    });

    if (dropdown && submenu && submenu.querySelector('a.active')) {
      dropBtn.classList.add('active');
    }

    if (brandLink) {
      const homePaths = ['/', '/index.html', '/index.htm'];
      if (homePaths.includes(currentPath)) {
        brandLink.classList.add('active');
      }
    }
  };

  setActiveLink();
}
