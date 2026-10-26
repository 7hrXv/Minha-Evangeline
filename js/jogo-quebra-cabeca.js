(()=>{'use strict';
const J=window.EvangelineJogos,board=document.getElementById('pzBoard'),peek=document.getElementById('pzPeek'),moves=document.getElementById('pzMoves'),status=document.getElementById('pzStatus'),reset=document.getElementById('pzReset'),other=document.getElementById('pzPhoto'),show=document.getElementById('pzShow');
const N=3,V=N*N-1; /* V = peça vazia (a última) */
let foto=null,estado=[],vazio=V,nMoves=0,resolvido=false,fila=[];
function proxFoto(){if(!fila.length)fila=J.embaralhar(window.EvangelineFotos).filter(f=>f!==foto);foto=fila.pop()}
function fundo(el,id){
 const c=id%N,r=Math.floor(id/N),k=foto.r,f=foto.f;let sz,x,y;
 if(k>=1){sz='300% auto';x=c/2*100;y=(((3*k-3)*f+r)/(3*k-1))*100}
 else{sz='auto 300%';const w=3/k;x=(((w-3)*f+c)/(w-1))*100;y=r/2*100}
 el.style.backgroundImage='url("'+foto.src+'")';el.style.backgroundSize=sz;el.style.backgroundPosition=x+'% '+y+'%';
}
function pos(i){return[i%N,Math.floor(i/N)]}
function colocar(){
 estado.forEach((id,i)=>{const t=tiles[id],[c,r]=pos(i);t.style.transform='translate('+c*100+'%,'+r*100+'%)';t.setAttribute('aria-label',id===V?'Espaço vazio':'Peça '+(id+1)+', linha '+(r+1)+', coluna '+(c+1))})
}
const tiles=[];
function montar(){
 board.textContent='';tiles.length=0;
 for(let id=0;id<=V;id++){
  const t=document.createElement('button');t.type='button';t.className='pz-tile'+(id===V?' pz-last':'');t.dataset.id=id;fundo(t,id);
  if(id===V){t.tabIndex=-1;t.setAttribute('aria-hidden','true')}
  t.addEventListener('click',()=>tocar(estado.indexOf(id)));board.appendChild(t);tiles.push(t)}
 /* "ver foto": recorte quadrado completo */
 if(foto.r>=1){peek.style.backgroundSize='100% auto';peek.style.backgroundPosition='50% '+(foto.f*100)+'%'}else{peek.style.backgroundSize='auto 100%';peek.style.backgroundPosition=(foto.f*100)+'% 50%'}
 peek.style.backgroundImage='url("'+foto.src+'")';
}
function vizinhos(v){const[c,r]=pos(v),o=[];if(c>0)o.push(v-1);if(c<N-1)o.push(v+1);if(r>0)o.push(v-N);if(r<N-1)o.push(v+N);return o}
function embaralhar(){
 estado=[...Array(V+1).keys()];vazio=V;let ant=-1;const passos=70+Math.floor(Math.random()*60);
 for(let s=0;s<passos||estado.every((v,i)=>v===i);s++){ /* só movimentos legais: sempre solucionável */
  const op=vizinhos(vazio).filter(p=>p!==ant),p=op[Math.floor(Math.random()*op.length)];
  estado[vazio]=estado[p];estado[p]=V;ant=vazio;vazio=p}
}
function novo(trocar){
 if(trocar||!foto)proxFoto();resolvido=false;nMoves=0;moves.textContent='0';board.classList.remove('pz-board-solved');
 embaralhar();montar();colocar();peek.classList.remove('is-on');show.setAttribute('aria-pressed','false');
 status.textContent='Toque numa peça ao lado do espaço vazio para deslizá-la.';
}
function tocar(i){
 if(resolvido||i<0||i===vazio)return;const[c,r]=pos(i),[vc,vr]=pos(vazio);
 if(c!==vc&&r!==vr)return;
 const step=(c===vc?N:1)*Math.sign(i-vazio); /* desliza a fila inteira até o espaço vazio */
 for(let k=vazio;k!==i;k+=step)estado[k]=estado[k+step];
 estado[i]=V;vazio=i;nMoves++;moves.textContent=nMoves;colocar();checar();
}
function checar(){
 if(!estado.every((v,i)=>v===i))return;
 resolvido=true;board.classList.add('pz-board-solved');status.textContent='Montada em '+nMoves+' jogadas! Olha só como a gente fica bem junto 💚';
}
board.addEventListener('keydown',e=>{
 if(resolvido)return;const[c,r]=pos(vazio);let alvo=-1;
 if(e.key==='ArrowLeft'&&c<N-1)alvo=vazio+1;else if(e.key==='ArrowRight'&&c>0)alvo=vazio-1;
 else if(e.key==='ArrowUp'&&r<N-1)alvo=vazio+N;else if(e.key==='ArrowDown'&&r>0)alvo=vazio-N;
 if(alvo<0)return;e.preventDefault();const id=estado[alvo];tocar(alvo);tiles[id].focus({preventScroll:true});
});
reset.addEventListener('click',()=>novo(false));
other.addEventListener('click',()=>novo(true));
show.addEventListener('click',()=>{const on=!peek.classList.contains('is-on');peek.classList.toggle('is-on',on);show.setAttribute('aria-pressed',String(on))});
foto=window.EvangelineFotos.find(f=>f.src.includes('nos-dois.webp'));
novo(false);
})();
