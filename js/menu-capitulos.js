(()=>{'use strict';
const file=location.pathname.split('/').pop()||'entrada.html';
let ok=false;try{ok=sessionStorage.getItem('evangeline-session-unlocked')==='yes'}catch(_){}
const cfg=window.EvangelineSite,list=cfg&&cfg.chapters;
if(!ok||file==='entrada.html'||!Array.isArray(list))return;
function init(){const wf=document.querySelector('.chapter-header .chapter-wayfinding')||document.querySelector('.chapter-header');if(!wf||document.getElementById('evMenuBtn'))return;
 const btn=document.createElement('button');btn.type='button';btn.id='evMenuBtn';btn.className='ev-menu-btn';btn.setAttribute('aria-haspopup','true');btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-controls','evMenu');
 btn.innerHTML='<span class="long">Nossos capítulos 💚</span><span class="short">Capítulos 💚</span>';wf.append(btn);
 const menu=document.createElement('nav');menu.id='evMenu';menu.className='ev-menu';menu.hidden=true;menu.setAttribute('aria-label','Nossos capítulos');
 const h=document.createElement('h2');h.textContent='💚 Nossos capítulos';const ol=document.createElement('ol');
 list.forEach((c,i)=>{const li=document.createElement('li'),a=document.createElement('a'),n=document.createElement('b'),t=document.createElement('span');a.href=c.file;n.textContent=String(i+1).padStart(2,'0');t.textContent=c.title;a.append(n,t);if(c.file===file)a.setAttribute('aria-current','page');li.append(a);ol.append(li)});
 const f=document.createElement('footer');f.setAttribute('aria-hidden','true');f.textContent='💍 · 🐸 · 💚';menu.append(h,ol,f);document.body.append(menu);
 const place=()=>{const r=btn.getBoundingClientRect(),w=Math.min(340,innerWidth-24);menu.style.top=Math.max(8,Math.min(r.bottom+8,innerHeight-120))+'px';menu.style.left=Math.max(12,Math.min(r.left,innerWidth-w-12))+'px';menu.style.maxHeight=(innerHeight-parseFloat(menu.style.top)-12)+'px'};
 const close=(focus)=>{if(menu.hidden)return;menu.hidden=true;btn.setAttribute('aria-expanded','false');if(focus)btn.focus({preventScroll:true})};
 const open=()=>{menu.hidden=false;btn.setAttribute('aria-expanded','true');place();(menu.querySelector('[aria-current]')||menu.querySelector('a')).focus({preventScroll:true});menu.querySelector('[aria-current]')?.scrollIntoView({block:'nearest'})};
 btn.addEventListener('click',()=>menu.hidden?open():close(true));
 menu.addEventListener('click',e=>{if(e.target.closest('a'))setTimeout(()=>close(false),0)});
 document.addEventListener('pointerdown',e=>{if(!menu.hidden&&!menu.contains(e.target)&&!btn.contains(e.target))close(false)});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close(true)});
 addEventListener('resize',()=>{if(!menu.hidden)place()});addEventListener('pagehide',()=>close(false))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
