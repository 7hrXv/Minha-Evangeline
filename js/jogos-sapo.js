(()=>{'use strict';const kind=document.body.dataset.exp;if(kind!=='vagalumes')return;
const $=id=>document.getElementById(id),E=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const load=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(_){return d}},save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}};
if(kind==='vagalumes'){const K='evangeline-vagalumes-v1',GOAL=20,DUR=30000,arena=$('flyArena'),star=$('flyStar'),msg=$('flyMsg'),txt=$('flyText'),go=$('flyGo'),sc=$('flyScore'),tm=$('flyTime'),best=$('flyBest');
 let b=+load(K,{best:0}).best||0,score=0,end=0,tick=0,spawn=0,run=false;const show=()=>{best.textContent='Recorde: '+b};show();
 const paint=()=>{sc.textContent='Pontos: '+score;star.style.setProperty('--glow',Math.min(score/GOAL,1))};
 const stop=()=>{run=false;clearInterval(tick);clearInterval(spawn);cancelAnimationFrame(raf);vivos=[];arena.querySelectorAll('.fly').forEach(f=>f.remove());tm.textContent='Tempo: 0s';
  if(score>b){b=score;save(K,{best:b})}show();
  txt.textContent=(score>=GOAL?'Nossa estrela brilhou inteira! ✦ ':'Sua luz já aquece a nossa estrela. ')+'Você pegou '+score+' vaga-lume'+(score===1?'':'s')+'. Um ano de nós, e a luz continua. 💚';go.textContent='Jogar de novo';msg.hidden=false;go.focus({preventScroll:true})};
 const hit=f=>{if(!run||f.classList.contains('pop'))return;score++;paint();f.classList.add('pop');setTimeout(()=>f.remove(),300)};
 /* Cada partida recebe uma agenda própria (posição, trajetória e intervalo de cada vaga-lume), sorteada a partir de uma semente.
    A agenda é fixada ao clicar em "Começar" e só muda na partida seguinte, que nunca repete a anterior. */
 const LK='evangeline-vagalumes-ultima-v1',reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,MAXF=7,PATHS=['fixo','onda','arco','circulo','zigzag'];
 const rng=a=>()=>{a=(a+0x6D2B79F5)|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
 const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
 const pathAt={ /* u de 0 a 1; devolve deslocamento em % da arena */
  fixo:()=>[0,0],
  onda:(u,p)=>[p.dx*u,Math.sin(u*Math.PI*2*p.f+p.ph)*p.amp],
  arco:(u,p)=>[p.dx*u,p.dy*u-Math.sin(u*Math.PI)*p.amp],
  circulo:(u,p)=>[Math.cos(p.ph+u*Math.PI*2*p.dir)*p.r-Math.cos(p.ph)*p.r,Math.sin(p.ph+u*Math.PI*2*p.dir)*p.r*.7-Math.sin(p.ph)*p.r*.7],
  zigzag:(u,p)=>{const k=u*3,i=Math.min(2,Math.floor(k)),f=k-i,x=[0,p.dx*.45,p.dx*.15,p.dx],y=[0,p.dy*.9,-p.dy*.3,p.dy*.2];return[x[i]+(x[i+1]-x[i])*f,y[i]+(y[i+1]-y[i])*f]}};
 function agenda(seed){const r=rng(seed),k=reduce?.35:1,list=[],zonas=[];let t=0;
  const ri=(lo,hi)=>lo+r()*(hi-lo);
  while(t<DUR-900){
   if(!zonas.length){for(let c=0;c<3;c++)for(let l=0;l<2;l++)zonas.push([c,l]);for(let i=zonas.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[zonas[i],zonas[j]]=[zonas[j],zonas[i]]}}
   const[c,l]=zonas.pop(),x=clamp(10+c*27+ri(0,27),10,90),y=clamp(26+l*32+ri(0,32),26,90); /* zonas 3x2 evitam aglomeração */
   const tipo=PATHS[Math.floor(r()*PATHS.length)],dir=r()<.5?-1:1,
    p={dx:ri(14,32)*dir*k,dy:ri(-18,18)*k,amp:ri(5,12)*k,f:ri(1,2),ph:ri(0,6.28),r:ri(7,13)*k,dir};
   list.push({t:Math.round(t),life:Math.round(ri(1900,2600)),x:Math.round(x*10)/10,y:Math.round(y*10)/10,tipo,p});
   t+=ri(420,860)} /* intervalo variável entre aparições (média ~640 ms, próxima do ritmo original de 600 ms) */
  return list}
 const sigAg=l=>l.slice(0,10).map(f=>f.tipo+Math.round(f.x/6)+Math.round(f.y/6)+'@'+Math.round(f.t/50)).join('|');
 let ult=load(LK,{seed:0,sig:''}),ag=[],ai=0,t0=0,vivos=[];
 function novaAgenda(){let seed,l,sg;
  for(let n=0;n<20;n++){seed=((Math.random()*4294967296)^Date.now()^Math.imul(n+1,0x9E3779B1))>>>0;l=agenda(seed);sg=sigAg(l);if(seed!==ult.seed&&sg!==ult.sig)break}
  if(seed===ult.seed||sg===ult.sig){seed=(ult.seed+0x9E3779B1)>>>0;l=agenda(seed);sg=sigAg(l)}
  ult={seed,sig:sg};save(LK,ult);return l}
 const spawn1=d=>{const f=E('button','fly');f.type='button';f.setAttribute('aria-label','Pegar vaga-lume');f.style.left=d.x+'%';f.style.top=d.y+'%';
  f.addEventListener('pointerdown',e=>{e.preventDefault();hit(f)});f.addEventListener('click',e=>{if(e.detail===0)hit(f)});arena.append(f);vivos.push({el:f,d,born:Date.now()})};
 function passo(){if(!run)return;const now=Date.now(),el=now-t0;
  while(ai<ag.length&&ag[ai].t<=el){if(vivos.length<MAXF)spawn1(ag[ai]);ai++}
  vivos=vivos.filter(v=>{const age=now-v.born;if(v.el.classList.contains('pop')||!v.el.isConnected)return false;
   if(age>=v.d.life){v.el.remove();return false}
   const[ox,oy]=pathAt[v.d.tipo](age/v.d.life,v.d.p);v.el.style.left=clamp(v.d.x+ox,6,94)+'%';v.el.style.top=clamp(v.d.y+oy,24,92)+'%';return true})}
 let raf=0;const quadro=()=>{passo();raf=run?requestAnimationFrame(quadro):0};
 go.addEventListener('click',()=>{score=0;paint();msg.hidden=true;ag=novaAgenda();ai=0;vivos=[];run=true;t0=Date.now();end=t0+DUR;tm.textContent='Tempo: 30s';clearInterval(tick);clearInterval(spawn);cancelAnimationFrame(raf);
  tick=setInterval(()=>{const l=Math.max(0,Math.ceil((end-Date.now())/1000));tm.textContent='Tempo: '+l+'s';passo();if(Date.now()>=end)stop()},100);passo();raf=requestAnimationFrame(quadro)});
 addEventListener('pagehide',()=>{clearInterval(tick);clearInterval(spawn);cancelAnimationFrame(raf)});paint()}
})();
