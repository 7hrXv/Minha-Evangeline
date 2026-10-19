(()=>{'use strict';let overlay=null;let lastFocus=null;
function open(){if(overlay)overlay.remove();lastFocus=document.activeElement;overlay=document.createElement('div');overlay.className='romantic-intro';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Introdução ao quiz romântico');
overlay.innerHTML='<div class="romantic-intro-inner"><div class="intro-emblem" aria-hidden="true">✦ ♡ ✦</div><p class="intro-line">Será que você conhece bem a nossa história?</p><p class="intro-line">Cada acerto preenche um pouquinho do nosso coração.</p><div class="intro-actions"><button class="intro-start" type="button">Começar o quiz</button><button class="intro-skip" type="button">Pular introdução</button></div></div>';
document.body.append(overlay);const buttons=overlay.querySelectorAll('button');
function close(){if(!overlay||overlay.classList.contains('is-closing'))return;const old=overlay;old.classList.add('is-closing');old.setAttribute('aria-hidden','true');const delay=matchMedia('(prefers-reduced-motion: reduce)').matches?0:600;setTimeout(()=>{old.remove();if(overlay===old)overlay=null;},delay);document.getElementById('romanticNext')?.focus({preventScroll:true});}
buttons.forEach(b=>b.addEventListener('click',close));buttons[0].focus({preventScroll:true});}
window.addEventListener('pageshow',open);window.addEventListener('pagehide',()=>{overlay?.remove();overlay=null;});
})();
