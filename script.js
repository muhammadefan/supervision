// Close dropdown when clicking outside OR when choosing a menu link
document.addEventListener('click', function (e) {
const openDropdowns = document.querySelectorAll('.nav details.dropdown[open]');
openDropdowns.forEach((d) => {
    const clickedInside = e.target.closest('.nav details.dropdown') === d;
    const clickedMenuLink = e.target.closest('.nav details.dropdown .menu a');
    if (!clickedInside || clickedMenuLink) {
    d.removeAttribute('open');
    }
});
});

// Optional: Close dropdown when pressing Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdowns = document.querySelectorAll('.nav details.dropdown[open]');
        dropdowns.forEach(dropdown => {
            dropdown.removeAttribute('open');
        });
    }
});

// Wavy tagline: split into spans + animate on scroll into view
document.addEventListener('DOMContentLoaded', function () {
  /* --- tagline wave (unchanged) --- */
  const el = document.getElementById('achv-tagline');
  if (el) {
    const txt = el.textContent;
    el.textContent = '';
    [...txt].forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = ch;
      span.style.animationDelay = (i * 15) + 'ms';
      el.appendChild(span);
    });

    const waveIO = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          waveIO.unobserve(el);
        }
      });
    }, { threshold: 0.6 });
    waveIO.observe(el);
  }

  /* --- fade / slide reveal on scroll (additions) --- */
  const singles = document.querySelectorAll('.reveal');
  const groups  = document.querySelectorAll('.reveal-stagger');

  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const target = entry.target;
      target.classList.add('is-visible');

      // optional stagger for groups
      if (target.classList.contains('reveal-stagger')) {
        [...target.children].forEach((child, i) => {
          child.style.transitionDelay = (i * 100) + 'ms';
        });
      }

      revealIO.unobserve(target); // run once per element
    });
  }, { threshold: 0.2 });

  singles.forEach(el => revealIO.observe(el));
  groups.forEach(el => revealIO.observe(el));
});

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav');
  const navH = () => (nav ? nav.offsetHeight : 0);

  function scrollToCenter(hash) {
    const el = document.querySelector(hash);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const pageY = window.pageYOffset || document.documentElement.scrollTop;
    const available = window.innerHeight - navH();          // visible height under the fixed nav
    const centerOffset = Math.max((available - el.offsetHeight) / 2, 12); // clamp a little padding

    // If the section is shorter than the viewport, center it; otherwise just tuck under the nav
    const top = rect.top + pageY - (el.offsetHeight < available ? navH() + centerOffset
                                                                : navH() + 12);

    window.scrollTo({ top, behavior: 'smooth' });
  }

  // Intercept clicks from the nav & dropdown menu
  document.querySelectorAll('.nav a[href^="#"], .nav .menu a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const hash = a.getAttribute('href');
      scrollToCenter(hash);

      // close dropdown after choosing
      const dd = a.closest('details.dropdown');
      if (dd) dd.removeAttribute('open');
    });
  });

  // If the page loads with a hash, center that section too
  if (location.hash) {
    setTimeout(() => scrollToCenter(location.hash), 0);
  }
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const topnav = document.getElementById('topnav');

  if (toggle && header && topnav){
    toggle.addEventListener('click', () => {
      const open = header.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open);
    });

    // close after clicking any link or the Courses summary
    topnav.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link){
        header.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
});