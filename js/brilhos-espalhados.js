(()=>{
'use strict';
function init(){
 if(document.querySelector('.ev-glitter-layer'))return;
 const layer=document.createElement('div');layer.className='ev-glitter-layer';layer.setAttribute('aria-hidden','true');
 const total=window.matchMedia('(max-width:700px)').matches?10:24;
 for(let i=0;i<total;i++){
  const p=document.createElement('span');p.className='ev-glitter'+(i%4===0?' tiny':'');
  // Quasi-random distribution avoids clustering and remains consistent between reloads.
  const x=((i*61.8033989+13.4)%100),y=((i*37.719+8.1)%100);
  p.style.setProperty('--x',x.toFixed(2)+'%');
  p.style.setProperty('--y',y.toFixed(2)+'%');
  p.style.setProperty('--s',(i%4===0?2+i%3:5+i%8)+'px');
  p.style.setProperty('--t',(2.3+(i%11)*.38).toFixed(2)+'s');
  p.style.setProperty('--d',(-i*.31).toFixed(2)+'s');
  layer.appendChild(p);
 }
 document.body.appendChild(layer);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();