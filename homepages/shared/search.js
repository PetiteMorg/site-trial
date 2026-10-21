// Predictive search + scent recommendations for the homepage concepts.
// Searches all 79 live scents (shared/catalogue.js) by name, notes, the
// "Same scent family as" line and gender, with small typo tolerance.
// Open: header search icon, "/" or Cmd/Ctrl+K. Close: Esc.
(() => {
  const CAT = (window.PM_CAT || []).map(p => ({ ...p, notes: p.notes || [] }));
  if (!CAT.length) return;
  const CDN = 'https://cdn.petitemort.co/';
  const img = (p, w = 256) => p.s ? `https://petitemort.co/_next/image?url=${encodeURIComponent(CDN + p.s)}&w=${w}&q=75` : '';
  const url = p => `https://petitemort.co/products/${p.h}`;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ---------- text helpers ----------
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’'`]/g, '').replace(/[^a-z0-9*]+/g, ' ').trim();
  const words = s => norm(s).split(' ').filter(Boolean);
  const lev = (a, b, max) => {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      const cur = [i]; let best = i;
      for (let j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        best = Math.min(best, cur[j]);
      }
      if (best > max) return max + 1;
      prev = cur;
    }
    return prev[b.length];
  };

  // shopper words that map onto notes and genders
  const SYN = {
    men: ['men'], man: ['men'], him: ['men'], male: ['men'], heren: ['men'],
    women: ['women'], woman: ['women'], her: ['women'], female: ['women'], dames: ['women'],
    unisex: ['unisex'],
    fresh: ['citrus', 'marine', 'bergamot', 'mint', 'grapefruit', 'lemon', 'mandarin', 'citron', 'tea'],
    citrus: ['citrus', 'orange', 'grapefruit', 'lemon', 'mandarin', 'bergamot', 'citron'],
    sweet: ['vanilla', 'praline', 'caramel', 'honey', 'marshmallow', 'tonka', 'sugar', 'cola'],
    gourmand: ['vanilla', 'praline', 'coffee', 'honey', 'marshmallow', 'tonka', 'sugar', 'almond'],
    woody: ['wood', 'cedar', 'sandalwood', 'vetiver', 'oud', 'amberwood', 'cedarwood'],
    spicy: ['cinnamon', 'pepper', 'cardamom', 'saffron', 'clove', 'spice', 'spices'],
    floral: ['rose', 'jasmine', 'peony', 'tuberose', 'blossom', 'gardenia', 'iris', 'orchid', 'osmanthus', 'lychee'],
    fruity: ['cherry', 'pineapple', 'blackcurrant', 'apple', 'passionfruit', 'strawberry', 'raspberry', 'mango', 'pear', 'lychee', 'litchi'],
    smoky: ['smoke', 'tobacco', 'incense', 'birch', 'leather'],
    summer: ['coconut', 'marine', 'citrus', 'salt', 'mandarin'],
  };

  // ---------- index ----------
  const IDX = CAT.map(p => ({
    p,
    name: words(p.n),
    fam: p.fam && !/these fragrances/i.test(p.fam) ? words(p.fam) : [],
    famRaw: p.fam && !/these fragrances/i.test(p.fam) ? p.fam : '',
    notes: p.notes.flatMap(words),
    g: norm(p.g),
    pop: Math.log10((p.c || 0) + 10),
  }));
  const ALL_NOTES = [...new Set(CAT.flatMap(p => p.notes))].sort();
  const noteCount = n => CAT.filter(p => p.notes.includes(n)).length;

  const tokScore = (t, e) => {
    const hit = (arr, w1, w2) => arr.some(x => x === t) ? w1 : arr.some(x => x.startsWith(t)) ? w2 : 0;
    let s = Math.max(hit(e.name, 12, 9), hit(e.fam, 11, 8), hit(e.notes, 7, 5));
    if (!s && (SYN[t] || []).length) {
      const syn = SYN[t];
      if (syn.includes(e.g)) s = 6;
      else if (e.notes.some(n => syn.some(x => n.startsWith(x)))) s = 4;
    }
    if (!s && t.length >= 4) { // typo tolerance
      const max = t.length >= 7 ? 2 : 1;
      const near = arr => arr.some(x => x.length >= 3 && (lev(t, x, max) <= max || (x.length > t.length && lev(t, x.slice(0, t.length), max) <= max)));
      s = near(e.name) ? 6 : near(e.fam) ? 5 : near(e.notes) ? 3 : 0;
    }
    return s;
  };

  const search = q => {
    const toks = words(q);
    if (!toks.length) return [];
    const res = [];
    for (const e of IDX) {
      let total = 0, ok = true;
      for (const t of toks) { const s = tokScore(t, e); if (!s) { ok = false; break; } total += s; }
      if (!ok) continue;
      const phrase = norm(q);
      if (norm(e.p.n).startsWith(phrase)) total += 3;
      if (e.famRaw && norm(e.famRaw).startsWith(phrase)) total += 6;
      res.push({ p: e.p, s: total + e.pop * 2 + (e.p.r || 0) * .3 });
    }
    return res.sort((a, b) => b.s - a.s).map(r => r.p);
  };

  // similar scents: shared notes first, then same gender, then reviews
  const similar = (p, n = 3, skip = []) => CAT
    .filter(x => x.h !== p.h && !skip.includes(x.h))
    .map(x => {
      const a = new Set(p.notes.flatMap(words)), b = x.notes.flatMap(words);
      const shared = b.filter(w => a.has(w)).length;
      return { x, s: shared * 3 + (x.g === p.g ? 1.5 : x.g === 'Unisex' || p.g === 'Unisex' ? .7 : 0) + Math.log10((x.c || 0) + 10) * .6 };
    })
    .sort((a, b) => b.s - a.s).slice(0, n).map(r => r.x);

  const hl = (text, q) => {
    const ts = words(q).filter(t => t.length > 1);
    if (!ts.length) return esc(text);
    let out = esc(text);
    ts.forEach(t => { out = out.replace(new RegExp(`(^|[^a-z])(${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[a-z]*)`, 'gi'), '$1<mark>$2</mark>'); });
    return out;
  };

  // ---------- recent searches (per viewer convenience only) ----------
  const RKEY = 'pm-concept-recent';
  const recent = () => { try { return JSON.parse(localStorage.getItem(RKEY) || '[]'); } catch { return []; } };
  const remember = q => { try { const r = [q, ...recent().filter(x => x !== q)].slice(0, 5); localStorage.setItem(RKEY, JSON.stringify(r)); } catch {} };

  // ---------- UI ----------
  const POPULAR = ['Vanilla', 'Oud', 'Santal 33', 'Aventus', 'Baccarat Rouge 540', 'Fresh', 'Sweet'];
  const BEST = [...CAT].sort((a, b) => (b.c || 0) - (a.c || 0)).slice(0, 4);

  const row = (p, q, i) => `
    <a class="ps-row" href="${url(p)}" data-i="${i}" role="option">
      <span class="ps-th">${p.s ? `<img src="${img(p)}" alt="" loading="lazy">` : ''}</span>
      <span class="ps-tx">
        <span class="ps-nm">${hl(p.n, q)}${p.new ? ' <em>New</em>' : ''}</span>
        <span class="ps-nt">${hl(p.notes.join(', '), q)}</span>
        ${p.fam ? `<span class="ps-fm">Same scent family as ${hl(p.fam, q)}</span>` : ''}
      </span>
      <span class="ps-pr">€ 39${p.r ? `<small>★ ${p.r} (${p.c})</small>` : ''}</span>
    </a>`;
  const card = p => `
    <a class="ps-card" href="${url(p)}">
      <span class="ps-im">${p.s ? `<img src="${img(p, 384)}" alt="" loading="lazy">` : ''}</span>
      <span class="ps-nm">${esc(p.n)}</span>
      <span class="ps-nt">${esc(p.notes.join(', '))}</span>
      <span class="ps-pr">€ 39</span>
    </a>`;

  const el = document.createElement('div');
  el.className = 'ps'; el.hidden = true;
  el.innerHTML = `
    <div class="ps-dim" data-close></div>
    <div class="ps-panel" role="dialog" aria-modal="true" aria-label="Search">
      <div class="ps-bar wrap">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/></svg>
        <input class="ps-in" type="search" placeholder="Name a perfume you love" autocomplete="off" spellcheck="false" aria-label="Search" role="combobox" aria-expanded="true" aria-controls="ps-list">
        <button class="ps-x" data-close aria-label="Close search">Close</button>
      </div>
      <div class="ps-hint wrap">Any brand, any year · or describe a mood</div>
      <div class="ps-body wrap" id="ps-body"></div>
    </div>`;
  const mount = () => document.body.appendChild(el);
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', mount) : mount();

  const $in = () => el.querySelector('.ps-in');
  const body = () => el.querySelector('#ps-body');
  let active = -1, lastQ = '';

  const renderEmpty = () => {
    const r = recent();
    body().innerHTML = `
      <div class="ps-cols">
        <div class="ps-side">
          ${r.length ? `<div class="ps-h">Recent</div><div class="ps-chips">${r.map(x => `<button data-q="${esc(x)}">${esc(x)}</button>`).join('')}</div>` : ''}
          <div class="ps-h">Popular searches</div>
          <div class="ps-chips">${POPULAR.map(x => `<button data-q="${esc(x)}">${esc(x)}</button>`).join('')}</div>
        </div>
        <div class="ps-main">
          <div class="ps-h">Our best smellers</div>
          <div class="ps-cards">${BEST.map(card).join('')}</div>
        </div>
      </div>`;
  };

  const render = q => {
    lastQ = q; active = -1;
    if (!words(q).length) return renderEmpty();
    const res = search(q);
    const nq = norm(q);
    const notes = ALL_NOTES.filter(n => norm(n).split(' ').some(w => w.startsWith(nq)) || norm(n).startsWith(nq)).slice(0, 6);
    if (!res.length) {
      const sug = BEST.slice(0, 4);
      body().innerHTML = `
        <div class="ps-none">No scents match "${esc(q)}".</div>
        <div class="ps-cols">
          <div class="ps-side">
            <div class="ps-h">Try</div>
            <div class="ps-chips">${POPULAR.map(x => `<button data-q="${esc(x)}">${esc(x)}</button>`).join('')}</div>
            <a class="ps-ds" href="https://petitemort.co/products/discovery-set">Can't choose? Test 6 premium scents. <span class="arw">&rarr;</span></a>
          </div>
          <div class="ps-main"><div class="ps-h">Our best smellers</div><div class="ps-cards">${sug.map(card).join('')}</div></div>
        </div>`;
      return;
    }
    const top = res[0];
    const recs = similar(top, 3, res.slice(0, 6).map(p => p.h));
    body().innerHTML = `
      <div class="ps-cols">
        <div class="ps-side">
          ${notes.length ? `<div class="ps-h">Notes</div><div class="ps-chips">${notes.map(n => `<button data-q="${esc(n)}">${hl(n, q)} <small>${noteCount(n)}</small></button>`).join('')}</div>` : ''}
          <div class="ps-h">If you like ${esc(top.n)}</div>
          <div class="ps-recs">${recs.map(p => `<a href="${url(p)}"><span class="ps-th">${p.s ? `<img src="${img(p)}" alt="" loading="lazy">` : ''}</span><span><b>${esc(p.n)}</b><small>${esc(p.notes.join(', '))}</small></span></a>`).join('')}</div>
        </div>
        <div class="ps-main">
          <div class="ps-h">${res.length} ${res.length === 1 ? 'scent' : 'scents'}</div>
          <div class="ps-list" id="ps-list" role="listbox">${res.slice(0, 6).map((p, i) => row(p, q, i)).join('')}</div>
          ${res.length > 6 ? `<a class="ps-all" href="https://petitemort.co/store">Shop all ${res.length} results <span class="arw">&rarr;</span></a>` : ''}
        </div>
      </div>`;
  };

  const open = (q = '') => {
    el.hidden = false; document.documentElement.classList.add('ps-open');
    setTimeout(() => el.classList.add('on'), 16);
    const i = $in(); i.value = q; render(q); setTimeout(() => i.focus(), 30);
  };
  const close = () => {
    el.classList.remove('on'); document.documentElement.classList.remove('ps-open');
    setTimeout(() => { el.hidden = true; }, 250);
    if (lastQ.trim().length > 1) remember(lastQ.trim());
  };
  window.PMSearch = { open, close, search, similar };

  let t;
  document.addEventListener('input', e => { if (e.target.classList?.contains('ps-in')) { clearTimeout(t); t = setTimeout(() => render(e.target.value), 60); } });
  document.addEventListener('click', e => {
    if (e.target.closest('[data-search]')) { e.preventDefault(); open(); return; }
    if (!el.contains(e.target)) return;
    if (e.target.closest('[data-close]')) { close(); return; }
    const chip = e.target.closest('[data-q]');
    if (chip) { const i = $in(); i.value = chip.dataset.q; render(i.value); i.focus(); return; }
    if (e.target.closest('a')) remember((lastQ || '').trim() || '');
  });
  document.addEventListener('keydown', e => {
    const typing = /input|textarea|select/i.test(document.activeElement?.tagName || '');
    if (el.hidden) {
      if ((e.key === '/' && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) { e.preventDefault(); open(); }
      return;
    }
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    const rows = [...el.querySelectorAll('.ps-row')];
    if (!rows.length) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      active = (active + (e.key === 'ArrowDown' ? 1 : -1) + rows.length) % rows.length;
      rows.forEach((r, i) => r.classList.toggle('act', i === active));
      rows[active].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && document.activeElement === $in()) {
      e.preventDefault(); remember(lastQ.trim()); location.href = rows[Math.max(active, 0)].href;
    }
  });
})();
