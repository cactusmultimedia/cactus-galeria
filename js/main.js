/* ═══════════════════════════════════════════════
   Cactus Multimedia - Galería
   JavaScript vanilla — lightbox, nav, scroll
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ───── Nav scroll effect ───── */
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ───── Mobile menu ───── */
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.textContent = isOpen ? '✕' : '☰';
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.textContent = '☰';
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ───── Lightbox ───── */
  var lightbox = null;
  var lightboxImg = null;
  var currentGroup = [];
  var currentIndex = 0;

  function createLightbox() {
    lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.innerHTML =
      '<button class="lightbox-close" aria-label="Cerrar">✕</button>' +
      '<button class="lightbox-nav lightbox-prev" aria-label="Anterior">‹</button>' +
      '<button class="lightbox-nav lightbox-next" aria-label="Siguiente">›</button>';
    lightboxImg = document.createElement('img');
    lightboxImg.alt = '';
    lightbox.appendChild(lightboxImg);
    document.body.appendChild(lightbox);
    bindLightboxEvents();
  }

  function bindLightboxEvents() {
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', prevImage);
    lightbox.querySelector('.lightbox-next').addEventListener('click', nextImage);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', onLightboxKey);
  }

  function openLightbox(index, group) {
    if (!lightbox) createLightbox();
    currentGroup = group;
    currentIndex = index;
    showImage();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    updateNavButtons();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showImage() {
    var item = currentGroup[currentIndex];
    var img = item.querySelector('img');
    if (img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || '';
    }
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + currentGroup.length) % currentGroup.length;
    showImage();
    updateNavButtons();
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % currentGroup.length;
    showImage();
    updateNavButtons();
  }

  function updateNavButtons() {
    var prev = lightbox.querySelector('.lightbox-prev');
    var next = lightbox.querySelector('.lightbox-next');
    if (currentGroup.length <= 1) {
      prev.style.display = 'none';
      next.style.display = 'none';
    } else {
      prev.style.display = '';
      next.style.display = '';
    }
  }

  function onLightboxKey(e) {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  }

  /* ───── Bind galleries ───── */
  document.querySelectorAll('.gallery-grid').forEach(function (grid) {
    var items = Array.from(grid.querySelectorAll('.gallery-item'));
    items.forEach(function (item, i) {
      item.addEventListener('click', function () {
        openLightbox(i, items);
      });
    });
  });

  /* ───── WhatsApp tooltip ───── */
  var waBtn = document.querySelector('.whatsapp-btn');
  var waTip = document.querySelector('.whatsapp-tooltip');
  if (waBtn && waTip) {
    var tipTimer;
    function showTip() {
      waTip.classList.add('visible');
      clearTimeout(tipTimer);
      tipTimer = setTimeout(function () {
        waTip.classList.remove('visible');
      }, 4000);
    }
    showTip();
    waBtn.addEventListener('mouseenter', function () {
      waTip.classList.add('visible');
      clearTimeout(tipTimer);
    });
    waBtn.addEventListener('mouseleave', function () {
      tipTimer = setTimeout(function () {
        waTip.classList.remove('visible');
      }, 600);
    });
  }

  /* ───── Smooth scroll for anchor links ───── */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
