/* Estrelas, pétalas e vaga-lumes; instância única por carregamento. */
(() => {
  'use strict';
  const root = document.querySelector('body.mural-carinho-page .mural-magic-layer');
  if (!root || root.dataset.initialized === 'true') return;
  root.dataset.initialized = 'true';
  const mobile = window.matchMedia('(max-width: 700px)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const counts = reduced ? { star: 8, petal: 0, firefly: 0 } : mobile ? { star: 10, petal: 4, firefly: 3 } : { star: 24, petal: 9, firefly: 7 };
  // Gerador determinístico: não acumula nem reposiciona aleatoriamente ao rolar.
  let seed = 13245;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const choose = arr => arr[Math.floor(rnd() * arr.length)];
  const frag = document.createDocumentFragment();
  for (const [type, count] of Object.entries(counts)) {
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = `magic-particle magic-${type}`;
      p.setAttribute('aria-hidden', 'true');
      const side = rnd();
      // Concentração nas laterais; alguns brilhos dispersos ao centro.
      const x = side < .43 ? rnd() * 25 : side < .86 ? 75 + rnd() * 25 : 25 + rnd() * 50;
      const y = rnd() * 100;
      const size = type === 'star' ? 3 + rnd() * 8 : type === 'petal' ? 6 + rnd() * 8 : 2 + rnd() * 3;
      const duration = type === 'petal' ? 17 + rnd() * 18 : type === 'firefly' ? 6 + rnd() * 10 : 3.5 + rnd() * 6;
      const alpha = type === 'petal' ? .28 + rnd() * .28 : type === 'firefly' ? .22 + rnd() * .42 : .22 + rnd() * .58;
      p.style.setProperty('--x', `${x.toFixed(2)}%`);
      p.style.setProperty('--y', `${y.toFixed(2)}%`);
      p.style.setProperty('--size', `${size.toFixed(2)}px`);
      p.style.setProperty('--dur', `${duration.toFixed(2)}s`);
      p.style.setProperty('--delay', `${(-rnd() * duration).toFixed(2)}s`);
      p.style.setProperty('--alpha', alpha.toFixed(2));
      p.style.setProperty('--drift', `${((rnd()-.5) * (type === 'petal' ? 180 : 55)).toFixed(0)}px`);
      p.style.setProperty('--spin', `${(rnd()-.5)*540}deg`);
      p.style.setProperty('--tone', type === 'petal' ? choose(['#f5f9eb','#e0eed9','#f5f1dc']) : choose(['#fffef3','#f3d58b','#ffffff']));
      p.style.setProperty('--glow', '#f6e1a0');
      frag.appendChild(p);
    }
  }
  root.replaceChildren(frag);
})();
