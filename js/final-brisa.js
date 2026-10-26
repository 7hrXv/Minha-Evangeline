(()=>{'use strict';
const stage=document.querySelector('.tree-stage'),layer=document.querySelector('.final-petals');
if(!stage||!layer||typeof Element.prototype.animate!=='function')return;
const motion=matchMedia('(prefers-reduced-motion:reduce)'),small=matchMedia('(max-width:760px)');
const sources=[...stage.querySelectorAll('.flower-origin')].map(e=>({x:Number(e.dataset.x)/520,y:Number(e.dataset.y)/590}));
if(!sources.length)return;
layer.replaceChildren();const pool=Array.from({length:12},(_,i)=>{const el=document.createElement('span');el.className='wind-petal'+(i%5===0?' wind-blossom':'');layer.appendChild(el);return{el,animation:null};});
let baseTimer,gustTimer,endTimer,enabled=false,inView=true,direction=1;
const random=(a,b)=>a+Math.random()*(b-a);
function emit(count,gust=false){
 if(!enabled||document.hidden||motion.matches)return;
 const w=stage.clientWidth,h=stage.clientHeight,limit=small.matches?6:12;
 let free=pool.slice(0,limit).filter(p=>!p.animation);
 for(let i=0;i<count&&free.length;i++){
  const slot=free.shift(),source=sources[Math.floor(Math.random()*sources.length)];
  const x=source.x*w,y=source.y*h;
  const drift=Math.max(8-x,Math.min(w-8-x,direction*random(gust?32:12,gust?85:35)));
  const fall=h-y+16,rotation=random(-45,45),spin=rotation+random(60,170)*direction;
  slot.el.style.left=(source.x*100)+'%';slot.el.style.top=(source.y*100)+'%';
  slot.el.style.width=random(4,7)+'px';slot.el.style.height=random(7,11)+'px';
  const animation=slot.el.animate([
   {opacity:0,transform:`translate(0,0) rotate(${rotation}deg)`,offset:0},
   {opacity:.7,transform:`translate(${drift*.2}px,${fall*.08}px) rotate(${rotation+15}deg)`,offset:.12},
   {opacity:.55,transform:`translate(${drift*.7}px,${fall*.6}px) rotate(${spin*.7}deg)`,offset:.68},
   {opacity:0,transform:`translate(${drift}px,${fall}px) rotate(${spin}deg)`,offset:1}
  ],{duration:random(gust?5600:7000,11000),easing:'linear',fill:'none'});
  slot.animation=animation;
  const release=()=>{if(slot.animation===animation)slot.animation=null;};
  animation.onfinish=release;animation.oncancel=release;
 }
}
function scheduleBase(){baseTimer=setTimeout(()=>{emit(1);if(enabled)scheduleBase();},random(2600,4800));}
function scheduleGust(){gustTimer=setTimeout(()=>{
 if(!enabled)return;direction=Math.random()<.5?-1:1;
 stage.style.setProperty('--wind-angle',(direction*.65)+'deg');
 stage.classList.add('breezy');emit(small.matches?2:4,true);
 endTimer=setTimeout(()=>{stage.classList.remove('breezy');emit(small.matches?1:2,true);},3900);
 scheduleGust();
 },random(8500,15500));}
function stop(){enabled=false;clearTimeout(baseTimer);clearTimeout(gustTimer);clearTimeout(endTimer);stage.classList.remove('breezy');pool.forEach(p=>{if(p.animation){p.animation.cancel();p.animation=null;}});}
function sync(){const ready=document.body.classList.contains('finished')&&!document.hidden&&!motion.matches&&inView;if(!ready){stop();return;}if(enabled)return;enabled=true;emit(small.matches?1:2);scheduleBase();scheduleGust();}
if('IntersectionObserver' in window)new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;sync()},{threshold:.05}).observe(stage);
new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});
document.addEventListener('visibilitychange',sync);motion.addEventListener('change',sync);
small.addEventListener('change',()=>{stop();sync();});window.addEventListener('pagehide',stop);window.addEventListener('pageshow',sync);sync();
})();
