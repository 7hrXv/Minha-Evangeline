(()=>{'use strict';if(document.body.dataset.exp!=='coracoes')return;
const $=id=>document.getElementById(id),W=6,H=6,K='evangeline-coracoes-v1';
const load=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(_){return d}},save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}};
const WINS=['Os dois corações se encontraram! 💚💍💚','Mais um caminho aberto entre nós. 💚💍💚','Um ano de nós, e a gente sempre se encontra. 💚💍🐸'];
/* Fases originais: reserva garantida (resolvíveis) caso o gerador não encontre uma fase válida. */
const FALLBACK=[
 {a:[0,2],b:[5,2],stones:[[4,0],[1,4],[3,5]],pcs:[['v',2,2,1,2],['k',3,4,2,1]]},
 {a:[0,3],b:[5,3],stones:[[2,1],[4,0]],pcs:[['v',2,2,1,2],['k',1,5,2,1],['v',4,3,1,2]]},
 {a:[0,2],b:[5,2],stones:[[5,0],[4,4],[5,5]],pcs:[['v',1,1,1,2],['v',3,2,1,3],['k',0,0,2,1],['k',0,4,2,1]]}];
/* Três níveis de dificuldade; min/max = menor número de casas movidas até a solução (calculado por busca). */
const TIERS=[
 {stones:[2,3],pcs:[['v',2],['k',2]],min:4,max:7},
 {stones:[2,3],pcs:[['v',2],['k',2],['v',2]],min:7,max:10},
 {stones:[2,3],pcs:[['v',2],['v',3],['k',2],['k',2]],min:8,max:13}];
const LK='evangeline-coracoes-layout-v1';
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const cmp=(p,q)=>String(p)<String(q)?-1:String(p)>String(q)?1:0;
const sig=L=>JSON.stringify([L.a,L.b,L.stones.slice().sort(cmp),L.pcs.slice().sort(cmp)]);
/* Menor número de casas para o coração A chegar ao lado do B (busca em largura). -1 = sem solução. */
function solve(L){
 const mv=[{t:'a',x:L.a[0],y:L.a[1],w:1,h:1}].concat(L.pcs.map(([t,x,y,w,h])=>({t,x,y,w,h})));
 const fixed=new Set([L.b[0]+','+L.b[1]]);L.stones.forEach(([x,y])=>fixed.add(x+','+y));
 const key=st=>st.map(p=>p.x+'.'+p.y).join('|');
 const occ=(st,skip)=>{const o=new Set(fixed);st.forEach((p,i)=>{if(i===skip)return;for(let i2=0;i2<p.w;i2++)for(let j=0;j<p.h;j++)o.add((p.x+i2)+','+(p.y+j))});return o};
 const fit=(p,x,y,o)=>{if(x<0||y<0||x+p.w>W||y+p.h>H)return false;for(let i=0;i<p.w;i++)for(let j=0;j<p.h;j++)if(o.has((x+i)+','+(y+j)))return false;return true};
 const seen=new Set([key(mv)]);let q=[mv],d=0;
 while(q.length&&seen.size<60000){const nq=[];
  for(const st of q){if(st[0].x===L.b[0]-1&&st[0].y===L.b[1])return d;
   st.forEach((p,i)=>{const hz=p.t!=='v',o=occ(st,i);
    for(const dl of[-1,1]){const nx=p.x+(hz?dl:0),ny=p.y+(hz?0:dl);if(!fit(p,nx,ny,o))continue;
     const ns=st.map((r,j)=>j===i?{t:r.t,x:nx,y:ny,w:r.w,h:r.h}:r),k=key(ns);if(seen.has(k))continue;seen.add(k);nq.push(ns)}})}
  q=nq;d++}
 return -1}
