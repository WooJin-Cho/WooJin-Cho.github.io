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

(function () {
  var section = document.getElementById("publication");
  if (!section) return;
  var buttons = Array.prototype.slice.call(section.querySelectorAll(".pub-filter button"));
  var groups = Array.prototype.slice.call(section.querySelectorAll(".pub-group"));
  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      var filter = button.getAttribute("data-filter");
      buttons.forEach(function (b) {
        b.setAttribute("aria-pressed", b === button ? "true" : "false");
      });
      groups.forEach(function (group) {
        group.hidden = filter !== "all" && group.getAttribute("data-cat") !== filter;
      });
    });
  });
})();

(function () {
  var gauge = document.querySelector(".gauge");
  if (!gauge) return;
  var craft = gauge.querySelector(".gauge-craft"),
    queued = false,
    last = -1,
    timer;
  function update() {
    queued = false;
    var max = document.documentElement.scrollHeight - window.innerHeight,
      t = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0,
      travel = Math.max(0, gauge.clientHeight - craft.offsetHeight);
    gauge.style.setProperty("--y", (t * travel).toFixed(1) + "px");
    gauge.classList.toggle("is-orbit", t > 0.996);
    if (last >= 0 && t !== last) {
      gauge.classList.add("is-burning");
      clearTimeout(timer);
      timer = setTimeout(function () {
        gauge.classList.remove("is-burning");
      }, 160);
    }
    last = t;
  }
  function request() {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  }
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
  if ("ResizeObserver" in window) new ResizeObserver(request).observe(document.body);
  update();
})();
