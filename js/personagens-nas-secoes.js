(()=>{'use strict';
const characters=[...document.querySelectorAll('.section-character')];if(!characters.length)return;
const main=document.querySelector('.chapter-main');let frame=0,disposed=false;
const obstacles='h1,h2,h3,p,a,button,input,textarea,summary,label,iframe,canvas,svg,img:not(.section-character),.chapter-navigation';
function visible(el){return !el.closest('[hidden]')&&getComputedStyle(el).display!=='none'&&el.getBoundingClientRect().width>0;}
function intersects(a,b,gap=7){return a.left<b.right+gap&&a.right>b.left-gap&&a.top<b.bottom+gap&&a.bottom>b.top-gap;}
function layout(){frame=0;if(disposed||document.hidden)return;characters.forEach(img=>{img.classList.remove('is-placed');img.style.width='';});
 const content=main.getBoundingClientRect(),occupied=[];
 characters.forEach(img=>{const anchor=img.parentElement;if(!visible(anchor)||!img.naturalWidth||getComputedStyle(img).display==='none')return;
  const bounds=anchor.getBoundingClientRect(),style=getComputedStyle(img),baseW=parseFloat(style.width),maxH=parseFloat(style.maxHeight)||230,minW=parseFloat(style.getPropertyValue('--cast-min'))||48,ratio=img.naturalHeight/img.naturalWidth;
  if(!baseW)return;
  const blocked=[];
  // Text ranges reserve the actual glyph area, rather than an empty full-width paragraph box.
  anchor.querySelectorAll(obstacles).forEach(el=>{if(el===img||!visible(el)||el.closest('.section-character'))return;
   if(/^(H[1-3]|P|LABEL)$/.test(el.tagName)){const range=document.createRange();range.selectNodeContents(el);for(const r of range.getClientRects())if(r.width&&r.height)blocked.push(r);range.detach();}
   else blocked.push(el.getBoundingClientRect());
  });
  const index=Number(img.dataset.placement)||0;let found=null,usedW=baseW;
  // Tenta o tamanho grande e só reduz o adesivo se não houver espaço livre.
  for(const scale of [1,.86,.74,.63,.54,.46]){
   const actualW=Math.min(baseW,Math.max(minW,baseW*scale)),h=Math.min(maxH*actualW/baseW,actualW*ratio);
   if(bounds.height<h)continue;
   const left=Math.max(bounds.left+8,content.left+8),right=Math.min(bounds.right-actualW-8,content.right-actualW-8),top=bounds.top+5,bottom=Math.min(bounds.bottom-h-5,top+Math.max(180,bounds.height*.82));
   if(right<left||bottom<top)continue;
   const ys=index===0?[top,top+24,(top+bottom)/2,bottom]:index===1?[(top+bottom)/2,top,bottom]:[bottom,top,(top+bottom)/2];
   for(let y=top;y<=bottom;y+=40)ys.push(y);
   const xs=index%2?[left,right,left+(right-left)*.25,right-(right-left)*.25]:[right,left,right-(right-left)*.25,left+(right-left)*.25];
   xs.push((left+right)/2);
   for(const y0 of ys){for(const x of xs){const y=Math.max(top,Math.min(bottom,y0)),rect={left:x,right:x+actualW,top:y,bottom:y+h};if(![...blocked,...occupied].some(r=>intersects(rect,r))){found=rect;usedW=actualW;break;}}if(found)break;}
   if(found)break;
  }
  if(!found)return;
  img.style.width=usedW+'px';img.style.left=(found.left-bounds.left)+'px';img.style.top=(found.top-bounds.top)+'px';img.classList.add('is-placed');occupied.push(found);
 });}
function schedule(){if(!disposed&&!frame)frame=requestAnimationFrame(layout);}
characters.forEach(img=>img.addEventListener('load',schedule));
const resize=typeof ResizeObserver==='function'?new ResizeObserver(schedule):null;characters.forEach(img=>resize?.observe(img.parentElement));
const mutation=new MutationObserver(schedule);mutation.observe(main,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden']});
window.addEventListener('resize',schedule);document.addEventListener('visibilitychange',schedule);document.fonts?.ready.then(schedule);schedule();
window.addEventListener('pagehide',()=>{disposed=true;resize?.disconnect();mutation.disconnect();if(frame)cancelAnimationFrame(frame);window.removeEventListener('resize',schedule);document.removeEventListener('visibilitychange',schedule);},{once:true});
})();
