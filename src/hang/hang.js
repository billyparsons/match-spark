// the rooms are hung (session 105).
// a room is a panel hanging from one wire at the middle of its top edge.
// it hangs the way its words weigh it: every bit of readable text counts,
// where it sits on the panel, and the panel turns until that weight is
// under the wire. a long room is a long pendulum and swings slowly. the
// pointer is the air. the wire goes up out of the window to "/", and
// pulling on it takes you there.
(() => {
  const root = document.documentElement;
  const body = document.body;
  if (!root.dataset.hung || !body) return;

  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const paint = root.dataset.paint || '#161412';
  const w = Number(root.dataset.w) || 1;
  const heaviest = Number(root.dataset.heaviest) || w;
  root.style.setProperty('--paint', paint);
  // the wire is as thick as the room is heavy
  root.style.setProperty('--wire', (1 + 1.6 * Math.sqrt(w / heaviest)).toFixed(2) + 'px');

  const wire = document.createElement('div');
  wire.className = 'hang-wire';
  const hook = document.createElement('a');
  hook.className = 'hang-hook';
  hook.href = '/';
  hook.innerHTML = '<span class="hang-label">up the wire, to the mobile</span>';
  // after body, so they don't turn with it
  root.append(wire, hook);

  hook.addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || still) return;
    e.preventDefault();
    root.classList.add('hang-lift');
    setTimeout(() => { location.href = '/'; }, 520);
  });
  addEventListener('pageshow', (e) => { if (e.persisted) root.classList.remove('hang-lift'); });

  const DEG = Math.PI / 180;
  let theta = 0, omega = 0, rest = 0, limit = 2 * DEG, H = 1, running = false, last = 0;

  // where the words are
  function weigh() {
    // the pin, where the panel would be if it hung straight
    const px = body.offsetLeft + body.offsetWidth / 2 - scrollX, py = body.offsetTop - scrollY;
    const c = Math.cos(-theta), s = Math.sin(-theta);
    let m = 0, mx = 0, my = 0;
    const walk = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => {
        const p = n.parentElement;
        if (!p || /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(p.tagName)) return NodeFilter.FILTER_REJECT;
        return /[\p{L}\p{N}]/u.test(n.data) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    const range = document.createRange();
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      const k = (n.data.match(/[\p{L}\p{N}'’]+/gu) || []).length;
      range.selectNodeContents(n);
      const r = range.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      // back into the panel's own frame, as if it hung straight
      const dx = r.left + r.width / 2 - px, dy = r.top + r.height / 2 - py;
      mx += k * (dx * c - dy * s);
      my += k * (dx * s + dy * c);
      m += k;
    }
    H = Math.max(body.offsetHeight, 1);
    const gut = Math.max(parseFloat(getComputedStyle(body).marginLeft) || 0, 24);
    // it can lean, but it stays on the wall
    limit = Math.min(2.2 * DEG, Math.atan((gut * 1.5) / H));
    const wanted = m ? Math.atan2(mx / m, Math.max(my / m, 1)) : 0;
    rest = Math.max(-limit, Math.min(limit, wanted));
  }

  // a stiff panel on a pin at its top edge: omega^2 = 3g / 2L.
  // 96px to the inch, so the log, which is metres long, takes seconds.
  const G = 9.81 * 3779.5;
  function step(now) {
    const dt = Math.min(0.033, (now - last) / 1000 || 0.016);
    last = now;
    const k = (3 * G) / (2 * H);
    omega += (-k * Math.sin(theta - rest) - 0.9 * omega) * dt;
    theta += omega * dt;
    const hard = limit * 1.4;
    if (theta > rest + hard) { theta = rest + hard; omega *= -0.3; }
    if (theta < rest - hard) { theta = rest - hard; omega *= -0.3; }
    paintTilt();
    if (Math.abs(omega) < 0.00004 && Math.abs(theta - rest) < 0.00004) {
      theta = rest; paintTilt(); running = false; return;
    }
    requestAnimationFrame(step);
  }
  function paintTilt() {
    root.style.setProperty('--tilt', (theta / DEG).toFixed(4) + 'deg');
    // the shadow slides the way the bottom swings
    root.style.setProperty('--lean', (-Math.sin(theta) * Math.min(H, innerHeight) * 0.06).toFixed(2) + 'px');
  }
  function go() {
    if (still) { theta = rest; paintTilt(); return; }
    if (!running) { running = true; last = performance.now(); requestAnimationFrame(step); }
  }

  // the air: a pointer moving past pushes the panel where it is
  let px = null, pt = 0;
  addEventListener('pointermove', (e) => {
    const now = performance.now();
    if (px !== null && now - pt < 80) {
      const vx = (e.clientX - px) / Math.max(now - pt, 1);
      const arm = Math.max(0, e.clientY - (body.offsetTop - scrollY)) / H;
      omega += vx * arm * 0.007 * (1 - 0.8 * Math.sqrt(w / heaviest));
      go();
    }
    px = e.clientX; pt = now;
  }, { passive: true });

  function settle() { weigh(); go(); }

  // it arrives just hung: someone let go of it a moment ago
  weigh();
  theta = still ? rest : rest + (Math.random() < 0.5 ? -1 : 1) * limit * 1.3;
  paintTilt();
  go();
  addEventListener('load', settle);
  let t;
  addEventListener('resize', () => { clearTimeout(t); t = setTimeout(settle, 200); });
  if (document.fonts) document.fonts.ready.then(settle);
})();