/* Gera uma fase aleatória, com solução comprovada e dificuldade dentro da faixa do nível. */
function genLevel(T,avoid){
 for(let n=0;n<400;n++){
  const r=ri(1,4),a=[0,r],b=[5,r],taken=new Set([a.join(','),b.join(',')]);
  const free=(x,y,w,h)=>{if(x<0||y<0||x+w>W||y+h>H)return false;for(let i=0;i<w;i++)for(let j=0;j<h;j++)if(taken.has((x+i)+','+(y+j)))return false;return true};
  const mark=(x,y,w,h)=>{for(let i=0;i<w;i++)for(let j=0;j<h;j++)taken.add((x+i)+','+(y+j))};
  const stones=[],pcs=[];let ok=true;
  const ns=ri(T.stones[0],T.stones[1]);
  for(let s=0;s<ns&&ok;s++){let put=false;for(let t=0;t<30&&!put;t++){const x=ri(0,W-1),y=ri(0,H-1);if(y!==r&&free(x,y,1,1)){stones.push([x,y]);mark(x,y,1,1);put=true}}if(!put)ok=false}
  for(let k=0;k<T.pcs.length&&ok;k++){const[t,len]=T.pcs[k],w=t==='v'?1:len,h=t==='v'?len:1;let put=false;
   for(let g=0;g<40&&!put;g++){const x=ri(0,W-w),y=ri(0,H-h);if(t==='k'&&y===r)continue;if(free(x,y,w,h)){pcs.push([t,x,y,w,h]);mark(x,y,w,h);put=true}}if(!put)ok=false}
  if(!ok)continue;
  const L={a,b,stones,pcs},d=solve(L);
  if(d>=T.min&&d<=T.max&&sig(L)!==avoid)return L}
 return null}
/* Espelha a fase na vertical (continua resolvível): só é usado se a fase de reserva repetir a anterior. */
const flipY=L=>({a:[L.a[0],H-1-L.a[1]],b:[L.b[0],H-1-L.b[1]],stones:L.stones.map(([x,y])=>[x,H-1-y]),pcs:L.pcs.map(([t,x,y,w,h])=>[t,x,H-y-h,w,h])});
let levels=[];
function newCampaign(){
 const prev=(load(LK,{}).sigs)||[];
 levels=TIERS.map((T,i)=>{let L=genLevel(T,prev[i]);
  if(!L||solve(L)<0){L=FALLBACK[i];if(sig(L)===prev[i])L=flipY(L)}
  return L});
 save(LK,{sigs:levels.map(sig)})}
const board=$('cb'),panel=$('cbWin'),lvlEl=$('cbLevel'),mvEl=$('cbMoves'),status=$('cbStatus');
let li=0,moves=0,done=false,items=[],A,B;
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const place=(p,x,y)=>{p.el.style.left=`calc(${x*100/W}% + 2px)`;p.el.style.top=`calc(${y*100/H}% + 2px)`};
const size=p=>{p.el.style.width=`calc(${p.w*100/W}% - 4px)`;p.el.style.height=`calc(${p.h*100/H}% - 4px)`};
const occupied=(skip)=>{const s=new Set();items.forEach(p=>{if(p===skip)return;for(let i=0;i<p.w;i++)for(let j=0;j<p.h;j++)s.add((p.x+i)+','+(p.y+j))});return s};
const fits=(p,x,y,occ)=>{if(x<0||y<0||x+p.w>W||y+p.h>H)return false;for(let i=0;i<p.w;i++)for(let j=0;j<p.h;j++)if(occ.has((x+i)+','+(y+j)))return false;return true};
const range=p=>{const occ=occupied(p),hz=p.t!=='v';let lo=hz?p.x:p.y,hi=lo;const at=v=>hz?fits(p,v,p.y,occ):fits(p,p.x,v,occ);while(at(lo-1))lo--;while(at(hi+1))hi++;return[lo,hi,hz]};
function build(){board.replaceChildren();items=[];done=false;moves=0;board.classList.remove('joined');panel.hidden=true;status.textContent='';
 const L=levels[li];lvlEl.textContent='Fase '+(li+1)+' de '+levels.length;mvEl.textContent='Movimentos: 0';
 L.stones.forEach(([x,y])=>{const e=document.createElement('div');e.className='st';e.setAttribute('aria-hidden','true');const p={el:e,x,y,w:1,h:1,t:'s'};size(p);place(p,x,y);board.append(e);items.push(p)});
 const bEl=document.createElement('div');bEl.className='hb';bEl.textContent='💚';bEl.setAttribute('role','img');bEl.setAttribute('aria-label','Coração de destino');B={el:bEl,x:L.b[0],y:L.b[1],w:1,h:1,t:'b'};size(B);place(B,B.x,B.y);board.append(bEl);items.push(B);
 L.pcs.forEach(([t,x,y,w,h],n)=>{const e=document.createElement('button');e.type='button';e.className='pc '+t;e.setAttribute('aria-label',(t==='v'?'Peça vertical':'Peça horizontal')+' '+(n+1)+': arraste ou use as setas');const p={el:e,x,y,w,h,t};size(p);place(p,x,y);hook(p);board.append(e);items.push(p)});
 const aEl=document.createElement('button');aEl.type='button';aEl.className='ha';aEl.textContent='💚';aEl.setAttribute('aria-label','Seu coração: arraste até o outro coração ou use as setas');A={el:aEl,x:L.a[0],y:L.a[1],w:1,h:1,t:'a'};size(A);place(A,A.x,A.y);hook(A);board.append(aEl);items.push(A)}
