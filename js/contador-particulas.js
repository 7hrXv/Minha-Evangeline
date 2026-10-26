(()=>{'use strict';
const old=document.querySelector('.contador-particles');if(old)old.remove();
const layer=document.createElement('div');layer.className='contador-particles';layer.setAttribute('aria-hidden','true');document.body.appendChild(layer);
const mobile=matchMedia('(max-width:640px)').matches;
const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
const count=reduced?(mobile?4:8):(mobile?12:28);
for(let i=0;i<count;i++){
 const el=document.createElement('i');const kind=i%7===0?'petal':i%4===0?'firefly':'star';el.className='contador-particle '+kind;
 const x=Math.random()*100;const y=Math.random()*100;const side=x<27||x>73;
 el.style.setProperty('--x',x+'%');el.style.setProperty('--y',y+'%');
 el.style.setProperty('--size',(kind==='petal'?7+Math.random()*8:kind==='star'?3+Math.random()*8:2+Math.random()*4)+'px');
 el.style.setProperty('--duration',(kind==='petal'?16:kind==='firefly'?9:5)+Math.random()*12+'s');
 el.style.setProperty('--delay',(-Math.random()*24)+'s');
 el.style.setProperty('--sway',(Math.random()*80-40)+'px');
 el.style.setProperty('--alpha',side?'.85':'.3');
 layer.append(el);
}
})();
