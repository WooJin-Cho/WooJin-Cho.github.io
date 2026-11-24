(function () {
  var root = document.documentElement,
    btn = document.querySelector(".theme-toggle");
  if (!btn) return;
  function label() {
    var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    btn.setAttribute("aria-label", "Switch to " + next + " mode");
    btn.title = "Switch to " + next + " mode";
  }
  btn.addEventListener("click", function () {
    var light = root.getAttribute("data-theme") !== "light";
    if (light) root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
    try {
      localStorage.setItem("theme", light ? "light" : "dark");
    } catch (e) {}
    label();
  });
  label();
})();

(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll(".section-nav a"));
  var sections = links.map(function (a) {
    return document.getElementById(a.getAttribute("href").slice(1));
  });
  if (!links.length) return;
  var queued = false;
  function update() {
    queued = false;
    var line = window.innerHeight * 0.35,
      current = 0;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i] && sections[i].getBoundingClientRect().top <= line) current = i;
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2)
      current = sections.length - 1;
    links.forEach(function (a, i) {
      a.classList.toggle("active", i === current);
      if (i === current) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }
  window.addEventListener(
    "scroll",
    function () {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  window.addEventListener("resize", update);
  update();
})();