function commit(p,nx,ny){if(nx===p.x&&ny===p.y){place(p,p.x,p.y);return}p.x=nx;p.y=ny;place(p,nx,ny);moves++;mvEl.textContent='Movimentos: '+moves;check()}
function check(){if(A.x===B.x-1&&A.y===B.y)win()}
function win(){done=true;board.classList.add('joined');const last=li===levels.length-1;panel.hidden=false;$('cbWinTitle').textContent=WINS[li];
 $('cbWinText').textContent=last?'Fase final concluída! Um ano de nós: 21/10/2025 → 21/10/2026. Obrigado por cada capítulo ao seu lado.':'Fase '+(li+1)+' concluída em '+moves+' movimento'+(moves===1?'':'s')+'.';
 $('cbNext').textContent=last?'Jogar tudo de novo':'Próxima fase →';status.textContent='Corações unidos!';const s=load(K,{done:0});if(li+1>(s.done||0))save(K,{done:li+1});panel.querySelectorAll('i').forEach(i=>i.remove());if(!reduce)for(let k=0;k<8;k++){const h=document.createElement('i');h.textContent='💚';h.style.left=(6+k*12)+'%';h.style.animationDelay=(k*.35)+'s';panel.append(h)}$('cbNext').focus({preventScroll:true})}
function hook(p){let sx=0,sy=0,ox=0,oy=0,r=null,cell=1,pos=0,active=false;
 p.el.addEventListener('pointerdown',e=>{if(done||(e.pointerType==='mouse'&&e.button!==0))return;r=range(p);cell=board.clientWidth/W;sx=e.clientX;sy=e.clientY;ox=p.x;oy=p.y;pos=r[2]?ox:oy;active=true;p.el.setPointerCapture(e.pointerId);p.el.classList.add('drag');e.preventDefault()});
 p.el.addEventListener('pointermove',e=>{if(!active)return;const d=(r[2]?e.clientX-sx:e.clientY-sy)/cell;pos=Math.max(r[0],Math.min(r[1],(r[2]?ox:oy)+d));if(r[2])p.el.style.left=`calc(${pos*100/W}% + 2px)`;else p.el.style.top=`calc(${pos*100/H}% + 2px)`;e.preventDefault()});
 const end=()=>{if(!active)return;active=false;p.el.classList.remove('drag');const s=Math.round(pos);commit(p,r[2]?s:ox,r[2]?oy:s)};
 p.el.addEventListener('pointerup',end);p.el.addEventListener('pointercancel',end);
 p.el.addEventListener('keydown',e=>{const k={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(!k||done)return;e.preventDefault();const rg=range(p),hz=rg[2];if(hz&&k[0]===0||!hz&&k[1]===0)return;const nx=p.x+k[0],ny=p.y+k[1],v=hz?nx:ny;if(v<rg[0]||v>rg[1])return;commit(p,nx,ny)})}
$('cbReset').addEventListener('click',build);
$('cbNext').addEventListener('click',()=>{if(li===levels.length-1){li=0;newCampaign()}else li++;build();(board.querySelector('.ha')||board).focus({preventScroll:true})});
newCampaign();build();
})();
