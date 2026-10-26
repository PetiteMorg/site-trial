// Round 4 demo cart: a side drawer that opens on every add, with the live shop's offers as upsells.
// Kept in this browser only (localStorage); nothing is sent anywhere. Needs shared.js, catalogue.js,
// agi.js and r4.js loaded first.
//   Rewards (live drawer): free shipping from € 50, a free 50 ml of your choice from € 90.
//   Bundle (live): 50 ml scents are "Buy 2, get 1 free", so every third 50 ml is free.
//   Upsells: complete the 2+1, three scents that pair well, the Discovery Set.
window.PM4CART = (() => {
  const KEY = 'pm-r4-cart';
  const SHIP_FREE = 5000, FREE50 = 9000, SHIP = 495;
  const eur = c => '€ ' + (c / 100).toFixed(2).replace('.', ',');
  const PRICES = { '50 ml': 3900, '100 ml': 5900, '2 ml sample': 500, 'Discovery Set': 4500 };
  const dir = (location.pathname.match(/(\d\d-[a-z-]+?)(?:-(?:collection|product|checkout))?\.html/) || [])[1] || '10-direct';

  let lines = [];
  try { lines = JSON.parse(localStorage.getItem(KEY)) || []; } catch {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch {} };

  // totals: every third 50 ml is free (cheapest first, all 50 ml cost the same)
  const totals = () => {
    const gross = lines.reduce((s, l) => s + l.c * l.q, 0);
    const n50 = lines.filter(l => l.s === '50 ml').reduce((s, l) => s + l.q, 0);
    const free = Math.floor(n50 / 3) * PRICES['50 ml'];
    const sub = gross - free;
    return { gross, free, sub, n50, count: lines.reduce((s, l) => s + l.q, 0), ship: sub >= SHIP_FREE || !lines.length ? 0 : SHIP };
  };

  const add = (h, s = '50 ml', q = 1) => {
    const p = h ? PM4.by(h) : null;
    const id = (h || 'set') + '|' + s;
    const ex = lines.find(l => l.id === id);
    if (ex) ex.q += q;
    else lines.push({ id, h, s, n: p ? p.n : s, c: PRICES[s] ?? 3900, q });
    save(); render(); open();
  };
  const setQ = (id, q) => { const l = lines.find(x => x.id === id); if (!l) return; l.q = Math.max(0, q); lines = lines.filter(x => x.q > 0); save(); render(); };

  // drawer markup, injected once
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="cd-scrim" data-cd-close></div>
    <aside class="cd" role="dialog" aria-modal="true" aria-label="Cart" inert>
      <div class="cd-head"><b>Your cart <span id="cdCount"></span></b><button class="cd-x" data-cd-close aria-label="Close">✕</button></div>
      <div class="cd-reward" id="cdReward"></div>
      <div class="cd-body" id="cdBody"></div>
      <div class="cd-foot" id="cdFoot"></div>
    </aside>`;
  document.addEventListener('DOMContentLoaded', () => { document.body.appendChild(el); render(); });
  const aside = () => el.querySelector('.cd');
  const open = () => { el.classList.add('open'); aside().inert = false; document.documentElement.style.overflow = 'hidden'; };
  const close = () => { el.classList.remove('open'); aside().inert = true; document.documentElement.style.overflow = ''; };
  el.addEventListener('click', e => { if (e.target.closest('[data-cd-close]')) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  const thumb = h => h ? PM4.pack(PM4.by(h)) : 'https://petitemort.co/_next/image?url=https%3A%2F%2Fcdn.petitemort.co%2FPETITEMORT_15.png&w=256&q=75';
  const mini = p => `<div class="cd-mini"><img src="${PM4.pack(p)}" alt=""><b>${p.n}</b><span>${p.notes.slice(0, 2).join(' · ')}</span><button data-cd-add="${p.h}">+ 50 ml · € 39</button></div>`;

  function render() {
    const body = el.querySelector('#cdBody'); if (!body) return;
    const t = totals();
    el.querySelector('#cdCount').textContent = t.count ? `(${t.count})` : '';
    document.querySelectorAll('[data-cart-count]').forEach(x => x.textContent = t.count || '');

    // reward bar: free shipping, then the free 50 ml
    const goal = t.sub < SHIP_FREE ? SHIP_FREE : FREE50;
    const msg = !lines.length ? 'Free shipping over € 50' : t.sub < SHIP_FREE ? `${eur(SHIP_FREE - t.sub)} more for free shipping` : t.sub < FREE50 ? `Free shipping unlocked · ${eur(FREE50 - t.sub)} more for a free 50 ml` : 'Free shipping and a free 50 ml of your choice unlocked';
    el.querySelector('#cdReward').innerHTML = `<p>${msg}</p><div class="bar"><i style="width:${Math.min(100, Math.round(t.sub / goal * 100))}%"></i><em style="left:${Math.round(SHIP_FREE / FREE50 * 100)}%"></em></div><div class="lbl"><span>Free shipping</span><span>Free 50 ml</span></div>`;

    if (!lines.length) {
      body.innerHTML = `<p class="cd-empty">Your cart is empty.</p><div class="cd-up"><h4>Our best smellers</h4><div class="cd-row">${['mysterious-woods', 'suave-night', 'smokey-pineapple'].map(PM4.by).map(mini).join('')}</div></div>`;
      el.querySelector('#cdFoot').innerHTML = `<a class="b4 cta4 cd-go" href="${dir}-collection.html">Shop all scents</a>`;
      return;
    }

    const rows = lines.map(l => `
      <div class="cd-line">
        <img src="${thumb(l.h)}" alt="">
        <div><b>${l.n}</b><span>${l.h ? l.s : '6 Samples · Including a €40 Gift Card'}</span>
          <div class="cd-q"><button data-cd-q="${l.id}" data-d="-1" aria-label="One less">−</button><span>${l.q}</span><button data-cd-q="${l.id}" data-d="1" aria-label="One more">+</button></div></div>
        <span class="cd-p">${eur(l.c * l.q)}</span>
      </div>`).join('');

    // upsell 1: complete the Buy 2, get 1 free
    const inCart = new Set(lines.map(l => l.h));
    const picks = ['mysterious-woods', 'suave-night', 'smokey-pineapple', 'cherry-bomb', 'sensual-oud', 'elegant-warmth', 'honey-tobacco'].filter(h => !inCart.has(h)).map(PM4.by).filter(Boolean);
    const left = t.n50 % 3;
    const bundle = t.n50 === 0 ? '' : left === 2
      ? `<div class="cd-offer hot"><b>Your 3rd 50 ml is free</b><span>Buy 2, get 1 free. Pick one more scent, it costs € 0.</span><div class="cd-row">${picks.slice(0, 3).map(mini).join('')}</div></div>`
      : left === 1
        ? `<div class="cd-offer"><b>Buy 2, get 1 free</b><span>Add 2 more 50 ml scents: you pay for one, the third is free. 3x 50ML Bundle € 78 (was € 117).</span><div class="cd-row">${picks.slice(0, 3).map(mini).join('')}</div></div>`
        : `<div class="cd-offer done"><b>Buy 2, get 1 free applied</b><span>You save ${eur(t.free)}. Add more 50 ml scents: every third is free.</span></div>`;

    // upsell 2: pairs well; upsell 3: the Discovery Set
    const pairs = t.n50 ? '' : `<div class="cd-up"><h4>Pairs well with</h4><div class="cd-row">${picks.slice(0, 3).map(mini).join('')}</div></div>`;
    const ds = lines.some(l => l.s === 'Discovery Set') ? '' : `<div class="cd-ds"><img src="${thumb(null)}" alt=""><div><b>Can't choose? Test 6 premium scents.</b><span>Discovery Set | 6 Samples · Including a €40 Gift Card</span></div><button data-cd-ds>+ € 45</button></div>`;

    body.innerHTML = rows + bundle + pairs + ds;
    el.querySelector('#cdFoot').innerHTML = `
      ${t.free ? `<div class="cd-t save"><span>Buy 2, get 1 free</span><span>− ${eur(t.free)}</span></div>` : ''}
      <div class="cd-t"><span>Shipping</span><span>${t.ship ? eur(t.ship) : 'Free'}</span></div>
      <a class="b4 cta4 cd-go" href="${dir}-checkout.html">Checkout · ${eur(t.sub + t.ship)}</a>
      <p class="cd-trust"><span style="color:var(--star)">★★★★★</span> (4.4) 4,839 reviews · 30-day returns, even if opened</p>`;
  }

  el.addEventListener('click', e => {
    const a = e.target.closest('[data-cd-add]'); if (a) return add(a.dataset.cdAdd, '50 ml');
    const q = e.target.closest('[data-cd-q]'); if (q) { const l = lines.find(x => x.id === q.dataset.cdQ); return setQ(q.dataset.cdQ, l.q + +q.dataset.d); }
    if (e.target.closest('[data-cd-ds]')) return add(null, 'Discovery Set');
  });

  return { add, open, close, lines: () => lines, totals, eur, clear: () => { lines = []; save(); render(); } };
})();
