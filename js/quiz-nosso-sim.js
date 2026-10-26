(()=>{'use strict';
const yes=document.getElementById('loveYes'),no=document.getElementById('loveNo'),replay=document.getElementById('loveReplay'),prompt=document.getElementById('lovePrompt'),scene=document.getElementById('loveCelebration'),bear=document.getElementById('loveBear'),still=document.getElementById('bearStill'),answer=document.getElementById('loveAnswer'),layer=document.getElementById('loveFloating'),main=document.querySelector('.lovers-main');
if(!yes||!no||!replay)return;
const reduced=matchMedia('(prefers-reduced-motion:reduce)'),small=matchMedia('(max-width:700px)');let accepted=false;let cleanup;
const labels=['meu lar','nós dois','para sempre','meu amor','✦','❀','minha estrela','♡'];
const particles=labels.map((text,i)=>{const el=document.createElement('span');el.textContent=text;el.style.setProperty('--x',(i%2?82:3)+'%');el.style.setProperty('--size',(i<4?14:18)+'px');el.style.setProperty('--duration',(5+i%3)+'s');el.style.setProperty('--delay',(i*.22)+'s');layer.appendChild(el);return el;});
function image(celebrate){still.srcset=celebrate?'assets/ursos/ursos-beijo.webp':'assets/ursos/urso-rosas.webp';bear.src=reduced.matches||document.hidden?still.srcset:(celebrate?'assets/ursos/ursos-beijo.gif':'assets/ursos/urso-rosas.gif');bear.alt=celebrate?'Dois ursinhos se abraçando e se beijando':'Ursinho apaixonado chegando com rosas';}
function clear(){clearTimeout(cleanup);main.classList.remove('is-celebrating');layer.hidden=true;}
function accept(){if(accepted)return;accepted=true;yes.disabled=true;clear();image(true);prompt.hidden=true;scene.hidden=false;main.classList.add('is-celebrating');if(!reduced.matches){layer.hidden=false;particles.forEach((e,i)=>e.hidden=small.matches&&i>=4);cleanup=setTimeout(()=>{layer.hidden=true;},9500);}document.getElementById('loveSuccessTitle').focus({preventScroll:true});}
yes.addEventListener('click',accept);
no.addEventListener('click',()=>{answer.textContent='Tudo no seu tempo, minha princesa. Meu carinho continua aqui, sem pressa.';});
replay.addEventListener('click',()=>{clear();accepted=false;yes.disabled=false;image(false);scene.hidden=true;prompt.hidden=false;answer.textContent='';yes.focus({preventScroll:true});});
function sync(){document.body.classList.toggle('effects-paused',document.hidden);image(accepted);if(reduced.matches){layer.hidden=true;clear();}}
document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);bear.addEventListener('error',()=>{bear.hidden=true;document.querySelector('.bear-caption').textContent=accepted?'Um abraço cheio de amor, para Mirella.':'Um buquê de carinho, para Mirella.';});bear.addEventListener('load',()=>bear.hidden=false);layer.hidden=true;image(false);
})();
