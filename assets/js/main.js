/* Consilium Growth. Site script v2. */
(function () {
  // Hero: three regions side by side. Each one gently takes the stage in turn, then the three return.
  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var panels = [].slice.call(hero.querySelectorAll('.cpanel'));
    var reduceH = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var si = -1, ht = null;
    function show(k) {
      si = k;
      hero.classList.toggle('is-focus', k >= 0);
      panels.forEach(function (p, r) { p.classList.toggle('on', r === k); p.setAttribute('aria-pressed', r === k ? 'true' : 'false'); });
      hero.querySelectorAll('.hero-msg .msg').forEach(function (m) { var on = m.getAttribute('data-k') === (k >= 0 ? String(k) : 'all'); m.classList.toggle('on', on); if (on) m.removeAttribute('aria-hidden'); else m.setAttribute('aria-hidden', 'true'); });
      hero.querySelectorAll('.hero-svcs button').forEach(function (b, n) { b.classList.toggle('on', n === k); });
    }
    function auto(delay) { clearTimeout(ht); if (reduceH) return; ht = setTimeout(function () { show(si + 1 >= panels.length ? -1 : si + 1); auto(); }, delay || (si < 0 ? 6000 : 4000)); }
    panels.forEach(function (p, r) { p.addEventListener('click', function () { show(si === r ? -1 : r); auto(8000); }); });
    auto(6500);
  }

  // Mobile nav
  var toggle = document.querySelector('[data-nav]');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); });
    });
  }

  // Back to top
  var tt = document.getElementById('totop');
  if (tt) {
    window.addEventListener('scroll', function () { tt.classList.toggle('show', window.scrollY > 600); }, { passive: true });
    tt.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  // Contact form: send to Formspree, then go to the thank you page (the ad conversion page).
  var form = document.querySelector('[data-contact-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type=submit]');
      var err = form.querySelector('.form-error');
      btn.disabled = true; btn.textContent = 'Sending';
      if (err) err.style.display = 'none';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (r) {
          if (r.ok) { window.location.href = 'thank-you.html'; return; }
          throw new Error('send failed');
        })
        .catch(function () {
          btn.disabled = false; btn.textContent = 'Send';
          if (err) err.style.display = 'block';
        });
    });
  }

  // Year in footer
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();

/* Option B motion */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window) document.documentElement.classList.add('js-motion');
  // safety net: never leave content hidden
  setTimeout(function () { document.querySelectorAll('.reveal, .timeline.draw').forEach(function (el) { el.classList.add('in'); }); }, 2500);
  // header turns solid after the hero
  var head = document.querySelector('.home .site-head');
  if (head) {
    var onS = function () { head.classList.toggle('scrolled', window.scrollY > 40); };
    window.addEventListener('scroll', onS, { passive: true }); onS();
  }
  // count up
  function countUp(el) {
    var end = +el.getAttribute('data-count'), pre = el.getAttribute('data-pre') || '', suf = el.getAttribute('data-suf') || '';
    if (reduce) return;
    var from = +(el.getAttribute('data-from') || 0); var t0 = null, dur = 1600;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + Math.round(from + (end - from) * e).toLocaleString('en-US') + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  // reveal on scroll
  var targets = document.querySelectorAll('.reveal, .timeline.draw, .feature');
  if (!('IntersectionObserver' in window) || reduce) {
    targets.forEach(function (t) { t.classList.add('in', 'in-view'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in', 'in-view');
        e.target.querySelectorAll('[data-count]').forEach(countUp);
        if (e.target.hasAttribute('data-count')) countUp(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (t) { io.observe(t); });
  }
  // gentle parallax on the hero wordmark and banner image
  if (!reduce) {
    var word = document.querySelector('[data-parallax]');
    var banner = document.querySelector('.banner-img');
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (word && y < 1200) word.style.transform = 'translateY(' + (y * 0.25) + 'px)';
      if (banner) {
        var r = banner.parentElement.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) banner.style.transform = 'translateY(' + (r.top * -0.08) + 'px)';
      }
    }, { passive: true });
  }
})();

