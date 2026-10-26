// Petite Mort homepage concepts, shared data + chrome.
// Product data read from the live catalogue on 21 Oct 2026 (read only).
const CDN = 'https://cdn.petitemort.co/';
const ICON = 'https://pub-660afc1a03714b5b804fd8d4524a7eb9.r2.dev/';

window.PM = {
  CDN, ICON,
  stats: { rating: '4.4', reviews: '4,839', customers: '10,000' },
  products: [
    { h:'mysterious-woods', n:'Mysterious Woods', g:'Unisex', r:4.9, c:912, notes:['Sandalwood','Cedar','Leather'], fam:'Santal 33', pop:true, a:'pm-action-mysterious-woods-01M3QKN8H9BR3TA4RG07V2XNT3.jpg', f:'pm-flatlay-mysterious-woods-01M3QKPJ1VTATWFFH1F81DP105.jpg', group:'woody', icons:['Sandalwood','Cedar','Iris'] },
    { h:'smokey-pineapple', n:'Smokey Pineapple', g:'Men', r:4.8, c:905, notes:['Pineapple','Birch smoke','Musk'], fam:'Aventus', pop:true, a:'pm-action-smokey-pineapple-01M3QKNJ73TF8G5KDE1T9QM8QZ.jpg', f:'pm-flatlay-smokey-pineapple-01M3QKPVZ7B47D161SQ08ADGQE.jpg', group:'fresh', icons:['Pineapple','Birch','Musk'] },
    { h:'elegant-warmth', n:'Elegant Warmth', g:'Unisex', r:4.8, c:809, notes:['Saffron','Amberwood','Jasmine'], fam:'Baccarat Rouge 540', pop:true, a:'pm-action-elegant-warmth-01M3QKMRJ7QXM1NJXTJYTDC7DG.jpg', f:'pm-flatlay-elegant-warmth-01M3QKP369T2Q2750MD765HYB7.jpg', group:'warm', icons:['Saffron','Amberwood','Jasmine'] },
    { h:'suave-night', n:'Suave Night', g:'Men', r:4.5, c:974, notes:['Lavender','Licorice','Cinnamon'], fam:'Sauvage Elixir', pop:true, a:'pm-action-suave-night-01M3QKNM4TE6073Q95FB6Y7W2Q.jpg', f:'pm-flatlay-suave-night-01M3QKPY8PEBK4EG14KW9F6D39.jpg', group:'warm', icons:['Lavender','Licorice','Cinnamon'] },
    { h:'cigar-lounge', n:'Cigar Lounge', g:'Unisex', r:4.5, c:599, notes:['Tobacco','Vanilla','Spice'], fam:'Tobacco Vanille', pop:true, a:'pm-action-cigar-lounge-01M3QKMH77089ZX4ABQ072RQJ6.jpg', f:'pm-flatlay-cigar-lounge-01M3QKNW9RA0SBZR82Z8ZWHBZ0.jpg', group:'warm', icons:['Tobacco','Vanilla','Tonka'] },
    { h:'sensual-oud', n:'Sensual Oud', g:'Unisex', r:4.5, c:824, notes:['Oud','Sandalwood','Cardamom'], fam:'Oud Wood', pop:true, a:'pm-action-sensual-oud-01M3QKNFCG0917EE4WWS92ADA3.jpg', f:'pm-flatlay-sensual-oud-01M3QKPS10XNKHD0GPFWBRE54K.jpg', group:'woody', icons:['Oud','Sandalwood','Cardamom'] },
    { h:'cherry-bomb', n:'Cherry Bomb', g:'Unisex', r:4.5, c:339, notes:['Black cherry','Almond','Tonka'], fam:'Lost Cherry', pop:true, a:'pm-action-cherry-bomb-01M3QKMGYGJVZEEVM4XA6W5438.jpg', f:'pm-flatlay-cherry-bomb-01M3QKNVTP3BMDRPNFQ75XD6VX.jpg', group:'sweet', icons:['Cherry','Bitter-Almond','Tonka'] },
    { h:'silent-touch', n:'Silent Touch', g:'Unisex', r:4.9, c:785, notes:['Iso E Super','Cedar','Musk'], fam:null, pop:true, a:'pm-action-silent-touch-01M3QKNGSKVZYAC59SRNSER0VT.jpg', f:'pm-flatlay-silent-touch-01M3QKPSPD03WNF0B2DX43ED8M.jpg', group:'woody', icons:['Iso-E_Super','Cedar','Musk'] },
    { h:'everyday-vanilla', n:'Everyday Vanilla', g:'Women', r:4.8, c:293, notes:['Iris','Vanilla','Praline'], fam:'these fragrances', pop:false, a:'pm-action-everyday-vanilla-01M3QKMRT285A571KBVEG9R3ZM.jpg', f:'pm-flatlay-everyday-vanilla-01M3QKP3AFB4KV2N9152T6P02Q.jpg', group:'sweet', icons:['Iris','Vanilla','Praline'] },
    { h:'orange-roses', n:'Orange Roses', g:'Women', r:4.5, c:146, notes:['Rose','Blood orange','Peony'], fam:'Miss D', pop:false, a:'pm-action-orange-roses-01M3QKNCK3M67RJY2E8RE4G4RV.jpg', f:'pm-flatlay-orange-roses-01M3QKPM545NJJ9TY93YS8P96Y.jpg', group:'fresh', icons:['Rose','Orange','Peony'] },
    { h:'citrus-of-the-sea', n:'Citrus of the Sea', g:'Men', r:4.5, c:731, notes:['Grapefruit','Marine','Ambergris'], fam:'Invictus', pop:true, a:'pm-action-citrus-of-the-sea-01M3QKMHNPPX7HMJC4NN5F1YXV.jpg', f:'pm-flatlay-citrus-of-the-sea-01M3QKNW8VGD6R1KP53EPQDAF5.jpg', group:'fresh', icons:['Grapefruit','Salt','Ambergris'] },
    { h:'spicy-vanilla-coffee', n:'Spicy Vanilla Coffee', g:'Women', r:4.5, c:277, notes:['Coffee','Vanilla','Pink pepper'], fam:'these fragrances', pop:true, a:'pm-action-spicy-vanilla-coffee-01M3QKNKKSFE82X4CS160C09NY.jpg', f:'pm-flatlay-spicy-vanilla-coffee-01M3QKPWE8Q845CW0TED4FFWZQ.jpg', group:'sweet', icons:['Coffee','Vanilla','Pink-Pepper'] },
  ],
  // grouping by notes is a concept idea, not a live taxonomy
  groups: { woody:'Woody', warm:'Warm & spicy', sweet:'Sweet & gourmand', fresh:'Fresh & fruity' },
  prices: { ml50:'€ 39', ml100:'€ 59', sample:'€ 5', ds:'€ 45', dsWas:'€ 70', bundle:'€ 78', bundleWas:'€ 117', perBottle:'€ 26' },
  images: {
    ds: CDN+'PETITEMORT_15.png',           // Discovery Set box with +€40 gift card
    bundle: CDN+'Bundle%2050ml%20Image-01M559343GW2QQXAMV60KY5YH2.jpg',
    giftcard: CDN+'GIFT_CARD_PETITE_MORT.png',
    concentration: CDN+'EN.PM-Banner3.jpg',
    lifestyle: CDN+'pm-gallery-picture-2-en.jpg',
    guarantee: [CDN+'pm-guarantee-1-arrives.png', CDN+'pm-guarantee-2-wear.png', CDN+'pm-guarantee-3-decide.png'],
    reviewPhotos: ['mv5wtsva-i8jtp2ji','mv5r37uy-zywi8w4f','mv700cmz-a055osis','mv40y1c3-raookfjx','muwxuj26-89qeitne','muudyd0s-xkntescy','mus40fhc-mltfufsc'].map(x=>CDN+'review-photos/uploads/'+x+'.jpg'),
  },
  // review quotes as shown on the live PDP
  reviews: [
    { q:'smelled it on my colleague', t:'What a lovely perfume! I smelled it on my colleague and ordered it the very same day! The scent lasts a long time!', n:'Wilma K.' },
    { q:'even my pillow smells of it', t:'A truly lovely scent experience and it lingers for ages, even my pillow smells of it.', n:'Sylvia D.' },
    { q:'exchange it for another without any trouble', t:"Not only lovely scents and super-fast delivery, their after-sales service is great too!", n:'Tosca D.' },
    { q:'Honestly almost too strong', t:'Honestly almost too strong. Two sprays in the morning and it is still there when I get home.', n:'Tom V.' },
    { q:'gets even better the longer you wear it', t:'It really is a lovely scent; it actually gets even better the longer you wear it', n:'Anneke', p:'Cigar Lounge' },
    { q:'I get lots of compliments', t:'It smells lovely. The scent lingers around you for ages. And it really stands out, as I get lots of compliments about it.', n:'Peter', p:'Desert Ride' },
  ],
  proof: [ ['92%','found the scent they wanted'], ['95%','say it lasts longer than expected'], ['85%','describe it as unique'], ['84%','wear it every day'] ],
  press: [
    ['Cosmopolitan','The scent people stop you to ask about.'],
    ['Marie Claire','High-end fragrance, without the high-end price tag.'],
    ['','True luxury isn\'t about price. It\'s about concentration, craftsmanship.'],
    ['','Long-lasting intensity. Powerful projection.'],
  ],
};

