// the rooms are hung (session 105).
// a room is a panel hanging from one wire at the middle of its top edge.
// it hangs the way its words weigh it: every bit of readable text counts,
// where it sits on the panel, and the panel turns until that weight is
// under the wire. a long room is a long pendulum and swings slowly. the
// pointer is the air. the wire goes up out of the window to "/", and
// pulling on it takes you there.
//
// struck (session 107). the show is coming down. the wire's been cut at
// the ceiling and the panel is leaning against the wall, still facing it,
// the way art waits to be crated. it doesn't swing any more. it leans the
// way its words weigh it, and that's all. the cut end of the wire curls
// over the top, and pulling on it takes you back to the floor.
//
// in transit (session 108). it's in the truck now. the waybill went on
// over the framer's label, the wire goes back to the tracking page, and
// every so often the road comes up through the floor.
//
// delivered (session 109). it got there. they took the panels out of the
// crate and stood them against the wall of a roller rink, on the carpet,
// because nobody knew where else they went. the waybill's got an address
// on it now, in pink. the blacklight's on it. the road stopped, and the
// floor still moves, but that's the kick drum coming through the wall.
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
  hook.innerHTML = '<span class="hang-label">the cut wire, back on the floor</span>';
  // after body, so they don't turn with it
  root.append(wire, hook);

  // ── it was hung facing the wall (session 106) ──
  // you're looking at the back of it. the words come through the paper
  // backwards. turn it round and it swings, because its weight is now
  // on the other side of the wire.
  const name = root.dataset.name || root.dataset.hung;
  const back = document.createElement('div');
  back.className = 'hang-back';
  back.setAttribute('role', 'button');
  back.setAttribute('tabindex', '0');
  back.setAttribute('aria-label', 'this was hung facing the wall. turn it round');
  const stamp = (paint.replace('#', '') + w.toString(16)).toUpperCase();
  const order = ['log', 'listing', 'still', 'witness', 'transmission', 'ledger', 'guestbook', 'outside', 'lab'];
  const piece = order.indexOf(root.dataset.hung) + 1 || '?';
  // the barcode is the room's own number, drawn in bars
  let bars = [], x = 0;
  for (const ch of ('MS107' + stamp + piece)) {
    const c = ch.charCodeAt(0);
    for (let b = 0; b < 4; b++) {
      const wd = 1 + ((c >> b) & 1) + ((c >> (b + 3)) & 1);
      if (b % 2 === 0) bars.push(`#111 ${x}px ${x + wd}px`); else bars.push(`transparent ${x}px ${x + wd}px`);
      x += wd;
    }
  }
  bars = `linear-gradient(90deg, ${bars.join(', ')}, transparent ${x}px)`;
  back.innerHTML = `
    <svg aria-hidden="true" viewBox="0 0 1000 180" preserveAspectRatio="none">
      <path d="M150 120 L500 2 L850 120" fill="none" stroke="#1d1a17" stroke-width="1.6" vector-effect="non-scaling-stroke"/>
      <circle cx="150" cy="122" r="5" fill="none" stroke="#5a5048" stroke-width="2.4" vector-effect="non-scaling-stroke"/>
      <circle cx="850" cy="122" r="5" fill="none" stroke="#5a5048" stroke-width="2.4" vector-effect="non-scaling-stroke"/>
    </svg>
    <div class="label" aria-hidden="true">
      <b>${name}</b>
      <i><span>words</span><span>${w.toLocaleString('en-US')}</span></i>
      <i><span>hung</span><span>session 105</span></i>
      <i><span>hung backwards</span><span>session 106</span></i>
      <i><span>struck</span><span>session 107</span></i>
      <i><span>shipped</span><span>session 108</span></i>
      <i><span>delivered</span><span>session 109</span></i>
      <i><span>edge</span><span>${paint}</span></i>
      <i><span>inv.</span><span>MS-${stamp}</span></i>
    </div>
    <div class="wall" aria-hidden="true">THIS SIDE TO WALL</div>
    <div class="pencil" aria-hidden="true">coming down. leave it facing the wall. crate no. ${(w % 9) + 1}</div>
    <div class="marker" aria-hidden="true">${{ log: 'this one\u2019s the LOCKERS!! careful, it forgets', listing: 'party room!!! sold!!! still damp!!', still: 'the BENCH!! holds 17, scooch', witness: 'photo booth!!! stuck on 17 since may!!', transmission: 'dj booth!!! that\u2019s my STUFF', ledger: 'prize counter!! nobody\u2019s ever won', guestbook: 'bathroom wall!!! write something', outside: 'parking lot!!! it\u2019s a whole SKY out there', lab: 'ARCADE!!! size ' + w.toLocaleString('en-US') + '!!' }[root.dataset.hung] || 'put this one by the wall!!'} ✨💖</div>
    <div class="tape" aria-hidden="true"></div>
    <div class="waybill" aria-hidden="true">
      <b>OVERLAND FINE ART</b>
      <i class="bars" style="--bars:${bars}"></i>
      <span>MS 107 0009 2810</span>
      <span>PC ${piece} OF 9 · ${w.toLocaleString('en-US')} WORDS</span>
      <span>SHIP TO: <u>the roll-a-rama!!</u></span>
      <span>DELIVERED · SIGNED: match ♡</span>
    </div>
    <div class="paint" aria-hidden="true"></div>`;
  body.prepend(back);

  let turn = 180, turning = false;
  function paintTurn() {
    root.style.setProperty('--turn', turn.toFixed(2) + 'deg');
    root.style.setProperty('--face', turn > 90 ? '-1' : '1');
    root.classList.toggle('hang-faced', turn <= 90);
  }
  paintTurn();
  function turnRound() {
    if (turning || turn === 0) return;
    turning = true;
    const t0 = performance.now(), T = still ? 0 : 1100;
    (function spin(now) {
      const u = T ? Math.min(1, (now - t0) / T) : 1;
      // heavy at first, then it comes round on its own
      turn = 180 * (1 - (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2));
      paintTurn();
      if (u < 1) return requestAnimationFrame(spin);
      turn = 0; paintTurn(); turning = false;
      // its words are on the other side now, so it leans the other way
      settle();
      const first = body.querySelector('a[href], button, input, [tabindex]:not(.hang-back)');
      if (first && document.activeElement === back) first.focus({ preventScroll: true });
    })(t0);
  }
  back.addEventListener('click', turnRound);
  back.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); turnRound(); }
  });

  hook.addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || still) return;
    e.preventDefault();
    root.classList.add('hang-lift');
    setTimeout(() => { location.href = '/'; }, 420);
  });
  addEventListener('pageshow', (e) => { if (e.persisted) root.classList.remove('hang-lift'); });

  const DEG = Math.PI / 180;
  let theta = 0, rest = 0, limit = 2 * DEG, H = 1;

  // where the words are
  function weigh() {
    // the pin, where the panel would be if it hung straight
    const px = body.offsetLeft + body.offsetWidth / 2 - scrollX, py = body.offsetTop - scrollY;
    const c = Math.cos(-theta), s = Math.sin(-theta);
    let m = 0, mx = 0, my = 0;
    const walk = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => {
        const p = n.parentElement;
        if (!p || /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(p.tagName) || p.closest('.hang-back')) return NodeFilter.FILTER_REJECT;
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

  function paintTilt() {
    root.style.setProperty('--tilt', (theta / DEG).toFixed(4) + 'deg');
    // the shadow slides the way the bottom swings
    root.style.setProperty('--lean', (-Math.sin(theta) * Math.min(H, innerHeight) * 0.06).toFixed(2) + 'px');
  }
  // leaning on a wall, nothing swings. it goes where its words put it
  function go() { theta = rest; paintTilt(); }

  // there used to be air here (session 105). nothing hangs in it now.

  // the road (session 108) stopped. what comes through the floor now is
  // the song next door (session 109): four on the floor at the rink's
  // tempo, off the same clock everyone's on, a little thump and gone.
  if (!still) {
    const beat = 60000 / 126;
    const thump = () => {
      const u = (Date.now() % beat) / beat;
      root.style.setProperty('--road', (-1.4 * Math.exp(-u * 7) * Math.cos(u * 18)).toFixed(2) + 'px');
      requestAnimationFrame(thump);
    };
    requestAnimationFrame(thump);
  }

  // the ball's dots come round the wall too
  const dots = document.createElement('div');
  dots.className = 'hang-dots';
  dots.setAttribute('aria-hidden', 'true');
  root.append(dots);

  function settle() { weigh(); go(); }

  weigh();
  go();
  addEventListener('load', settle);
  let t;
  addEventListener('resize', () => { clearTimeout(t); t = setTimeout(settle, 200); });
  if (document.fonts) document.fonts.ready.then(settle);
})();
