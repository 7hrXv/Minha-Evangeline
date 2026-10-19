(()=>{
'use strict';
let overlay=null, cleanup=null;
function openIntro(){
  if(cleanup)cleanup();
  if(overlay)overlay.remove();
  overlay=document.createElement('section');
  overlay.className='ev-intro ev-counter-intro';
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-label','Introdução ao nosso contador');
  overlay.innerHTML=`<div class="ev-intro-inner"><div class="ev-counter-star" aria-hidden="true">✦</div><p class="ev-line">Cada segundo ao seu lado é especial.</p><p class="ev-line">Desde 21/10/2025, escrevendo a nossa história.</p><div class="ev-intro-actions"><button type="button" class="ev-start">Ver nosso tempo juntos</button><button type="button" class="ev-skip">Pular introdução</button></div></div>`;
  document.body.append(overlay);
  const previousFocus=document.activeElement;
  const buttons=[...overlay.querySelectorAll('button')];
  const close=()=>{
    if(!overlay || overlay.classList.contains('dismissed'))return;
    overlay.classList.add('dismissed');
    overlay.setAttribute('aria-hidden','true');
    const old=overlay;
    const delay=window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:650;
    window.setTimeout(()=>{old.remove();if(overlay===old)overlay=null;},delay);
    if(previousFocus && typeof previousFocus.focus==='function')previousFocus.focus({preventScroll:true});
  };
  buttons.forEach(b=>b.addEventListener('click',close));
  const key=e=>{if(e.key==='Escape')close();if(e.key==='Tab' && overlay && !overlay.classList.contains('dismissed')){const first=buttons[0],last=buttons[buttons.length-1];if(e.shiftKey && document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus();}}};
  document.addEventListener('keydown',key);
  cleanup=()=>document.removeEventListener('keydown',key);
  buttons[0].focus({preventScroll:true});
}
window.addEventListener('pageshow',openIntro);
window.addEventListener('pagehide',()=>{if(cleanup)cleanup();if(overlay){overlay.remove();overlay=null;}});
})();