/* Sector slider */
(function () {
  var root = document.querySelector('.slider');
  if (!root) return;
  var slides = root.querySelectorAll('.slide'), texts = root.querySelectorAll('.st'), tabs = root.querySelectorAll('.tab');
  var n = slides.length, i = 0, timer = null, DUR = 5500;
  root.style.setProperty('--dur', DUR + 'ms');
  function go(k) {
    i = (k + n) % n;
    slides.forEach(function (s, x) { s.classList.toggle('on', x === i); });
    texts.forEach(function (s, x) { s.classList.toggle('on', x === i); });
    tabs.forEach(function (t, x) {
      t.classList.remove('on'); t.classList.toggle('done', x < i);
      t.setAttribute('aria-selected', x === i ? 'true' : 'false');
    });
    void tabs[i].offsetWidth; tabs[i].classList.add('on');
    restart();
  }
  function restart() { clearTimeout(timer); if (!root.classList.contains('paused')) timer = setTimeout(function () { go(i + 1); }, DUR); }
  tabs.forEach(function (t, x) { t.addEventListener('click', function () { go(x); }); });
  root.addEventListener('mouseenter', function () { root.classList.add('paused'); clearTimeout(timer); });
  root.addEventListener('mouseleave', function () { root.classList.remove('paused'); go(i); });
  var sx = null;
  root.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  root.addEventListener('touchend', function (e) {
    if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
  });
  go(0);
})();

/* Service sheet */
(function () {
  var sheet = document.getElementById('sheet'); if (!sheet) return;
  var slot = sheet.querySelector('.sheet-slot'), last = null;
  function open(id, btn) {
    var src = document.getElementById(id); if (!src) return;
    slot.innerHTML = src.innerHTML; last = btn;
    sheet.hidden = false; document.body.classList.add('locked');
    requestAnimationFrame(function () { requestAnimationFrame(function () { sheet.classList.add('open'); }); });
    var c = sheet.querySelector('.sheet-close'); if (c) c.focus();
  }
  function close() {
    sheet.classList.remove('open'); document.body.classList.remove('locked');
    setTimeout(function () { sheet.hidden = true; slot.innerHTML = ''; }, 450);
    if (last) last.focus();
  }
  document.querySelectorAll('[data-sheet]').forEach(function (b) { b.addEventListener('click', function () { open(b.getAttribute('data-sheet'), b); }); });
  sheet.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', close); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) close(); });
})();

/* How we work walkthrough */
(function () {
  var root = document.querySelector('.walk'); if (!root) return;
  var imgs = root.querySelectorAll('.w-img'), steps = root.querySelectorAll('.w-step'), dots = root.querySelectorAll('.w-dot');
  var i = 0, n = steps.length;
  function go(k) {
    i = (k + n) % n;
    [imgs, steps, dots].forEach(function (set) { set.forEach(function (el, x) { el.classList.toggle('on', x === i); }); });
  }
  dots.forEach(function (d, x) { d.addEventListener('click', function () { go(x); }); });
  root.querySelector('.w-arrow.prev').addEventListener('click', function () { go(i - 1); });
  root.querySelector('.w-arrow.next').addEventListener('click', function () { go(i + 1); });
  var sx = null, stage = root.querySelector('.w-stage');
  stage.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1)); });
})();

/* Flip cards */
document.querySelectorAll('.flip').forEach(function (f) {
  f.addEventListener('click', function () { f.classList.toggle('on'); });
});

/* Sticky talk to us on phones */
(function () {
  var dock = document.querySelector('.dock'); if (!dock) return;
  var hero = document.querySelector('.hero'), closing = document.querySelector('.closing-v2');
  function check() {
    var past = hero ? hero.getBoundingClientRect().bottom < 0 : window.scrollY > 500;
    var atEnd = closing ? closing.getBoundingClientRect().top < window.innerHeight * 0.7 : false;
    dock.classList.toggle('show', past && !atEnd);
  }
  window.addEventListener('scroll', check, { passive: true }); check();
})();

