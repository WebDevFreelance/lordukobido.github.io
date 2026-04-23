/* =============================================
   L'Or du Kobido — Script principal
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navigation scroll ── */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Burger menu ── */
  const burger = document.querySelector('.nav__burger');
  const links  = document.querySelector('.nav__links');
  if (burger && links) {
    burger.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      nav.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        nav.classList.remove('menu-open');
        burger.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Lien actif nav au scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__links a[href^="#"]');
  const observer  = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px' });
  sections.forEach(s => observer.observe(s));

  /* ── Révélation au scroll ── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObs.observe(el));

  /* ── Année courante footer ── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Curseur personnalisé ── */
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  if (!isCoarse) {
    document.documentElement.classList.add('custom-cursor');

    const dot  = document.createElement('div');
    dot.className = 'cursor-dot';
    dot.setAttribute('aria-hidden', 'true');
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    ring.setAttribute('aria-hidden', 'true');
    document.body.append(dot, ring);

    let mx = -200, my = -200;
    let rx = -200, ry = -200;
    let shown = false;
    let rafActive = false;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function trackRing() {
      if (reducedMotion) { rx = mx; ry = my; }
      else {
        rx += (mx - rx) * 0.1;
        ry += (my - ry) * 0.1;
      }
      ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
      if (rafActive) requestAnimationFrame(trackRing);
    }

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
      if (!shown) {
        shown = true;
        dot.classList.add('visible');
        ring.classList.add('visible');
      }
      if (!rafActive) {
        rafActive = true;
        requestAnimationFrame(trackRing);
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      rafActive = false;
      dot.classList.remove('visible');
      ring.classList.remove('visible');
    });
    document.addEventListener('mouseenter', () => {
      if (shown) {
        rafActive = true;
        dot.classList.add('visible');
        ring.classList.add('visible');
        requestAnimationFrame(trackRing);
      }
    });

    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.classList.add('is-hovered');
        ring.classList.add('is-hovered');
      });
      el.addEventListener('mouseleave', () => {
        dot.classList.remove('is-hovered');
        ring.classList.remove('is-hovered');
      });
    });
  }

});