PM.img = (p, key='a') => CDN + p[key];
// resized through the live image optimiser, same as the storefront does
PM.sized = (url, w=828) => `https://petitemort.co/_next/image?url=${encodeURIComponent(url)}&w=${w}&q=75`;
PM.pimg = (p, key='a', w=828) => PM.sized(CDN + p[key], w);
PM.stars = r => '★★★★★'.slice(0, Math.round(r)) + '☆☆☆☆☆'.slice(0, 5 - Math.round(r));

// Catalogue card, same fields and order as the live /store card.
PM.card = (p, opts={}) => `
  <a class="pcard${opts.vertical?' v':''}" href="#${p.h}">
    <div class="pimg">
      ${p.pop?'<span class="badge">Popular</span>':''}
      <img src="${PM.img(p, opts.vertical?'f':'a')}" alt="${p.n}" loading="lazy">
      <img class="alt" src="${PM.img(p, opts.vertical?'a':'f')}" alt="" loading="lazy">
    </div>
    <div class="pbody">
      <div class="prow"><span><span class="stars">★★★★★</span> <span class="rating">${p.r} | ${p.c} reviews</span></span><span class="gender">${p.g}</span></div>
      <div class="pname">${p.n}</div>
      <div class="pnotes">${p.notes.join(' · ')}</div>
      ${p.fam?`<div class="pfamily">Same scent family as ${p.fam}</div>`:''}
      <div class="pprice">${PM.prices.ml50}</div>
    </div>
    <span class="padd" aria-label="Add">+</span>
  </a>`;