/* What we deliver: two cards at a time on mobile, moving through the set */
(function () {
  var box = document.querySelector('[data-pager]'); if (!box) return;
  var cards = [].slice.call(box.children), pages = [];
  for (var i = 0; i < cards.length; i += 2) {
    var pg = document.createElement('div'); pg.className = 'cpage';
    box.appendChild(pg); pg.appendChild(cards[i]); if (cards[i + 1]) pg.appendChild(cards[i + 1]); pages.push(pg);
  }
  var bars = document.querySelectorAll('.pager-bar i'), k = 0, t = null, inView = false;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function go(n) {
    pages[k].classList.remove('on'); pages[k].classList.add('out');
    var old = pages[k]; setTimeout(function () { old.classList.remove('out'); }, 900);
    k = (n + pages.length) % pages.length; pages[k].classList.add('on');
    bars.forEach(function (b, x) { b.classList.remove('on'); b.classList.toggle('done', x < k); });
    void (bars[k] && bars[k].offsetWidth); if (bars[k]) bars[k].classList.add('on');
    clearTimeout(t); if (!reduce && inView) t = setTimeout(function () { go(k + 1); }, 4200);
  }
  pages[0].classList.add('on'); if (bars[0]) bars[0].classList.add('on');
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es.forEach(function (e) { inView = e.isIntersecting; clearTimeout(t); if (inView && !reduce) t = setTimeout(function () { go(k + 1); }, 4200); }); }, { threshold: .35 }).observe(box);
  var sx = null;
  box.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 40) go(k + (dx < 0 ? 1 : -1)); });
})();

/* How we work: the steps light up one after another */
(function () {
  var box = document.querySelector('[data-steps]'); if (!box) return;
  var steps = [].slice.call(box.querySelectorAll('.step3')), k = -1, t = null;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  box.classList.add('is-live');
  function go(n) { k = n % steps.length; steps.forEach(function (s, x) { s.classList.toggle('on', x === k); s.classList.toggle('done', x < k); }); clearTimeout(t); if (!reduce) t = setTimeout(function () { go(k + 1); }, 3000); }
  steps.forEach(function (s, x) { s.addEventListener('click', function () { go(x); }); });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { if (k < 0) go(0); else if (!t) go(k); } else { clearTimeout(t); t = null; } }); }, { threshold: .3 }).observe(box);
  else go(0);
})();

/* Swipe rails: services and example projects on phones */
(function () {
  document.querySelectorAll('[data-rail]').forEach(function (rail) {
    var track = rail.querySelector('.rail-track'), thumb = rail.querySelector('.rail-bar i'), items = [].slice.call(track.children);
    function update() {
      var max = track.scrollWidth - track.clientWidth;
      if (thumb) { var w = Math.max(18, track.clientWidth / track.scrollWidth * 100); thumb.style.width = w + '%'; thumb.style.transform = 'translateX(' + (max > 0 ? track.scrollLeft / max * (100 / w * 100 - 100) : 0) + '%)'; }
      var mid = track.getBoundingClientRect().left + 40;
      var best = null, bd = 1e9;
      items.forEach(function (it) { var d = Math.abs(it.getBoundingClientRect().left - mid); if (d < bd) { bd = d; best = it; } });
      items.forEach(function (it) { it.classList.toggle('is-current', it === best); });
    }
    track.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', update); update();
  });
})();

/* Story progress line on phones */
(function () {
  if (!document.body.classList.contains('home')) return;
  var bar = document.createElement('div'); bar.className = 'story-progress'; bar.innerHTML = '<i></i>'; document.body.appendChild(bar);
  var fill = bar.firstChild;
  function upd() { var h = document.documentElement.scrollHeight - innerHeight; var p = h > 0 ? scrollY / h : 0; fill.style.height = (p * 100) + '%'; bar.classList.toggle('show', scrollY > innerHeight * .5); }
  addEventListener('scroll', upd, { passive: true }); upd();
})();

/* Contact: earliest date is today, and send the visitor's time zone with the form */
(function () {
  var d = document.getElementById('cdate'); if (!d) return;
  var t = new Date(); d.min = new Date(t.getTime() - t.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  try { var tz = Intl.DateTimeFormat().resolvedOptions().timeZone; var f = document.querySelector('[data-tz-field]'), s = document.querySelector('[data-tz]'); if (tz) { if (f) f.value = tz; if (s) s.textContent = ' (' + tz.replace(/_/g, ' ') + ')'; } } catch (e) {}
})();
