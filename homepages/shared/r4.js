// Round 4 helpers: still-life photos, the product card, small interactions. Needs shared.js,
// catalogue.js and agi.js loaded first.
window.PM4 = (() => {
  const by = h => PM_CAT.find(p => p.h === h);
  const set = h => (window.PM_AGI || {})[h] || [];
  const local = (file, w) => `../img/agi/${w}/${file}`;
  const kind = (h, k) => set(h).find(f => f.includes(`-${k}.`));

  // Card photo: the new packshot, else the live studio shot. Hover: a still life with ingredients.
  const pack = (p, w = 600) => kind(p.h, 'packshot') ? local(kind(p.h, 'packshot'), w) : PM.sized('https://cdn.petitemort.co/' + p.s, w === 600 ? 640 : 1200);
  const still = (p, w = 600, order = ['torn', 'split', 'collage', 'notes']) => {
    for (const k of order) { const f = kind(p.h, k); if (f) return local(f, w); }
    return p.f ? PM.sized('https://cdn.petitemort.co/' + p.f, w === 600 ? 640 : 1200) : pack(p, w);
  };

  const card = (p, opts = {}) => `
    <div class="c4" data-card>
      <a class="ph" href="#${p.h}">${p.pop ? '<span class="tag">Popular</span>' : ''}
        <img src="${pack(p)}" alt="${p.n}" loading="${opts.eager ? 'eager' : 'lazy'}">
        <img class="alt" src="${still(p)}" alt="" loading="lazy">
      </a>
      <div class="rt"><span class="st">★★★★★</span> ${p.r} (${p.c})</div>
      <div class="nm">${p.n}</div>
      <div class="nt">${p.notes.join(' · ')}</div>
      ${p.fam ? `<div class="fm">Same scent family as ${p.fam}</div>` : ''}
      <div class="sz" data-sizes><button aria-pressed="true" data-p="€ 39">50 ml<small>€ 39</small></button><button aria-pressed="false" data-p="€ 59">100 ml<small>€ 59</small></button></div>
      <button class="add" data-add>Add to cart · € 39</button>
    </div>`;

  // Size buttons switch the price on the add button; add shows a short confirmation.
  document.addEventListener('click', e => {
    const s = e.target.closest('[data-sizes] button');
    if (s) {
      const c = s.closest('[data-card]');
      c.querySelectorAll('[data-sizes] button').forEach(b => b.setAttribute('aria-pressed', b === s));
      c.querySelector('[data-add]').textContent = 'Add to cart · ' + s.dataset.p;
      return;
    }
    const a = e.target.closest('[data-add]');
    if (a && !a.classList.contains('ok')) {
      const was = a.textContent;
      a.classList.add('ok'); a.textContent = 'Added ✓';
      setTimeout(() => { a.classList.remove('ok'); a.textContent = was; }, 1400);
    }
  });

  // Phone dock: shows the main button once the hero button has scrolled away.
  const dock = target => {
    const d = document.querySelector('.dock'), t = document.querySelector(target);
    if (!d || !t) return;
    new IntersectionObserver(([x]) => d.classList.toggle('show', !x.isIntersecting && x.boundingClientRect.top < 0)).observe(t);
  };

  const REVIEWS = [
    ['Even my pillow smells of it.', 'Sylvia D.'],
  ];

  return { by, pack, still, card, dock, REVIEWS, local, kind };
})();
