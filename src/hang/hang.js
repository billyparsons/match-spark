// the rooms are hung (session 105). struck (107). in transit (108). stood on
// a rink carpet (109). tonight they went out (session 110), so a room is a
// panel left on your porch under the bulb, leaning the way its words weigh
// it, and it's still in the costume it came to the door in. you take that
// off to read it. if you gave them something at the door it's already off.
// if you sent them away with nothing, you can read the room, but they've
// been at your windows: there's egg on the glass and paper in the trees.
(() => {
  const root = document.documentElement;
  const body = document.body;
  if (!root.dataset.hung || !body) return;

  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const paint = root.dataset.paint || '#161412';
  root.style.setProperty('--paint', paint);

  let seen = {};
  try { seen = (JSON.parse(localStorage.getItem('match-spark:door') || '{}').seen) || {}; } catch (e) {}
  const door = window.MATCH_DOOR;
  const kid = door && door.kids.find((k) => k.id === root.dataset.hung);
  const how = seen[root.dataset.hung];

  const hook = document.createElement('a');
  hook.className = 'hang-hook';
  hook.href = '/';
  hook.textContent = 'back inside';
  root.append(hook);

  // ── the costume ──
  if (kid && how !== 'fed') {
    const smock = document.createElement('div');
    smock.className = 'smock';
    smock.setAttribute('role', 'button');
    smock.setAttribute('tabindex', '0');
    smock.setAttribute('aria-label', `${kid.name} is wearing a costume. take it off`);
    smock.style.setProperty('--vinyl', kid.vinyl);
    smock.style.setProperty('--ink', kid.ink);
    smock.innerHTML = `
      <span class="smock-ties" aria-hidden="true"></span>
      <span class="smock-face" aria-hidden="true"><b>${kid.as}</b>
        <svg viewBox="${kid.two ? '0 60 600 780' : '70 60 460 780'}" xmlns="http://www.w3.org/2000/svg">${kid.art()}</svg>
        <em>${kid.name}</em><small>take it off</small></span>`;
    body.prepend(smock);
    const off = () => {
      if (smock.classList.contains('off')) return;
      smock.classList.add('off');
      setTimeout(() => {
        smock.remove();
        settle();
        const first = body.querySelector('a[href], button, input, [tabindex]');
        if (first) first.focus({ preventScroll: true });
      }, still ? 0 : 620);
    };
    smock.addEventListener('click', off);
    smock.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); off(); }
    });
  }

  // ── what they did about it ──
  if (how === 'stiffed') {
    const egg = document.createElement('div');
    egg.className = 'egged';
    egg.setAttribute('aria-hidden', 'true');
    egg.innerHTML = `
      <svg class="yolk a" viewBox="0 0 200 520"><path d="M60 10 q60 -22 92 10 q30 36 -12 66 q-14 12 -14 40 q-2 90 -4 200 q-2 34 -14 34 q-12 0 -12 -30 q0 -70 -2 -140 q-2 -20 -12 -10 q-10 8 -10 30 q0 34 -10 34 q-10 0 -10 -30 q0 -40 -2 -70 q-2 -16 -14 -22 q-40 -18 -20 -70 q6 -28 44 -42Z" fill="#F2B21E" fill-opacity="0.82"/><circle cx="84" cy="50" r="24" fill="#E88A10" fill-opacity="0.72"/><path d="M28 36 l-18 -18 M144 24 l18 -14 M150 62 l22 8" stroke="#F4F1E6" stroke-width="5"/></svg>
      <svg class="yolk b" viewBox="0 0 200 400"><path d="M70 8 q50 -14 74 12 q24 34 -12 54 q-12 8 -14 30 q-2 70 -4 130 q0 22 -10 22 q-10 0 -10 -22 q0 -60 -2 -110 q-2 -14 -14 -20 q-34 -16 -20 -58 q6 -30 12 -38Z" fill="#F2B21E" fill-opacity="0.78"/><circle cx="96" cy="42" r="19" fill="#E88A10" fill-opacity="0.7"/></svg>
      <i class="tp one"></i><i class="tp two"></i><i class="tp three"></i>
      <b>you sent them away with nothing</b>`;
    root.append(egg);
  } else if (how === 'fed') {
    const wrap = document.createElement('div');
    wrap.className = 'wrapper';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.innerHTML = `<svg viewBox="0 0 80 40"><path d="M12 12 L2 4 V36 L12 28 Z M68 12 L78 4 V36 L68 28 Z" fill="#E8341C" stroke="#2A1708" stroke-width="2"/><path d="M12 12 q14 8 28 2 q14 -6 28 -2 V28 q-14 6 -28 0 q-14 -6 -28 0 Z" fill="#C42A15" stroke="#2A1708" stroke-width="2"/></svg><b>it ate it in here</b>`;
    root.append(wrap);
  }

  // it leans the way its words weigh it, same as ever
  const DEG = Math.PI / 180;
  let theta = 0, rest = 0, limit = 2 * DEG, H = 1;
  function weigh() {
    const px = body.offsetLeft + body.offsetWidth / 2 - scrollX, py = body.offsetTop - scrollY;
    const c = Math.cos(-theta), s = Math.sin(-theta);
    let m = 0, mx = 0, my = 0;
    const walk = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => {
        const p = n.parentElement;
        if (!p || /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(p.tagName) || p.closest('.smock')) return NodeFilter.FILTER_REJECT;
        return /[\p{L}\p{N}]/u.test(n.data) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    const range = document.createRange();
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      const k = (n.data.match(/[\p{L}\p{N}'’]+/gu) || []).length;
      range.selectNodeContents(n);
      const r = range.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const dx = r.left + r.width / 2 - px, dy = r.top + r.height / 2 - py;
      mx += k * (dx * c - dy * s);
      my += k * (dx * s + dy * c);
      m += k;
    }
    H = Math.max(body.offsetHeight, 1);
    const gut = Math.max(parseFloat(getComputedStyle(body).marginLeft) || 0, 24);
    limit = Math.min(2.2 * DEG, Math.atan((gut * 1.5) / H));
    const wanted = m ? Math.atan2(mx / m, Math.max(my / m, 1)) : 0;
    rest = Math.max(-limit, Math.min(limit, wanted));
  }
  function settle() {
    weigh();
    theta = rest;
    root.style.setProperty('--tilt', (theta / DEG).toFixed(4) + 'deg');
  }

  settle();
  addEventListener('load', settle);
  let t;
  addEventListener('resize', () => { clearTimeout(t); t = setTimeout(settle, 200); });
  if (document.fonts) document.fonts.ready.then(settle);
})();
