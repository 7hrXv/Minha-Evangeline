(()=>{'use strict';
const cfg=window.EvangelineSite,frame=document.getElementById('storyFrame');if(!cfg||!frame)return;
const aliases={'quiz.html':'contador.html','memorias.html':'cartas.html'};
function criarBotao(d){const b=d.createElement('button');b.type='button';b.id='pagesMenuButton';b.className='pages-menu-button';b.textContent='Ver páginas 💚';b.setAttribute('aria-haspopup','dialog');b.setAttribute('aria-expanded','false');b.addEventListener('click',e=>{e.stopPropagation();menu.hidden?abrir():fechar()});return b}
let btn=criarBotao(document);btn.hidden=true;
const back=document.createElement('div');back.className='pages-menu-backdrop';back.hidden=true;
const menu=document.createElement('nav');menu.id='pagesMenu';menu.className='pages-menu';menu.hidden=true;menu.setAttribute('aria-label','Páginas do site');
menu.innerHTML='<h2>Nossas páginas</h2>';
const ol=document.createElement('ol');
cfg.chapters.forEach((c,i)=>{const li=document.createElement('li'),a=document.createElement('a');a.href='#/'+c.file;a.dataset.file=c.file;a.innerHTML='<b>'+String(i+1).padStart(2,'0')+'</b><span></span>';a.lastChild.textContent=c.title;li.appendChild(a);ol.appendChild(li)});
menu.appendChild(ol);document.body.append(back,menu);
function posicionar(){
 try{const doc=frame.contentDocument;if(!doc||!doc.body)return;
 const header=doc.querySelector('.chapter-header');if(!header)return;
 let holder=doc.getElementById('pagesMenuPlacement');
 if(!holder){holder=doc.createElement('div');holder.id='pagesMenuPlacement';holder.className='pages-menu-placement';const exit=header.querySelector('.chapter-exit');if(exit)exit.insertAdjacentElement('beforebegin',holder);else header.appendChild(holder)}
 let local=holder.querySelector('#pagesMenuButton');if(!local){local=criarBotao(doc);holder.appendChild(local)}btn=local;
 if(!doc.getElementById('pagesMenuInlineStyle')){const style=doc.createElement('style');style.id='pagesMenuInlineStyle';style.textContent=`
 html body.chapter .chapter-header .pages-menu-placement{display:flex;align-items:center;justify-content:center;grid-column:4;grid-row:1;align-self:center;justify-self:end;margin:0;padding:0;min-width:0;position:relative;z-index:2}
 html body.chapter .correspondence-header{grid-template-columns:52px minmax(180px,1fr) minmax(190px,280px) auto auto}
 html body.chapter .correspondence-header .correspondence-monogram{grid-column:1;grid-row:1}
 html body.chapter .correspondence-header .chapter-brand{grid-column:2;grid-row:1}
 html body.chapter .correspondence-header .chapter-wayfinding{grid-column:3;grid-row:1}
 html body.chapter .correspondence-header .chapter-exit{grid-column:5;grid-row:1}
 .chapter-header .pages-menu-button{position:static!important;display:inline-flex;align-items:center;justify-content:center;min-height:38px;padding:8px 16px;border:1px solid #bea27099;border-radius:24px;background:linear-gradient(135deg,#25483a,#173329);color:#e7d09a;font:14px Georgia,serif;letter-spacing:.02em;white-space:nowrap;cursor:pointer;box-shadow:0 4px 12px #0003;transition:background .2s,border-color .2s}
 .chapter-header .pages-menu-button:hover{background:#355544;border-color:#d7bc7e}
 .chapter-header .pages-menu-button:focus-visible{outline:2px solid #e8cf8f;outline-offset:3px}
 .chapter-header .pages-menu-button[hidden]{display:none!important}
 @media(max-width:900px){
  html body.chapter .correspondence-header{grid-template-columns:50px minmax(0,1fr) 44px;min-height:0;row-gap:8px}
  html body.chapter .correspondence-header .chapter-wayfinding{grid-column:2;grid-row:2;text-align:left}
  html body.chapter .correspondence-header .chapter-exit{grid-column:3;grid-row:1}
  html body.chapter .chapter-header .pages-menu-placement{grid-column:1/-1;grid-row:3;justify-self:center;justify-content:center;width:100%}
  .chapter-header .pages-menu-button{min-height:36px;padding:7px 15px;font-size:13px}
 }
 @media(max-width:560px){html body.chapter .correspondence-header{grid-template-columns:38px minmax(0,1fr) 44px}}
 `;doc.head.appendChild(style)}
 }catch(e){}
}

function atual(){const n=location.hash.replace(/^#\/?/,'').split('?')[0];return aliases[n]||n||'entrada.html'}
function liberado(){try{return sessionStorage.getItem('evangeline-session-unlocked')==='yes'}catch(e){return false}}
function marcar(){
 posicionar();
 const f=atual(),ok=liberado()&&f!=='entrada.html';btn.hidden=!ok;if(!ok)fechar(false);
 menu.querySelectorAll('a').forEach(a=>{if(a.dataset.file===f)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
}
function abrir(){marcar();menu.hidden=false;back.hidden=false;btn.setAttribute('aria-expanded','true');const c=menu.querySelector('[aria-current="page"]')||menu.querySelector('a');c.scrollIntoView({block:'center'});c.focus({preventScroll:true})}
function fechar(foco=true){if(menu.hidden)return;menu.hidden=true;back.hidden=true;btn.setAttribute('aria-expanded','false');if(foco)btn.focus({preventScroll:true})}
back.addEventListener('pointerdown',e=>{e.preventDefault();fechar(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape')fechar()});
menu.addEventListener('click',e=>{
 const a=e.target.closest('a[data-file]');if(!a)return;e.preventDefault();
 const f=a.dataset.file;fechar(false);
 if(f!==atual())location.hash='#/'+f; /* o host troca a página pelo hashchange */
});
frame.addEventListener('load',()=>{posicionar();marcar()});window.addEventListener('hashchange',marcar);window.addEventListener('popstate',marcar);window.addEventListener('pageshow',marcar);
marcar();
})();
