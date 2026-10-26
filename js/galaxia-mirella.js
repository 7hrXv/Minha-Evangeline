(() => {
'use strict';
const intro=document.getElementById('galaxyIntro'),start=document.getElementById('galaxyStart'),skip=document.getElementById('galaxySkip');
const modal=document.getElementById('galaxyModal'),modalMessage=document.getElementById('galaxyModalMessage'),close=document.getElementById('galaxyClose');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile=window.matchMedia('(max-width: 650px)').matches;
let active=true, raf=0, previousFocus=null;
function dismiss(){if(!intro||intro.classList.contains('is-closing'))return;intro.classList.add('is-closing');intro.setAttribute('aria-hidden','true');window.setTimeout(()=>{intro.hidden=true;},reduced?0:680);document.querySelector('.galaxy-secret')?.focus({preventScroll:true});}
start.addEventListener('click',dismiss);skip.addEventListener('click',dismiss);
window.addEventListener('pageshow',()=>{intro.hidden=false;intro.classList.remove('is-closing');intro.removeAttribute('aria-hidden');start.focus({preventScroll:true});});
function openMessage(button){previousFocus=button;modalMessage.textContent=button.dataset.message||'';modal.hidden=false;close.focus({preventScroll:true});}
function closeMessage(){modal.hidden=true;previousFocus?.focus({preventScroll:true});}
document.querySelectorAll('.galaxy-secret').forEach(b=>b.addEventListener('click',()=>openMessage(b)));
close.addEventListener('click',closeMessage);
modal.addEventListener('click',e=>{if(e.target.dataset.close)closeMessage();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)closeMessage();});
const sky=document.getElementById('galaxyStars'),fragment=document.createDocumentFragment();
let seed=207;function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
const count=mobile?46:105;
for(let i=0;i<count;i++){const dot=document.createElement('span');dot.className='galaxy-star';dot.style.cssText=`--x:${(rand()*100).toFixed(2)}%;--y:${(rand()*100).toFixed(2)}%;--r:${(rand()*2.1+.7).toFixed(1)}px;--a:${(rand()*.55+.3).toFixed(2)};--c:${rand()>.78?'#e8c98d':'#fff7e7'};--t:${(rand()*5+3).toFixed(1)}s;--d:${(-rand()*7).toFixed(1)}s`;fragment.append(dot);}
sky.append(fragment);
const canvas=document.createElement('canvas'),spiral=document.getElementById('galaxySpiral');
spiral.append(canvas);
const ctx=canvas.getContext('2d',{alpha:true});
if(!ctx)return;
const w=850,h=510;canvas.width=w;canvas.height=h;
const stars=[];const total=mobile?340:760;
for(let i=0;i<total;i++){const arm=i%3;const radius=Math.pow(rand(),.72)*240+8;const theta=arm*Math.PI*2/3+radius*.027+(rand()-.5)*.75;stars.push({r:radius,theta,offset:(rand()-.5)*radius*.3,size:rand()*1.35+.35,alpha:rand()*.6+.15,gold:rand()>.77});}
let last=0,rotation=0;
function frame(now){if(!active||document.hidden)return;const delta=last?Math.min(50,now-last):16;last=now;if(!reduced)rotation+=delta*.000015;ctx.clearRect(0,0,w,h);ctx.save();ctx.translate(w/2,h/2);ctx.scale(1,.57);
for(const s of stars){const a=s.theta+rotation;const x=Math.cos(a)*s.r;const y=Math.sin(a)*s.r+s.offset;ctx.globalAlpha=s.alpha;ctx.fillStyle=s.gold?'#ebd1a2':'#e3dcf2';ctx.beginPath();ctx.arc(x,y,s.size,0,Math.PI*2);ctx.fill();}
ctx.restore();ctx.globalAlpha=1;if(!reduced)raf=requestAnimationFrame(frame);}
function pause(){active=false;cancelAnimationFrame(raf);raf=0;last=0;}
function resume(){if(document.hidden)return;active=true;if(reduced){frame(0);}else if(!raf){raf=requestAnimationFrame(frame);}}
document.addEventListener('visibilitychange',()=>{document.hidden?pause():resume();});
window.addEventListener('pagehide',pause);
window.addEventListener('pageshow',resume);
resume();
})();