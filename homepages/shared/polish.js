// Shared finishing touches for the Quiet and Tiles concepts.
// 1. retina srcset for every image served by the live resizer
// 2. "Added" state on add-to-cart buttons
// 3. 50 / 100 ml toggles that update the card price
// 4. reveal-on-scroll for elements marked [data-reveal]
(() => {
  // next/image only serves these widths
  const W = [128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];
  const up = w => Math.min(W.find(x => x >= w * 2) || 2048, 2048);

  const retina = root => root.querySelectorAll('img[src*="/_next/image"]:not([srcset])').forEach(img => {
    const m = img.src.match(/[?&]w=(\d+)/); if (!m) return;
    const w = +m[1];
    img.decoding = 'async';
    img.srcset = `${img.src} 1x, ${img.src.replace(/([?&]w=)\d+/, '$1' + up(w))} 2x`;
    if (!img.complete) { img.classList.add('ld'); img.addEventListener('load', () => img.classList.remove('ld'), { once: true }); }
  });

  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px' }) : null;
  const reveal = root => root.querySelectorAll('[data-reveal]:not(.in)').forEach(el => io ? io.observe(el) : el.classList.add('in'));

  const run = root => { retina(root); reveal(root); };

  document.addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    if (add) {
      e.preventDefault();
      if (add.classList.contains('done')) return;
      const t = add.innerHTML; add.classList.add('done'); add.innerHTML = 'Added &#10003;';
      setTimeout(() => { add.classList.remove('done'); add.innerHTML = t; }, 1800);
      return;
    }
    const sz = e.target.closest('[data-size]');
    if (sz) {
      e.preventDefault();
      const box = sz.closest('[data-sizes]');
      box.querySelectorAll('[data-size]').forEach(b => b.setAttribute('aria-pressed', b === sz));
      const card = sz.closest('[data-card]');
      const pr = card && card.querySelector('[data-price]');
      if (pr) pr.textContent = sz.dataset.size;
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    run(document);
    new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => n.nodeType === 1 && run(n.parentNode || n)))).observe(document.body, { childList: true, subtree: true });
    const ready = () => document.documentElement.classList.add('ready');
    requestAnimationFrame(ready); setTimeout(ready, 120);
  });
})();
