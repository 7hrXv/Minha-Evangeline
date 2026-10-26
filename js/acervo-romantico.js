(()=>{'use strict';
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');const cleanups=[];
 // Native details remain usable if JS is unavailable. Closing gently returns the paper.
 document.querySelectorAll('.small-letters details').forEach(details=>{
  const summary=details.querySelector('summary');let timer=0;
  const click=event=>{if(!details.open||reduced.matches)return;event.preventDefault();if(timer)return;details.classList.add('is-closing');timer=setTimeout(()=>{details.open=false;details.classList.remove('is-closing');timer=0;},260);};
  summary.addEventListener('click',click);cleanups.push(()=>{clearTimeout(timer);summary.removeEventListener('click',click);});
 });
 // Real masonry: every position and the section height derive from measured cards.
 // This removes the trailing space from uneven CSS newspaper columns.
 const album=document.querySelector('.album-grid');
 if(album&&'ResizeObserver' in window){
  const cards=[...album.querySelectorAll('.album-photo')];let frame=0,lastWidth=-1,disposed=false;
  const layout=()=>{frame=0;const width=album.clientWidth;if(width<1)return;const preferred=parseInt(getComputedStyle(album).getPropertyValue('--album-columns'),10);const columns=Math.min(Number.isFinite(preferred)?preferred:(width<560?1:width<900?2:3),Math.max(1,Math.floor(width/280))),gap=columns===1?30:28,pad=10,cardWidth=(width-2*pad-gap*(columns-1))/columns;
   album.classList.add('masonry-ready');cards.forEach(card=>card.style.setProperty('--photo-width',cardWidth+'px'));
   const heights=Array(columns).fill(12);
   cards.forEach(card=>{const column=heights.indexOf(Math.min(...heights));card.style.setProperty('--photo-x',pad+column*(cardWidth+gap)+'px');card.style.setProperty('--photo-y',heights[column]+'px');heights[column]+=card.offsetHeight+gap;});
   const height=Math.max(...heights)-gap+12;album.style.height=height+'px';lastWidth=width;
  };
  const schedule=()=>{if(!disposed&&!frame)frame=requestAnimationFrame(layout)};
  const observer=new ResizeObserver(entries=>{if(entries.some(e=>e.target!==album)||album.clientWidth!==lastWidth)schedule()});observer.observe(album);cards.forEach(c=>observer.observe(c));schedule();
  document.fonts?.ready.then(schedule);cleanups.push(()=>{disposed=true;observer.disconnect();if(frame)cancelAnimationFrame(frame);});
 }
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries)entry.target.classList.toggle('out-of-view',!entry.isIntersecting)});document.querySelectorAll('.film-character').forEach(x=>observer.observe(x));cleanups.push(()=>observer.disconnect())}
 window.addEventListener('pagehide',()=>cleanups.forEach(fn=>fn()),{once:true});
})();
