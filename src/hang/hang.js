// the rooms are hung (session 105). struck (107). in transit (108). stood on
// a rink carpet (109). out on your porch in costumes (110). photocopied (111).
// tonight (session 112) a room is just a room, straight, in its own colours,
// with a border somebody else chose. if you sent them away with nothing on
// halloween, the egg is still on it.
(() => {
  const root = document.documentElement;
  const body = document.body;
  if (!root.dataset.hung || !body) return;


  let seen = {};
  try { seen = (JSON.parse(localStorage.getItem('match-spark:door') || '{}').seen) || {}; } catch (e) {}
  const how = seen[root.dataset.hung];

  const hook = document.createElement('a');
  hook.className = 'hang-hook';
  hook.href = '/';
  hook.textContent = 'back to the colour';
  root.append(hook);

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

  // the frame is whatever colour the last person left the site
  const n = root.dataset.coat === '' ? null : Number(root.dataset.coat);
  coat.paint(n);
  coat.read().then((r) => { if (r.ok && r.n !== n) coat.paint(r.n); });
})();