const ICONS = {
  cart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 4h2l2.4 11h11l2-8H6.2"/><circle cx="9" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/></svg>',
  user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
  menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
};

PM.header = () => `
  <div class="announce">Bundle Deal: Buy 2, Get 1 free &rarr;</div>
  <header class="site-header"><div class="wrap">
    <a class="logo" href="#">Petite Mort</a>
    <nav class="nav"><a href="#">Men</a><a href="#">Women</a><a href="#">Best Sellers</a><a href="#">Bundles &amp; Save</a><a href="#">Discovery Set</a><a href="#">Contact</a></nav>
    <div class="hdr-actions">
      <a class="btn btn-coral" href="#">Build your bundle</a>
      <span>${ICONS.cart}</span><button class="hdr-search" data-search aria-label="Search">${ICONS.search}</button><span>${ICONS.user}</span>
      <span class="lang">EN / NL</span>
      <button class="burger" aria-label="Menu">${ICONS.menu}</button>
    </div>
  </div></header>`;

PM.footer = () => `
  <footer class="site-footer"><div class="wrap">
    <div class="cols">
      <div><div class="logo" style="color:var(--cream-2)">Petite Mort</div>
        <p style="margin-top:14px;font-size:15px">Sign up for exclusive discounts &amp; product drops!</p>
        <form class="news" onsubmit="return false"><input placeholder="Email address" aria-label="Email"><button>Sign up</button></form></div>
      <div><h4>Shop</h4><ul><li>Shop Fragrances</li><li>Discovery Set</li><li>Reviews</li><li>Wholesale</li><li>Private Label</li><li>Publications</li></ul></div>
      <div><h4>Info</h4><ul><li>Contact</li><li>Shipping</li><li>Returns</li><li>FAQ</li><li>Privacy Policy</li><li>Terms of Use</li></ul></div>
      <div><h4>Follow us</h4><ul><li>Instagram</li><li>Facebook</li></ul><h4 style="margin-top:22px">Language</h4><ul><li>English / Nederlands</li></ul></div>
    </div>
    <div class="legal"><span>Petite Mort | &copy; 2026 All Rights Reserved</span><span>Visa · Mastercard · Amex · Apple Pay</span></div>
  </div></footer>`;

const CONCEPTS = [['10-direct.html','R4','Direct'],['12-quiet-iii.html','R4','Quiet III']];
PM.bar = () => `<nav class="concept-bar">${CONCEPTS.map(([f,n,t])=>`<a href="${f}" class="${location.pathname.endsWith(f)?'on':''}">${n}<span> ${t}</span></a>`).join('')}</nav>`;

// search on every concept page: full catalogue + predictive panel
(() => {
  const base = (document.currentScript && document.currentScript.src || '').replace(/shared\.js.*$/, '');
  const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = base + 'search.css'; document.head.appendChild(css);
  const load = src => new Promise(r => { const s = document.createElement('script'); s.src = base + src; s.onload = r; document.head.appendChild(s); });
  load('catalogue.js').then(() => load('search.js'));
})();

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-pm="header"]').forEach(el => el.outerHTML = PM.header());
  document.querySelectorAll('[data-pm="footer"]').forEach(el => el.outerHTML = PM.footer());
  document.body.insertAdjacentHTML('beforeend', PM.bar());
});
