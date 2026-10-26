(()=>{'use strict';
const b=document.body,main=document.querySelector('.chapter-main');if(!b.classList.contains('chapter')||!main)return;
const ch=+(b.className.match(/chapter-(\d)/)||[])[1]||0,reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
let seed=2110+ch*131;const rnd=()=>(seed=seed*16807%2147483647)/2147483647;
const P='assets/personagens/',O='assets/objetos/',I='assets/images/',alt=ch%2;
const cast=[[['tiana','tiana-dancando'],112],[['naveen','naveen-cantando'],106],[['sapinhos','sapinhos-juntos'],64],[['ray','ray-apontando'],78],[['louis','louis-musico'],94]]
 .map(([n,h])=>({src:P+n[alt]+'.webp',h:h*(.88+rnd()*.3),cast:1}));
const props={0:[O+'lacre-e-tinteiro.svg',I+'ornamento-lotus.svg'],1:[I+'ornamento-lotus.svg',I+'flor-miuda.svg','assets/royal-vine.svg'],2:[O+'album-botanico-aberto.svg',I+'flor-miuda.svg'],3:[O+'cartas-empilhadas.svg',O+'lacre-e-tinteiro.svg',O+'papel-e-caneta.svg'],4:[O+'vinil-e-partitura.svg',I+'ornamento-lotus.svg'],5:[O+'livro-e-flor.svg',I+'flor-miuda.svg','assets/royal-vine.svg'],6:[O+'vinil-e-partitura.svg',I+'ornamento-lotus.svg'],7:[O+'papel-e-caneta.svg',I+'flor-miuda.svg','assets/mural-lotus.svg'],8:[I+'ornamento-lotus.svg',O+'lacre-e-tinteiro.svg','assets/royal-vine.svg']}[ch]||{memoria:[I+'flor-miuda.svg',I+'ornamento-lotus.svg'],sonhos:[O+'livro-e-flor.svg',I+'ornamento-lotus.svg'],encontro:[O+'papel-e-caneta.svg',I+'flor-miuda.svg'],capsula:[O+'cartas-empilhadas.svg',O+'lacre-e-tinteiro.svg']}[b.dataset.exp]||[];
const items=[];[...cast,...props.map(s=>({src:s,h:56+rnd()*26,cast:0}))].forEach((d,i)=>{const el=new Image();el.alt='';el.decoding='async';el.className='elenco'+(d.cast?'':' obj');el.setAttribute('aria-hidden','true');el.src=d.src;if(!d.cast)el.style.rotate=(rnd()*24-12)+'deg';main.appendChild(el);items.push({el,d,i});});
let timer=0,lastW=0,lastH=0,shown=false;
function obstacles(W){const out=[],mr=main.getBoundingClientRect(),add=r=>{if(r.width>1&&r.height>1)out.push([r.left-mr.left-8,r.top-mr.top-8,r.right-mr.left+8,r.bottom-mr.top+8]);};
 const walker=document.createTreeWalker(main,NodeFilter.SHOW_TEXT),rg=document.createRange();
 for(let n;n=walker.nextNode();){if(!n.nodeValue.trim())continue;const p=n.parentElement;if(!p||p.closest('.elenco,script,style')||!p.getClientRects().length)continue;rg.selectNodeContents(n);for(const r of rg.getClientRects())add(r);}
 main.querySelectorAll('img:not(.elenco),input,textarea,select,button,iframe,canvas,video,svg:not(.elenco),.polaroid-card,.garden,.mem-grid,.invite,.dream-card,.exp-bar,.wheel,[class*="roleta"] canvas').forEach(e=>{if(e.closest('.elenco'))return;add(e.getBoundingClientRect());});return out;}
function place(){const W=main.clientWidth,H=main.scrollHeight,mob=innerWidth<700,k=mob?.62:1;lastW=W;lastH=H;
 items.forEach(it=>{it.el.style.display='none'});const obs=obstacles(W),placed=[],x0=mob?4:W*.1,x1=W-(mob?4:W*.1),hit=(a,b)=>a[0]<b[2]&&a[2]>b[0]&&a[1]<b[3]&&a[3]>b[1];
 const use=items.filter(it=>mob?(it.d.cast?it.i%2===0||it.i===4:it.i===5):true),n=use.length;
 use.forEach((it,j)=>{const nat=it.el.naturalWidth/(it.el.naturalHeight||1)||1,h=it.d.h*k,w=h*nat;let best=null;
  const ty=H*(.08+.8*((j*3)%n+.5)/n),tx=x0+(x1-x0-w)*(j%2?.78:.22);
  for(const win of [.14,.3,.55]){for(let y=Math.max(0,ty-H*win);y<=Math.min(H-h,ty+H*win);y+=14)for(let x=x0;x<=x1-w;x+=14){const r=[x,y,x+w,y+h];if(obs.some(o=>hit(r,o))||placed.some(o=>hit(r,[o[0]-14,o[1]-14,o[2]+14,o[3]+14])))continue;const c=Math.abs(y-ty)+.4*Math.abs(x-tx);if(!best||c<best.c)best={c,x,y,r};}if(best)break;}
  const el=it.el;if(!best){el.style.display='none';return;}el.style.display='';el.style.width=w+'px';el.style.height=h+'px';el.style.left=best.x+'px';el.style.top=best.y+'px';placed.push(best.r);
  if(!el.classList.contains('on')&&!shown)setTimeout(()=>{el.classList.add('on');if(it.d.cast&&!reduced&&(it.i===3||it.i===2))setTimeout(()=>el.classList.add('flutua'),1000);},250+j*140);else el.classList.add('on');});
 shown=true;}
function schedule(){clearTimeout(timer);timer=setTimeout(()=>{if(Math.abs(main.clientWidth-lastW)>1||Math.abs(main.scrollHeight-lastH)>4)place();},260);}
function start(){place();if('ResizeObserver'in window)new ResizeObserver(schedule).observe(main);addEventListener('resize',schedule,{passive:true});new MutationObserver(()=>{lastH=-99;schedule();}).observe(main,{attributes:true,attributeFilter:['hidden'],subtree:true});}
const ready=Promise.all(items.map(it=>it.el.decode?it.el.decode().catch(()=>{}):0));
Promise.all([ready,document.fonts?document.fonts.ready:0]).then(()=>setTimeout(start,350));
document.addEventListener('visibilitychange',()=>document.documentElement.classList.toggle('pausa',document.hidden));
})();
