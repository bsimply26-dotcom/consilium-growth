/* Consilium Growth. Production script. */
(function () {
  // Hero rotation: headline and city change together so they never contradict.
  var slides = [
    { city: "Dubai",    h: "Most brands get market entry wrong.<br>We get it <span class='green'>right.</span>" },
    { city: "London",   h: "We do not write the plan.<br>We <span class='green'>run it.</span>" },
    { city: "Shanghai", h: "Strategy is common.<br>Execution is <span class='green'>rare.</span>" },
    { city: "New York", h: "Eleven markets.<br>Built from <span class='green'>zero.</span>" }
  ];
  var layers = document.querySelectorAll('.hero-city .layer');
  var head = document.querySelector('[data-headline]');
  var dots = document.querySelectorAll('.dots i');
  var i = 0;

  function show(n) {
    layers.forEach(function (s) { s.classList.toggle('on', s.dataset.city === slides[n].city); });
    if (head) head.innerHTML = slides[n].h;
    dots.forEach(function (d, di) { d.classList.toggle('on', di === n); });
  }
  if (layers.length) {
    setInterval(function () { i = (i + 1) % slides.length; show(i); }, 3800);
  }

  // Mobile nav toggle
  var toggle = document.querySelector('[data-nav]');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  // Back to top
  var tt = document.getElementById('totop');
  if (tt) {
    window.addEventListener('scroll', function () { tt.classList.toggle('show', window.scrollY > 500); });
    tt.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }
})();
