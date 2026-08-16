/*
 * Scroll-reveal fade-in for elements marked with the .rv class (see
 * components.css for the paired CSS). Extracted from Tailand-202610/dm.html
 * so every trip page shares the same behavior instead of re-implementing it.
 *
 * Usage: <script src="../_shared/scroll-reveal.js" defer></script>
 */
(function () {
  var targets = document.querySelectorAll('.rv');
  if (!targets.length) return;

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px' },
  );

  targets.forEach(function (el, i) {
    el.style.transitionDelay = (i % 3) * 55 + 'ms';
    io.observe(el);
  });
})();
