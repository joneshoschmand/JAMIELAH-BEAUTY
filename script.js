/* ============================================
   JAMIELAH BEAUTY – JavaScript
   Animations, Interactions & Form Handling
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initStickyHeader();
  initMobileMenu();
  initSmoothScroll();
  initParallax();
  // initContactForm(); has been removed
  initLocationSelector();
  initContactTabs();
  initServiceModals();
});

/* ---------- Service Price Modals ---------- */
function initServiceModals() {
  const buttons = document.querySelectorAll('.btn-services-detail');
  
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.dataset.modal;
      const modal = document.getElementById(modalId);
      if (modal) openServiceModal(modal);
    });
  });

  // Close buttons
  document.querySelectorAll('.modal-close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      const modal = closeBtn.closest('.service-modal-overlay');
      if (modal) closeServiceModal(modal);
    });
  });

  // Close on overlay click
  document.querySelectorAll('.service-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeServiceModal(overlay);
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.service-modal-overlay.active');
      if (activeModal) closeServiceModal(activeModal);
    }
  });
}

function openServiceModal(modal) {
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  // Focus the close button
  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) setTimeout(() => closeBtn.focus(), 100);
}

function closeServiceModal(modal) {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ---------- Location Selector Dropdown ---------- */
function initLocationSelector() {
  const selector = document.getElementById('location-selector');
  const toggle = document.getElementById('location-toggle');
  const dropdown = document.getElementById('location-dropdown');
  const currentLabel = document.getElementById('location-current');

  if (!selector || !toggle || !dropdown) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = selector.classList.contains('open');
    selector.classList.toggle('open');
    toggle.setAttribute('aria-expanded', !isOpen);
  });

  dropdown.querySelectorAll('li').forEach(item => {
    item.addEventListener('click', () => {
      // Update active state
      dropdown.querySelectorAll('li').forEach(li => {
        li.classList.remove('active');
        li.setAttribute('aria-selected', 'false');
      });
      item.classList.add('active');
      item.setAttribute('aria-selected', 'true');

      // Update label
      currentLabel.textContent = item.querySelector('.loc-name').textContent;

      // Sync with contact tabs
      const location = item.dataset.location;
      const contactTab = document.querySelector(`.contact-tab[data-tab="${location}"]`);
      if (contactTab) contactTab.click();

      // Sync with WhatsApp button link
      const waBtn = document.getElementById('whatsapp-action-btn');
      const waText = document.getElementById('whatsapp-action-text');
      if (waBtn && waText) {
        if (location === 'kaarst') {
          waBtn.href = "https://wa.me/491743844410";
          waText.textContent = "Nachricht an Kaarst";
        } else {
          waBtn.href = "https://wa.me/4917682063222";
          waText.textContent = "Nachricht an Mönchengladbach";
        }
      }
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!selector.contains(e.target)) {
      selector.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && selector.classList.contains('open')) {
      selector.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });
}

/* ---------- Contact Location Tabs ---------- */
function initContactTabs() {
  const tabs = document.querySelectorAll('.contact-tab');
  const panels = document.querySelectorAll('.contact-panel');

  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      // Update tab states
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Show corresponding panel
      panels.forEach(panel => {
        panel.classList.remove('active');
        panel.hidden = true;
      });

      const targetPanel = document.getElementById(
        target === 'kaarst' ? 'panel-kaarst' : 'panel-mg'
      );
      if (targetPanel) {
        targetPanel.classList.add('active');
        targetPanel.hidden = false;
      }

      // Sync header location selector
      const dropdownItems = document.querySelectorAll('#location-dropdown li');
      const currentLabel = document.getElementById('location-current');
      dropdownItems.forEach(item => {
        item.classList.remove('active');
        item.setAttribute('aria-selected', 'false');
        if (item.dataset.location === target) {
          item.classList.add('active');
          item.setAttribute('aria-selected', 'true');
          if (currentLabel) currentLabel.textContent = item.querySelector('.loc-name').textContent;
        }
      });

      // Sync WhatsApp button link
      const waBtn = document.getElementById('whatsapp-action-btn');
      const waText = document.getElementById('whatsapp-action-text');
      if (waBtn && waText) {
        if (target === 'kaarst') {
          waBtn.href = "https://wa.me/491743844410";
          waText.textContent = "Nachricht an Kaarst";
        } else {
          waBtn.href = "https://wa.me/4917682063222";
          waText.textContent = "Nachricht an Mönchengladbach";
        }
      }
    });
  });
}

/* ---------- Scroll-Reveal Animations ---------- */
function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Show all elements immediately
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
      el.classList.add('revealed');
    });
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    observer.observe(el);
  });
}

/* ---------- Sticky Header with Glassmorphism ---------- */
function initStickyHeader() {
  const header = document.getElementById('site-header');
  let lastScroll = 0;
  let ticking = false;

  function updateHeader() {
    const scrollY = window.scrollY;

    if (scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });
}

/* ---------- Mobile Hamburger Menu ---------- */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const overlay = document.getElementById('mobile-overlay');
  const body = document.body;

  function openMenu() {
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Menü schließen');
    navLinks.classList.add('open');
    overlay.classList.add('visible');
    body.style.overflow = 'hidden';
  }

  function closeMenu() {
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Menü öffnen');
    navLinks.classList.remove('open');
    overlay.classList.remove('visible');
    body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.contains('active');
    isOpen ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  // Close menu when clicking a nav link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.classList.contains('active')) {
      closeMenu();
      toggle.focus();
    }
  });
}

/* ---------- Smooth Scroll ---------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerHeight = document.getElementById('site-header').offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/* ---------- Parallax Orb Effect ---------- */
function initParallax() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || window.innerWidth <= 768) return;

  const hero = document.getElementById('hero');
  if (!hero) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;

        if (scrollY < heroHeight) {
          const progress = scrollY / heroHeight;
          hero.style.setProperty('--parallax-y', `${scrollY * 0.3}px`);
          hero.querySelector('.hero-content').style.transform =
            `translateY(${scrollY * 0.15}px)`;
          hero.querySelector('.hero-content').style.opacity =
            `${1 - progress * 0.6}`;
        }

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ---------- Form init has been removed (Replaced by WhatsApp Contact) ---------- */

/* ---------- Active Nav Link on Scroll ---------- */
(function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  let ticking = false;

  function updateActiveLink() {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateActiveLink);
      ticking = true;
    }
  }, { passive: true });

  /* ---------- Cookie Banner ---------- */
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept');

  if (cookieBanner && cookieAcceptBtn) {
    if (!localStorage.getItem('cookieConsent')) {
      setTimeout(() => {
        cookieBanner.classList.add('show');
        cookieBanner.setAttribute('aria-hidden', 'false');
      }, 1000);
    }

    cookieAcceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('show');
      cookieBanner.setAttribute('aria-hidden', 'true');
    });
  }

})();
