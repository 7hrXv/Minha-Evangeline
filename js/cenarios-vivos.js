(()=>{'use strict';
 const body=document.body;if(!body.classList.contains('chapter'))return;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)'),mobile=matchMedia('(max-width:700px)').matches;
 const chapter=Number((body.className.match(/chapter-(\d)/)||[])[1]||0);
 let seed=2110+chapter*117;const random=()=>{seed=seed*16807%2147483647;return(seed-1)/2147483646};
 const layer=document.createElement('div');layer.className='living-atmosphere';layer.setAttribute('aria-hidden','true');
 const anchors=[],types=reduced.matches?Array(8).fill('star'):[...Array(mobile?8:16).fill('star'),...Array(mobile?4:7).fill('firefly'),...Array(mobile?4:10).fill('petal'),...Array(mobile?2:5).fill('flower'),...Array(mobile?2:6).fill('gust')];
 types.forEach((type,i)=>{
  const anchor=document.createElement('span'),particle=document.createElement('i');const kind=type==='gust'?'petal':type;
  anchor.className='atmosphere-anchor'+(type==='gust'?' gust-only':'')+(reduced.matches?' static-star':'');
  particle.className='atmosphere-particle atmosphere-'+kind+(kind==='petal'&&i%3===0?' rising':'')+(kind==='petal'&&i%4===0?' rose':'');
  const col=(i*7+chapter)%11,row=(i*3+Math.floor(i/11)+chapter)%7;
  const item={anchor,x:(col+.25+random()*.5)/11,y:(row+.25+random()*.5)/7,margin:kind==='petal'?18:8};
  anchor.style.setProperty('--duration',(kind==='petal'?12+random()*13:5+random()*10)+'s');anchor.style.setProperty('--delay',(-random()*25)+'s');anchor.style.setProperty('--wind',((i%2?-1:1)*(15+random()*40))+'px');anchor.style.setProperty('--size',(kind==='flower'?16+random()*7:kind==='petal'?5+random()*4:5+random()*5)+'px');
  anchor.appendChild(particle);layer.appendChild(anchor);anchors.push(item);
 });
 body.prepend(layer);
 const protectedSelector='.chapter-header,.chapter-footer,.polaroid-card,.chapter-heading,.welcome-copy,.entry-panel,.couple-quiz,.couple-skip-confirm,.lovers-story,.notes-editor,.note-card,.letter-paper,.music-room,.lyric-reader,.final-declaration,.chapter-navigation,.heart-board,.heart-tray';
 let scheduled=0,gustTimer=0,disposed=false,gusting=false;
 function position(){scheduled=0;if(disposed||document.hidden)return;const width=window.innerWidth||document.documentElement.clientWidth||360,height=window.innerHeight||document.documentElement.clientHeight||760;
  const rects=[...document.querySelectorAll(protectedSelector)].filter(el=>!el.hidden).map(el=>el.getBoundingClientRect()).filter(r=>r.width>0&&r.height>0&&r.bottom>0&&r.top<height);
  anchors.forEach(item=>{const x=item.x*width,y=item.y*height;item.anchor.style.setProperty('--x',x+'px');item.anchor.style.setProperty('--y',y+'px');const obstructed=rects.some(r=>x>r.left-item.margin&&x<r.right+item.margin&&y>r.top-item.margin&&y<r.bottom+item.margin);item.anchor.classList.toggle('is-obstructed',obstructed);});
 }
 function schedule(){if(!disposed&&!scheduled)scheduled=setTimeout(position,120);}
 function planGust(){clearTimeout(gustTimer);if(disposed||document.hidden||reduced.matches){body.classList.remove('wind-gust');gusting=false;return;}gustTimer=setTimeout(()=>{gusting=!gusting;body.classList.toggle('wind-gust',gusting);planGust();},gusting?2400+random()*1900:8000+random()*9000);}
 const lyric=document.getElementById('lyricStage');function updateScene(){body.classList.toggle('music-scenario',!!lyric&&!lyric.hidden);schedule();}
 const changes='MutationObserver'in window?new MutationObserver(updateScene):null;changes?.observe(body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
 const visibility=()=>{layer.classList.toggle('paused',document.hidden||reduced.matches);if(document.hidden){clearTimeout(scheduled);scheduled=0;}else schedule();planGust();};
 document.addEventListener('visibilitychange',visibility);window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});reduced.addEventListener('change',visibility);
 const offscreen='IntersectionObserver'in window?new IntersectionObserver(entries=>{for(const entry of entries)entry.target.classList.toggle('out-of-view',!entry.isIntersecting)},{rootMargin:'40px'}):null;
 document.querySelectorAll('.character-vignette,.pressed-decoration,.vintage-object').forEach(el=>offscreen?.observe(el));
 updateScene();position();visibility();
 window.addEventListener('pagehide',()=>{disposed=true;clearTimeout(scheduled);clearTimeout(gustTimer);changes?.disconnect();offscreen?.disconnect();document.removeEventListener('visibilitychange',visibility);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);reduced.removeEventListener?.('change',visibility);},{once:true});
})();
