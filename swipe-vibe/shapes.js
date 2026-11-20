// Floating dots — a port of the app's FloatingShapesView: a few 6px circles
// and squares drifting slowly along random arcs behind the content. Each one
// fades in where it stands, then starts moving. Honours reduced-motion.
(function () {
  var COLORS = ["#00C3D0", "#6AC28C", "#8B85D6", "#D685D1", "#FF8D28"];
  var COUNT = 7, SIZE = 6, FADE_MS = 600;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var layer = document.createElement("div");
  layer.className = "floating-shapes";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);

  function randomPoint() {
    return { x: Math.random() * (window.innerWidth - SIZE), y: Math.random() * (window.innerHeight - SIZE) };
  }

  function drift(el) {
    var to = randomPoint();
    var from = el._pos;
    var dist = Math.hypot(to.x - from.x, to.y - from.y) * 1.5;
    var speed = 10 + Math.random() * 5;                       // px/s, as in the app
    var duration = Math.min(20, Math.max(10, dist / speed)) * 1000;
    el.style.transition = "transform " + duration + "ms ease-in-out";
    el.style.transform = "translate(" + to.x + "px," + to.y + "px)";
    el._pos = to;
    setTimeout(function () { drift(el); }, duration);
  }

  for (var i = 0; i < COUNT; i++) {
    var el = document.createElement("span");
    var circle = Math.random() < 0.6;
    el.style.cssText =
      "position:absolute;left:0;top:0;width:" + SIZE + "px;height:" + SIZE + "px;" +
      "background:" + COLORS[i % COLORS.length] + ";opacity:0;" +
      (circle ? "border-radius:50%;" : "") + "will-change:transform,opacity;";
    var start = randomPoint();
    el._pos = start;
    el.style.transform = "translate(" + start.x + "px," + start.y + "px)";   // placed with no transition
    layer.appendChild(el);

    (function (el, delay) {
      setTimeout(function () {
        el.style.transition = "opacity " + FADE_MS + "ms ease-in-out";
        el.style.opacity = "1";
        if (!reduceMotion) setTimeout(function () { drift(el); }, FADE_MS);
      }, delay);
    })(el, 100 + i * 60);
  }
})();
