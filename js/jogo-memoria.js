(()=>{'use strict';
const J=window.EvangelineJogos,grid=document.getElementById('memGrid'),moves=document.getElementById('memMoves'),pairs=document.getElementById('memPairs'),total=document.getElementById('memTotal'),status=document.getElementById('memStatus'),btn=document.getElementById('memNew');
const PARES=6;let first=null,lock=false,nMoves=0,nPairs=0,timer=0;
function novo(){
 clearTimeout(timer);first=null;lock=false;nMoves=0;nPairs=0;moves.textContent='0';pairs.textContent='0';total.textContent=PARES;
 status.textContent='Vire duas cartas e encontre a foto igual.';grid.textContent='';
 const fotos=J.embaralhar(window.EvangelineFotos).slice(0,PARES);
 const baralho=J.embaralhar(fotos.flatMap((f,i)=>[{f,id:i},{f,id:i}]));
 baralho.forEach((c,i)=>{
  const b=document.createElement('button');b.type='button';b.className='mem-card';b.dataset.id=c.id;b.setAttribute('aria-label','Carta '+(i+1)+', virada para baixo');
  b.innerHTML='<span class="mem-inner"><span class="mem-face mem-back" aria-hidden="true">❧</span><span class="mem-face mem-front"><img alt="" loading="eager" decoding="async"></span></span>';
  const img=b.querySelector('img');img.src=c.f.src;b._alt=c.f.alt;
  b.addEventListener('click',()=>virar(b,i));grid.appendChild(b)});
}
function virar(b,i){
 if(lock||b.classList.contains('is-flipped')||b.classList.contains('is-matched'))return;
 b.classList.add('is-flipped');b.setAttribute('aria-label','Carta '+(i+1)+': '+b._alt);
 if(!first){first=b;return}
 nMoves++;moves.textContent=nMoves;const a=first;first=null;
 if(a.dataset.id===b.dataset.id){
  for(const c of [a,b]){c.classList.add('is-matched');c.classList.remove('is-flipped')}
  nPairs++;pairs.textContent=nPairs;
  status.textContent=nPairs===PARES?'Todos os pares! Em '+nMoves+' jogadas. Cada foto, um carinho 💚':'Par encontrado! Faltam '+(PARES-nPairs)+'.';
 }else{
  lock=true;status.textContent='Quase! Tente outra vez.';
  timer=setTimeout(()=>{for(const c of [a,b]){c.classList.remove('is-flipped');c.setAttribute('aria-label','Carta '+([...grid.children].indexOf(c)+1)+', virada para baixo')}lock=false},J.reduzido?500:850);
 }
}
btn.addEventListener('click',novo);novo();
})();
