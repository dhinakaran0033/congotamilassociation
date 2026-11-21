/* Congo Tamil Association – shared behaviour */
(function () {
  const B = (en, ta) => `<span class="en">${en}</span><span class="ta">${ta}</span>`;
  const page = document.body.dataset.page || 'home';

  const links = [
    ['home', 'index.html', 'Home', 'முகப்பு'],
    ['about', 'about.html', 'About Us', 'எங்களைப் பற்றி'],
    ['committee', 'committee.html', 'Committee', 'நிர்வாகக் குழு'],
    ['school', 'tamil-school.html', 'Tamil School', 'தமிழ்ப்பள்ளி'],
    ['charal', 'tamil-charal.html', 'Tamil Charal', 'தமிழ்ச்சாரல்'],
    ['events', 'events.html', 'Events', 'நிகழ்வுகள்'],
    ['gallery', 'gallery.html', 'Gallery', 'படத்தொகுப்பு'],
    ['contact', 'contact.html', 'Contact', 'தொடர்புக்கு'],
  ];

  const header = `
  <div class="topbar"><div class="container">
    <div>📍 ${B('Kinshasa, D.R. Congo', 'கின்சாசா, காங்கோ')}</div>
    <div><a href="mailto:ctakinshasa@gmail.com">✉ ctakinshasa@gmail.com</a><span class="sep">|</span><a href="https://wa.me/918754982735">📞 +91 87549 82735</a></div>
  </div></div>
  <header class="nav"><div class="container">
    <a class="brand" href="index.html"><img src="images/cropped-CTA-LOGO-2023-3-scaled-1.jpg" alt="CTA Logo">
      <span><b>${B('Congo Tamil Association', 'காங்கோ தமிழ்ச் சங்கம்')}</b><small>CTA · Kinshasa</small></span></a>
    <nav class="menu" id="menu"><ul>
      ${links.map(l => `<li><a href="${l[1]}" class="${l[0] === page ? 'active' : ''}">${B(l[2], l[3])}</a></li>`).join('')}
    </ul></nav>
    <div class="nav-actions">
      <div class="lang" role="group" aria-label="Language"><button data-l="en">EN</button><button data-l="ta">தமிழ்</button></div>
      <button class="btn btn-login btn-sm" id="loginBtn" type="button"></button>
      <a class="btn btn-gold btn-sm" href="membership.html">${B('Join CTA', 'இணையுங்கள்')}</a>
      <button class="burger" id="burger" aria-label="Menu">☰</button>
    </div>
  </div></header>
  <div class="kanchi"></div>`;

  const footer = `
  <div class="kanchi"></div>
  <footer><div class="container wrap">
    <div>
      <a class="brand" href="index.html"><img src="images/cropped-CTA-LOGO-2023-3-scaled-1.jpg" alt="CTA"><span><b>${B('Congo Tamil Association', 'காங்கோ தமிழ்ச் சங்கம்')}</b></span></a>
      <p style="margin-top:16px">${B('Preserving and promoting Tamil language, culture and traditions in D.R. Congo since 2011.', '2011 முதல் காங்கோவில் தமிழ் மொழி, பண்பாடு, மரபுகளைப் போற்றி வளர்க்கிறோம்.')}</p>
      <p style="margin-top:12px;color:var(--gold);font-family:var(--font-head)">இணைவோம்! சாதிப்போம்!</p>
    </div>
    <div><h4>${B('Explore', 'பக்கங்கள்')}</h4>
      ${links.map(l => `<a href="${l[1]}">${B(l[2], l[3])}</a>`).join('')}
    </div>
    <div><h4>${B('Get Involved', 'பங்கேற்க')}</h4>
      <a href="membership.html">${B('Become a Member', 'உறுப்பினராகுங்கள்')}</a>
      <a href="donate.html">${B('Donate', 'நன்கொடை')}</a>
      <a href="bylaws.html">${B('By-laws & Constitution', 'சட்டதிட்டங்கள்')}</a>
      <a href="events.html">${B('Upcoming Events', 'வரவிருக்கும் நிகழ்வுகள்')}</a>
    </div>
    <div><h4>${B('Contact', 'தொடர்புக்கு')}</h4>
      <a href="mailto:ctakinshasa@gmail.com">✉ ctakinshasa@gmail.com</a>
      <a href="https://wa.me/918754982735">💬 +91 87549 82735</a>
      <p style="margin-top:8px">📍 Kinshasa, D.R. Congo</p>
    </div>
  </div>
  <div class="copy"><div class="container">© <span id="yr"></span> ${B('Congo Tamil Association (formerly TYCA Congo). All rights reserved.', 'காங்கோ தமிழ்ச் சங்கம் (முன்னர் TYCA காங்கோ). அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.')}</div></div>
  </footer>
  <a class="float-wa" href="https://wa.me/918754982735" aria-label="WhatsApp" target="_blank" rel="noopener">💬</a>`;

  document.body.insertAdjacentHTML('afterbegin', header);
  document.body.insertAdjacentHTML('beforeend', footer);
  document.getElementById('yr').textContent = new Date().getFullYear();

  // Language toggle
  const setLang = (l) => {
    document.body.dataset.lang = l;
    document.documentElement.lang = l;
    localStorage.setItem('cta-lang', l);
    document.querySelectorAll('.lang button').forEach(b => b.classList.toggle('on', b.dataset.l === l));
    document.querySelectorAll('[data-ph-en]').forEach(el => el.placeholder = l === 'ta' ? el.dataset.phTa : el.dataset.phEn);
  };
  document.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.l)));
  setLang(localStorage.getItem('cta-lang') || 'en');

  // ---------- Admin login ----------
  // Static, client-side check for now (UI gate only: anyone can read these in the page source).
  // Replace with a real backend login (e.g. Firebase Authentication) later.
  const ADMIN = { user: 'admin@gmail.com', pass: 'Test@123' };
  const AUTH_KEY = 'cta-auth';
  const listeners = [];
  const isAdmin = () => localStorage.getItem(AUTH_KEY) === '1';
  const loginBtn = document.getElementById('loginBtn');
  const renderAuth = () => {
    document.body.classList.toggle('is-admin', isAdmin());
    loginBtn.innerHTML = isAdmin() ? '🔓 ' + B('Logout', 'வெளியேறு') : '🔒 ' + B('Login', 'உள்நுழை');
    listeners.forEach(fn => fn(isAdmin()));
  };
  window.CTAAuth = { isAdmin, onChange: fn => listeners.push(fn) };

  document.body.insertAdjacentHTML('beforeend', `
  <div class="modal" id="loginModal" role="dialog" aria-modal="true" aria-labelledby="loginTitle"><div class="modal-box">
    <button class="modal-x" type="button" aria-label="Close" data-close>✕</button>
    <h3 id="loginTitle">${B('Admin Login', 'நிர்வாகி உள்நுழைவு')}</h3>
    <form id="loginForm" autocomplete="off" novalidate>
      <label for="lgUser">${B('Username', 'பயனர்பெயர்')}</label>
      <input id="lgUser" type="email" required>
      <label for="lgPass">${B('Password', 'கடவுச்சொல்')}</label>
      <input id="lgPass" type="password" required>
      <div class="form-err" id="lgErr" role="alert"></div>
      <button class="btn btn-gold" type="submit">${B('Login', 'உள்நுழை')}</button>
    </form>
  </div></div>`);
  const lm = document.getElementById('loginModal');
  const closeLogin = () => lm.classList.remove('open');
  lm.addEventListener('click', e => { if (e.target === lm || e.target.hasAttribute('data-close')) closeLogin(); });
  document.addEventListener('keydown', e => e.key === 'Escape' && closeLogin());
  loginBtn.addEventListener('click', () => {
    if (isAdmin()) { localStorage.removeItem(AUTH_KEY); renderAuth(); return; }
    document.getElementById('lgErr').textContent = '';
    lm.classList.add('open');
    document.getElementById('lgUser').focus();
  });
  document.getElementById('loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const u = document.getElementById('lgUser').value.trim(), p = document.getElementById('lgPass').value;
    if (u.toLowerCase() === ADMIN.user && p === ADMIN.pass) {
      localStorage.setItem(AUTH_KEY, '1');
      e.target.reset(); closeLogin(); renderAuth();
    } else {
      document.getElementById('lgErr').textContent = document.body.dataset.lang === 'ta' ? 'பயனர்பெயர் அல்லது கடவுச்சொல் தவறு.' : 'Invalid username or password.';
    }
  });
  renderAuth();

  // Mobile menu
  const menu = document.getElementById('menu');
  document.getElementById('burger').addEventListener('click', () => menu.classList.toggle('open'));

  // ---------- Scroll animations ----------
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Tag elements with an animation type; siblings get a stagger delay
  const tag = (els, type, step = 0.12) => els.forEach((el, i) => {
    if (el.className.match(/\ba-(up|left|right|zoom|flip|pop)\b/)) return;
    el.classList.add(type);
    el.style.setProperty('--d', (i * step) + 's');
  });
  $$('.split').forEach(s => { tag([s.children[0]], 'a-left'); tag([s.children[1]], 'a-right'); });
  $$('.eyebrow').forEach(el => tag([el], 'a-up'));
  $$('.title').forEach(el => tag([el], 'a-up'));
  $$('.lead').forEach(el => tag([el], 'a-up'));
  $$('.grid.g3,.grid.g4,.grid.g2').forEach(g => tag($$(':scope > .card, :scope > .person, :scope > .event', g), 'a-flip'));
  $$('.person').forEach((p, i) => { const im = p.querySelector('.ph img'); if (im) im.classList.add('a-pop'); });
  $$('.stat').forEach((s, i) => tag([s], 'a-pop', 0));
  $$('.stats .grid').forEach(g => $$('.stat', g).forEach((s, i) => s.style.setProperty('--d', i * .12 + 's')));
  $$('.collage img').forEach((im, i) => { im.classList.remove('a-up'); tag([im], 'a-zoom', 0); im.style.setProperty('--d', (i * .25 + .1) + 's'); });
  $$('.badge-year').forEach(el => tag([el], 'a-pop'));
  $$('.issue,.notice,.contact-card,details').forEach((el, i) => tag([el], i % 2 ? 'a-right' : 'a-left', 0));
  $$('.timeline li').forEach(el => tag([el], 'a-left', 0));
  $$('.masonry figure').forEach((el, i) => tag([el], 'a-zoom', 0) || el.style.setProperty('--d', (i % 3) * .12 + 's'));
  $$('.quote blockquote,.quote cite').forEach((el, i) => tag([el], 'a-zoom', 0) || el.style.setProperty('--d', i * .25 + 's'));
  $$('.cta h2,.cta p,.cta .btn').forEach((el, i) => tag([el], 'a-up', 0) || el.style.setProperty('--d', i * .15 + 's'));
  $$('.form label,.form input,.form textarea,.form .btn').forEach((el, i) => { tag([el], 'a-up', 0); el.style.setProperty('--d', Math.min(i, 12) * .05 + 's'); });
  $$('.text.left > p, .text.left > a.btn').forEach((el, i) => { tag([el], 'a-up', 0); el.style.setProperty('--d', .2 + i * .12 + 's'); });

  $$('.reveal').forEach(el => {
    el.classList.remove('reveal');
    if (!/\ba-(up|left|right|zoom|flip|pop)\b/.test(el.className)) el.classList.add('a-up');
  });
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
    if (e.target.classList.contains('stat')) countUp(e.target.querySelector('b'));
  }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  $$('.a-up,.a-left,.a-right,.a-zoom,.a-flip,.a-pop').forEach(el => io.observe(el));

  // Count-up numbers (e.g. 12+)
  function countUp(b) {
    if (!b || reduce) return;
    const m = b.textContent.trim().match(/^(\d{1,3})(\+?)$/);
    if (!m) return;
    const end = +m[1], t0 = performance.now(), dur = 1600;
    const step = t => { const p = Math.min((t - t0) / dur, 1); b.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + m[2]; if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }

  // Progress bar, sticky header state, back-to-top, parallax
  const bar = Object.assign(document.createElement('div'), { className: 'progress' });
  const top = Object.assign(document.createElement('button'), { className: 'to-top', innerHTML: '↑', title: 'Top' });
  top.setAttribute('aria-label', 'Back to top');
  top.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });
  document.body.append(bar, top);
  const nav = document.querySelector('header.nav');
  const hero = document.querySelector('.hero,.page-hero');
  const emblem = document.querySelector('.hero-emblem');
  const cta = document.querySelector('.cta');
  const quoteEl = document.querySelector('.quote');
  let ticking = false;
  const onScroll = () => {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    nav.classList.toggle('stuck', y > 60);
    top.classList.toggle('show', y > 500);
    if (!reduce) {
      if (hero) { hero.style.setProperty('--bg', y * .3 + 'px'); hero.style.setProperty('--py', y * -.12 + 'px'); }
      if (emblem) emblem.style.setProperty('--ey', y * .1 + 'px');
      [[cta, '--bg'], [quoteEl, '--qy']].forEach(([el, v]) => {
        if (!el) return; const r = el.getBoundingClientRect();
        if (r.top < innerHeight && r.bottom > 0) el.style.setProperty(v, (r.top - innerHeight / 2) * (v === '--bg' ? -.15 : .25) + 'px');
      });
    }
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // 3D tilt on cards (desktop pointer only)
  if (!reduce && matchMedia('(hover:hover)').matches) {
    $$('.card,.person,.issue').forEach(c => {
      c.addEventListener('mousemove', e => {
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        c.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-8px)`;
      });
      c.addEventListener('mouseleave', () => c.style.transform = '');
    });
  }

  // Lightbox
  const figs = document.querySelectorAll('.masonry figure');
  if (figs.length) {
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = '<button aria-label="Close">✕</button><img alt="">';
    document.body.appendChild(lb);
    figs.forEach(f => f.addEventListener('click', () => { lb.querySelector('img').src = f.querySelector('img').src; lb.classList.add('open'); }));
    lb.addEventListener('click', () => lb.classList.remove('open'));
    document.addEventListener('keydown', e => e.key === 'Escape' && lb.classList.remove('open'));
  }

  // Forms: open the visitor's mail app with the details (static site, no server)
  document.querySelectorAll('form[data-mail]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(f);
    const body = [...d.entries()].map(([k, v]) => `${k}: ${v}`).join('\n');
    location.href = `mailto:ctakinshasa@gmail.com?subject=${encodeURIComponent(f.dataset.mail)}&body=${encodeURIComponent(body)}`;
  }));
})();
