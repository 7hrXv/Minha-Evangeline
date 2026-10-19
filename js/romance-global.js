(()=>{
'use strict';
const effects={
 'index.html':{name:'Corações flutuantes',kind:'rise',symbols:['♡','♥','♡'],colors:['#ffd2e7','#f8e3ff','#ffe7f2'],count:23},
 'mural.html':{name:'Pétalas caindo',kind:'fall',symbols:['❀','✿','❁'],colors:['#ffd0e2','#ffe8f2','#f6c1db'],count:24},
 'quiz.html':{name:'Estrelas piscando',kind:'twinkle',symbols:['✦','✧','★'],colors:['#fff2aa','#bcecff','#fff9de'],count:28},
 'bau.html':{name:'Estrelas do mural de carinho',kind:'orbit',symbols:['✧','✦','·'],colors:['#ffe6a1','#ffd37c','#fff4cb'],count:26},
 'contador.html':{name:'Corações pulsantes',kind:'pulse',symbols:['♥','♡'],colors:['#ffb6d6','#ffd7e9','#ffc7c7'],count:22},
 'historia.html':{name:'Vaga-lumes do Ray',kind:'firefly',symbols:['✦','•','✧'],colors:['#ffe998','#fff6c1','#c9f5b0'],count:32},
 'cartas.html':{name:'Cartinhas flutuantes',kind:'sway',symbols:['✉','♡','✉'],colors:['#fff0d3','#ffd8e6','#fff5ea'],count:19},
 'memorias.html':{name:'Bolhas de lembranças',kind:'bubble',symbols:['○','◌','♡'],colors:['#bdefff','#e0f8ff','#e3d8ff'],count:23},
 'retrospectiva.html':{name:'Estrelas cadentes',kind:'shoot',symbols:['✦','✧','✶'],colors:['#f5e8b6','#cbeaff','#fff5dd'],count:21}
};
function start(){
 if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 if(document.querySelector('.ev-magic-layer'))return;
 const page=decodeURIComponent(location.pathname.split('/').pop()||'index.html').toLowerCase();
 const config=effects[page]||effects['index.html'];
 const layer=document.createElement('div');layer.className='ev-magic-layer';layer.setAttribute('aria-hidden','true');
 document.body.appendChild(layer);
 for(let i=0;i<config.count;i++){
  const e=document.createElement('span');e.className='ev-magic-item ev-effect-'+config.kind;
  e.textContent=config.symbols[i%config.symbols.length];
  e.style.setProperty('--left',((i*43+11)%97)+'%');
  e.style.setProperty('--top',config.kind==='rise'||config.kind==='bubble'?'100%':config.kind==='fall' ? '-8%' : ((i*37+7)%89+5)+'%');
  e.style.setProperty('--delay',(-i*1.13)+'s');
  e.style.setProperty('--duration',(config.kind==='shoot'?5+i%5:config.kind==='twinkle'?3+i%4:config.kind==='fall'?11+i%8:config.kind==='rise'||config.kind==='bubble'?12+i%7:5+i%6)+'s');
  e.style.setProperty('--size',(config.kind==='firefly'?10+i%4*3:14+i%5*4)+'px');
  e.style.setProperty('--drift',((i%2?-1:1)*(20+i%5*17))+'px');
  e.style.setProperty('--color',config.colors[i%config.colors.length]);
  layer.appendChild(e);
 }
 document.querySelectorAll('main h1,main h2,main > section,main > article,.home-intro,.home-counter-separate').forEach((e,i)=>{
  e.classList.add('ev-reveal');e.style.animationDelay=Math.min(i*.1,.5)+'s';
 });
 if(page!=='retrospectiva.html'&&page!=='historia.html')document.addEventListener('click',event=>{
  const button=event.target instanceof Element?event.target.closest('button,a'):null;
  if(!button||button.disabled)return;
  for(let i=0;i<7;i++){
   const e=document.createElement('span');e.className='ev-romance-spark';
   e.textContent=config.symbols[i%config.symbols.length];
   e.style.left=event.clientX+'px';e.style.top=event.clientY+'px';
   e.style.setProperty('--spark-color',config.colors[i%config.colors.length]);
   e.style.setProperty('--dx',Math.round(Math.cos(i*2*Math.PI/7)*55)+'px');
   e.style.setProperty('--dy',Math.round(Math.sin(i*2*Math.PI/7)*55)+'px');
   document.body.appendChild(e);setTimeout(()=>e.remove(),1100);
  }
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();