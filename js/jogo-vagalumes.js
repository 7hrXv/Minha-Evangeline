(()=>{'use strict';
const J=window.EvangelineJogos,arena=document.getElementById('ffArena'),star=document.getElementById('ffStar'),meter=document.getElementById('ffMeter'),pct=document.getElementById('ffPct'),timeEl=document.getElementById('ffTime'),scoreEl=document.getElementById('ffScore'),overlay=document.getElementById('ffOverlay'),msg=document.getElementById('ffMsg'),start=document.getElementById('ffStart'),status=document.getElementById('ffStatus');
const DURACAO=20000,META=18,ATIVOS=()=>matchMedia('(max-width:700px)').matches?3:4;
let score=0,restante=DURACAO,ultimo=0,tick=0,jogando=false,pausado=false,uid=0;
function luz(){const g=Math.min(1,score/META);star.style.setProperty('--glow',g.toFixed(3));star.classList.toggle('is-full',g>=1);meter.style.width=(g*100)+'%';pct.textContent=Math.round(g*100)+'%'}
function rand(a,b){return a+Math.random()*(b-a)}
function criar(){
 if(!jogando)return;
 const b=document.createElement('button');b.type='button';b.className='ff-bug';b.setAttribute('aria-label','Vaga-lume');
 const ouro=Math.random()<.14;if(ouro){b.classList.add('is-gold');b.dataset.v='3';b.setAttribute('aria-label','Vaga-lume dourado, vale 3')}else b.dataset.v='1';
 b.innerHTML='<img src="assets/images/vagalume-carta.svg" alt="">';
 const w=arena.clientWidth,h=arena.clientHeight,m=44;
 b.style.left=rand(m,w-m)+'px';b.style.top=rand(m,h-m)+'px';
 const vida=ouro?rand(1.3,1.9):rand(1.8,3);b.style.setProperty('--dur',vida+'s');
 b.style.setProperty('--dx',rand(-60,60)+'px');b.style.setProperty('--dy',rand(-50,30)+'px');
 b.dataset.id=++uid;
 b._t=setTimeout(()=>sumir(b),vida*1000);
 arena.appendChild(b);
}
function sumir(b){if(!b.isConnected||b.classList.contains('is-caught'))return;clearTimeout(b._t);b.classList.add('is-gone');setTimeout(()=>{b.remove();criar()},260)}
function pegar(b){
 if(!jogando||pausado||b.classList.contains('is-caught'))return;
 clearTimeout(b._t);b.classList.add('is-caught');
 const v=Number(b.dataset.v)||1;score+=v;scoreEl.textContent=score;luz();
 const p=document.createElement('span');p.className='ff-plus';p.textContent='+'+v;p.style.left=b.style.left;p.style.top=b.style.top;arena.appendChild(p);setTimeout(()=>p.remove(),700);
 setTimeout(()=>{b.remove();criar()},200);
}
arena.addEventListener('pointerdown',e=>{const b=e.target.closest('.ff-bug');if(b){e.preventDefault();pegar(b)}});
arena.addEventListener('click',e=>{const b=e.target.closest('.ff-bug');if(b)pegar(b)}); /* teclado */
function limpar(){clearInterval(tick);arena.querySelectorAll('.ff-bug,.ff-plus').forEach(n=>{clearTimeout(n._t);n.remove()})}
function fim(){
 jogando=false;limpar();timeEl.textContent='0';
 const g=Math.min(100,Math.round(score/META*100));
 msg.textContent=g>=100?'A estrela acendeu inteira! Você pegou '+score+' pontos de luz ✨':'A estrela chegou a '+g+'% da luz ('+score+' pontos). Quer tentar de novo ou seguir em frente?';
 status.textContent=msg.textContent;start.textContent='Jogar de novo ↻';overlay.hidden=false;start.focus({preventScroll:true});
}
function passo(){
 if(pausado)return;const agora=performance.now();restante-=agora-ultimo;ultimo=agora;
 if(restante<=0){fim();return}timeEl.textContent=Math.ceil(restante/1000);
}
function comecar(){
 limpar();score=0;scoreEl.textContent='0';luz();restante=DURACAO;pausado=false;jogando=true;overlay.hidden=true;timeEl.textContent='20';status.textContent='Vale! Toque nos vaga-lumes.';
 ultimo=performance.now();tick=setInterval(passo,100);
 const n=ATIVOS();for(let i=0;i<n;i++)setTimeout(criar,i*260);
}
start.addEventListener('click',comecar);
document.addEventListener('visibilitychange',()=>{if(!jogando)return;if(document.hidden){pausado=true}else{ultimo=performance.now();pausado=false}});
luz();
})();
