/* Consilium Growth. Production script. */
(function () {
  // Hero rotation: headline and city change together so they never contradict.
  var slides = [
    { city: "Dubai",    h: "<span class='ln'>Most brands get market entry wrong.</span><span class='ln'>We get it <span class='green'>right.</span></span>" },
    { city: "London",   h: "<span class='ln'>We do not write the plan.</span><span class='ln'>We <span class='green'>run it.</span></span>" },
    { city: "Shanghai", h: "<span class='ln'>Strategy is common.</span><span class='ln'>Execution is <span class='green'>rare.</span></span>" },
    { city: "New York", h: "<span class='ln'>Eleven markets.</span><span class='ln'>Built from <span class='green'>zero.</span></span>" }
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
