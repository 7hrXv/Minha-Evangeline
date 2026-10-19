// Animações leves e decorativas; não interferem na roleta.
(() => {
 const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if (reduced) return;
 const sky=document.getElementById('romanceSky');
 const symbols=['✧','✦','✧','✦'];
 for(let i=0;i<20;i++){
  const p=document.createElement('span');p.className='romance-particle';p.textContent=symbols[i%4];
  p.style.setProperty('--x',`${(i*47.3)%100}%`);
  p.style.setProperty('--size',`${10+(i%5)*4}px`);
  p.style.setProperty('--duration',`${12+(i%7)*2}s`);
  p.style.setProperty('--delay',`${-i*1.4}s`);
  p.style.setProperty('--drift',`${(i%2?-1:1)*(25+i*7)}px`);
  p.style.setProperty('--color',i%3===0?'#ffe4a0':'#b9eaff');sky.appendChild(p);
 }
 const result=document.getElementById('resultadoRoleta');
 const title=document.getElementById('resultadoTitulo');
 const observer=new MutationObserver(()=>{
  if(title.textContent==='O destino escolhe ♡')return;
  result.classList.remove('romance-reveal');void result.offsetWidth;result.classList.add('romance-reveal');
  const burst=document.createElement('div');burst.className='romance-burst';burst.setAttribute('aria-hidden','true');
  for(let i=0;i<22;i++){
   const s=document.createElement('span');s.textContent=i%3?'✧':'✦';
   const a=i*Math.PI*2/22;const r=110+(i%4)*35;
   s.style.setProperty('--dx',`${Math.cos(a)*r}px`);s.style.setProperty('--dy',`${Math.sin(a)*r}px`);
   s.style.setProperty('--size',`${14+(i%4)*5}px`);s.style.setProperty('--color',i%3?'#bdeaff':'#ffe4a0');burst.appendChild(s);
  }
  document.body.appendChild(burst);setTimeout(()=>burst.remove(),1900);
 });observer.observe(title,{childList:true});
})();
