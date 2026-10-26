(()=>{'use strict';
const revive=document.getElementById('reviveStory');
revive?.addEventListener('click',()=>{try{sessionStorage.removeItem('evangeline-session-unlocked');sessionStorage.removeItem('evangeline-arrival-fade');}catch(e){}});
const start=Date.parse(window.EvangelineSite?.relationshipStart||'2025-10-21T00:00:00-03:00');
const fields=['loveDays','loveHours','loveMinutes','loveSeconds'].map(id=>document.getElementById(id));
function update(){const total=Math.max(0,Math.floor((Date.now()-start)/1000));const values=[Math.floor(total/86400),Math.floor(total/3600)%24,Math.floor(total/60)%60,total%60];fields.forEach((el,i)=>{if(el)el.textContent=i===0?String(values[i]):String(values[i]).padStart(2,'0');});}
update();let clock=setInterval(update,1000);document.addEventListener('visibilitychange',()=>{document.body.classList.toggle('paused',document.hidden);clearInterval(clock);if(!document.hidden){update();clock=setInterval(update,1000);}});
const body=document.body,button=document.getElementById('growLove'),skip=document.getElementById('skipAnimation'),status=document.getElementById('finalStatus');
if(!button)return;let started=false,complete=false;const timers=[];
const reveal=()=>{document.getElementById('declaration').inert=false;body.classList.add('revealed');if(status)status.textContent='Nossa árvore floresceu. A declaração e o tempo da nossa história estão disponíveis.';};
const finish=(focus=false)=>{if(complete)return;complete=true;timers.forEach(clearTimeout);body.classList.add('growing','finished');reveal();if(skip)skip.hidden=true;if(focus)document.getElementById('declaration')?.focus({preventScroll:true});};
const motion=matchMedia('(prefers-reduced-motion:reduce)');
try{
 button.addEventListener('click',()=>{if(started)return;started=true;button.disabled=true;if(motion.matches){finish();return;}body.classList.add('growing');timers.push(setTimeout(reveal,5150),setTimeout(()=>finish(),6300),setTimeout(()=>finish(),7500));});
 skip?.addEventListener('click',()=>finish(true));
 motion.addEventListener?.('change',()=>{if(motion.matches&&started)finish();});
 body.classList.add('ready');document.getElementById('declaration').inert=true;
}catch(e){body.classList.remove('ready');finish();}
})();
