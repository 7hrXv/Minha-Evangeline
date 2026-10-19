(()=>{'use strict';const overlay=document.getElementById('surpresaOverlay');if(!overlay)return;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const discover=document.getElementById('descobrirSurpresa');
const skip=document.getElementById('pularSurpresa');
const layer=overlay.querySelector('.surpresa-vagalumes');
let closeTimer=null;
let closed=false;
function showIntro(){
  if(closeTimer!==null){clearTimeout(closeTimer);closeTimer=null;}
  closed=false;
  overlay.classList.remove('saindo');
  overlay.hidden=false;
  overlay.setAttribute('aria-hidden','false');
  // Reiniciar a sequência dos textos e do botão inclusive ao voltar pelo histórico.
  overlay.classList.remove('intro-reiniciando');
  void overlay.offsetWidth;
  overlay.classList.add('intro-reiniciando');
  if(!reduced){
    layer.replaceChildren();
    for(let i=0;i<24;i++){
      const el=document.createElement('span');
      el.style.cssText=`--x:${(i*43+13)%100}%;--y:${(i*31+7)%100}%;--size:${2+i%3}px;--dur:${3+i%6}s;--delay:${-i*.7}s`;
      layer.appendChild(el);
    }
  }
  // Evita que a rolagem da página fique presa ao sair da introdução.
  document.body.classList.remove('surpresa-scroll-bloqueado');
  skip.focus({preventScroll:true});
}
function close(){
  if(closed||overlay.hidden)return;
  closed=true;
  if(!reduced){for(let i=0;i<25;i++)spark(innerWidth/2,innerHeight/2,i,25);}
  overlay.classList.add('saindo');
  const finish=()=>{
    overlay.hidden=true;
    overlay.setAttribute('aria-hidden','true');
    overlay.classList.remove('intro-reiniciando');
    closeTimer=null;
    document.body.classList.remove('surpresa-scroll-bloqueado');
    discover.blur();skip.blur();
  };
  if(reduced)finish();
  else closeTimer=setTimeout(finish,900);
}
discover.addEventListener('click',close);
skip.addEventListener('click',close);
document.addEventListener('keydown',e=>{if(!overlay.hidden&&e.key==='Escape')close()});
// pageshow também dispara quando a página é restaurada do bfcache pelo botão Voltar.
window.addEventListener('pageshow',showIntro);
// O script pode executar antes do primeiro pageshow; a introdução deve ser visível já.
showIntro();
function spark(x,y,i,n){if(reduced)return;const el=document.createElement('span');el.className='roleta-brilho';el.textContent=i%4===0?'✦':'✧';const a=i*2*Math.PI/n,r=45+i%5*24;el.style.cssText=`--x:${x}px;--y:${y}px;--dx:${Math.cos(a)*r}px;--dy:${Math.sin(a)*r}px;--color:${i%4===0?'#f1dcab':'#e2f6ff'};--size:${10+i%4*3}px`;document.body.appendChild(el);setTimeout(()=>el.remove(),1200)}window.roletaCelebrar=()=>{const r=document.getElementById('resultadoRoleta');r.classList.remove('vencedor');void r.offsetWidth;r.classList.add('vencedor');const b=r.getBoundingClientRect();for(let i=0;i<20;i++)spark(b.left+b.width/2,b.top+b.height/2,i,20)};})();