(()=>{
'use strict';
const effects={
 'mural.html':{name:'Pétalas caindo',kind:'fall',symbols:['❀','✿','❁'],colors:['#ffd0e2','#ffe8f2','#f6c1db'],count:12},
 'quiz.html':{name:'Estrelas piscando',kind:'twinkle',symbols:['✦','✧','★'],colors:['#fff2aa','#bcecff','#fff9de'],count:12},
 'bau.html':{name:'Estrelas do mural de carinho',kind:'orbit',symbols:['✧','✦','·'],colors:['#ffe6a1','#ffd37c','#fff4cb'],count:12},
 'contador.html':{name:'Corações pulsantes',kind:'pulse',symbols:['♥','♡'],colors:['#ffb6d6','#ffd7e9','#ffc7c7'],count:12},
 'historia.html':{name:'Vaga-lumes do Ray',kind:'firefly',symbols:['✦','•','✧'],colors:['#ffe998','#fff6c1','#c9f5b0'],count:12},
 'cartas.html':{name:'Cartinhas flutuantes',kind:'sway',symbols:['✉','♡','✉'],colors:['#fff0d3','#ffd8e6','#fff5ea'],count:12},
 'memorias.html':{name:'Bolhas de lembranças',kind:'bubble',symbols:['○','◌','♡'],colors:['#bdefff','#e0f8ff','#e3d8ff'],count:12},
 'retrospectiva.html':{name:'Estrelas cadentes',kind:'shoot',symbols:['✦','✧','✶'],colors:['#f5e8b6','#cbeaff','#fff5dd'],count:12}
};
function start(){
 if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 if(document.querySelector('.ev-magic-layer'))return;
 if(document.querySelector('.mural-magic-layer,.contador-particles'))return;
 const page=decodeURIComponent(location.pathname.split('/').pop()||'retrospectiva.html').toLowerCase();
 const config=effects[page]||effects['retrospectiva.html'];
 const layer=document.createElement('div');layer.className='ev-magic-layer';layer.setAttribute('aria-hidden','true');
 document.body.appendChild(layer);
 const limit=window.matchMedia('(max-width:700px)').matches?6:config.count;
 for(let i=0;i<limit;i++){
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

 // Click burst removed to avoid transient DOM allocations.

}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();