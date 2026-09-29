(function () {
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Theme toggle ----
  var toggle = document.querySelector('.theme-toggle');
  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  toggle.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // ---- Mobile menu ----
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('mobile-menu');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 820) setMenu(false);
  });

  // ---- Keyword flippers ----
  document.querySelectorAll('.flip').forEach(function (flip) {
    var list = flip.querySelector('ul');
    var items = list.children;
    var count = items.length;
    // Clone the first item so the loop wraps seamlessly
    list.appendChild(items[0].cloneNode(true));
    if (reduceMotion) return;

    var i = 0;
    var interval = +flip.dataset.interval || 2600;
    var delay = +flip.dataset.delay || 0;

    function step() {
      i++;
      list.style.transition = '';
      list.style.transform = 'translateY(' + (-i * 1.5) + 'em)';
      if (i === count) {
        setTimeout(function () {
          list.style.transition = 'none';
          list.style.transform = 'translateY(0)';
          i = 0;
        }, 750);
      }
    }
    setTimeout(function () { setInterval(step, interval); }, delay);
  });

  // ---- Reveal on scroll ----
  var revealEls = document.querySelectorAll('.block, .entry, .pub');
  if ('IntersectionObserver' in window && !reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add('reveal'); });
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { ro.observe(el); });
  }

  // ---- Sticky nav active state ----
  var links = Array.prototype.slice.call(document.querySelectorAll('.sticky-link'));
  var sections = links.map(function (l) { return document.querySelector(l.getAttribute('href')); });
  function updateActive() {
    var y = window.scrollY + window.innerHeight * 0.35;
    var current = -1;
    sections.forEach(function (s, idx) { if (s && s.offsetTop <= y) current = idx; });
    links.forEach(function (l, idx) { l.classList.toggle('active', idx === current); });
  }
  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();

  document.getElementById('year').textContent = new Date().getFullYear();
})();
