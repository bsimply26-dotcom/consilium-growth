(function () {
  var lines = [
    "We do not write the plan. We run it.",
    "Most brands get the Gulf wrong. We get it right.",
    "Strategy is common. Execution is rare."
  ];
  var head = document.querySelector("[data-rotate]");
  var slides = document.querySelectorAll(".hero-city span");
  var dots = document.querySelectorAll(".dots i");
  var i = 0;

  if (head && slides.length) {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) {
      setInterval(function () {
        i = (i + 1) % lines.length;
        head.style.opacity = 0;
        setTimeout(function () {
          head.textContent = lines[i];
          head.style.opacity = 1;
        }, 320);
        slides.forEach(function (s, n) { s.classList.toggle("on", n === i); });
        dots.forEach(function (dt, n) { dt.classList.toggle("on", n === i); });
      }, 7000);
      head.style.transition = "opacity .32s ease";
    }
  }

  var btn = document.querySelector("[data-nav]");
  var nav = document.getElementById("nav");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
})();
