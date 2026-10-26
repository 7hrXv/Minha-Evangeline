const itens=[
{nome:"Uma declaração",desc:"Olhem nos olhos um do outro e contem três coisas que fazem vocês se escolherem todos os dias."},
{nome:"Nosso primeiro dia",desc:"Relembrem juntos como tudo começou, em 21 de outubro de 2025."},
{nome:"Um abraço longo",desc:"Um abraço bem apertado, daqueles que fazem o mundo parar por um instante."},
{nome:"Foto favorita",desc:"Escolham uma foto de vocês e contem por que esse momento é tão especial."},
{nome:"Um beijo",desc:"Um beijo carinhoso para lembrar que o amor mora nos detalhes."},
{nome:"Uma promessa",desc:"Façam uma promessa bonita e possível para os próximos capítulos."},
{nome:"Nossa música",desc:"Escolham uma música que lembre vocês dois e escutem juntos."},
{nome:"Próximo encontro",desc:"Imaginem e planejem um encontro especial só de vocês."}
];
const canvas=document.getElementById("roletaCanvas"),ctx=canvas.getContext("2d"),botao=document.getElementById("girarRoleta");
const n=itens.length,passo=Math.PI*2/n;
const cores=[['#3c5a3e','#203e2e'],['#586b43','#314c31'],['#254936','#163627'],['#65744c','#3c5434'],['#3e5c40','#233e2d'],['#516b42','#304c32'],['#31523a','#1b3a2a'],['#60774f','#3a593b']];
let rotacao=0,rodando=false;
function desenhar(highlight=-1){
 const c=340,r=318;
 ctx.clearRect(0,0,680,680);
 // Borda luminosa externa, como uma joia sob o céu estrelado
 ctx.beginPath();ctx.arc(c,c,331,0,Math.PI*2);ctx.fillStyle='#183c2e';ctx.fill();
 ctx.lineWidth=6;ctx.strokeStyle='#d9b96f';ctx.shadowColor='#b99955';ctx.shadowBlur=7;ctx.stroke();ctx.shadowBlur=0;
 for(let i=0;i<n;i++){
  const meio=-Math.PI/2+i*passo,inicio=meio-passo/2;
  const grad=ctx.createRadialGradient(c,c,42,c,c,r);
  grad.addColorStop(0,i===highlight?'#9daf6a':cores[i][0]);grad.addColorStop(1,i===highlight?'#507448':cores[i][1]);
  ctx.beginPath();ctx.moveTo(c,c);ctx.arc(c,c,r,inicio,inicio+passo);ctx.closePath();ctx.fillStyle=grad;ctx.fill();
  ctx.lineWidth=2.5;ctx.strokeStyle='rgba(216,183,112,.7)';ctx.stroke();
  // Brilho pontual no aro de cada fatia
  const bx=c+Math.cos(meio)*294,by=c+Math.sin(meio)*294;
  ctx.beginPath();ctx.arc(bx,by,3.2,0,Math.PI*2);ctx.fillStyle='#ffdf92';ctx.shadowColor='#ffdf92';ctx.shadowBlur=12;ctx.fill();ctx.shadowBlur=0;
  // Texto em duas linhas, voltado para fora e sem ficar de cabeça para baixo
  ctx.save();ctx.translate(c,c);ctx.rotate(meio);
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fff2d8';ctx.shadowColor='#001b18';ctx.shadowBlur=4;
  ctx.font='bold 23px Arial, sans-serif';
  const palavras=itens[i].nome.split(' '), linhas=[];let linha='';
  for(const palavra of palavras){const teste=linha?linha+' '+palavra:palavra;if(ctx.measureText(teste).width>160&&linha){linhas.push(linha);linha=palavra}else{linha=teste}}
  if(linha)linhas.push(linha);
  // Orientação tangencial suave, letras legíveis nas fatias
  ctx.translate(218,0);ctx.rotate(Math.PI/2);
  if(Math.cos(meio)<-0.01){ctx.rotate(Math.PI)}
  const y0=-(linhas.length-1)*15;
  linhas.forEach((l,j)=>ctx.fillText(l,0,y0+j*30));
  ctx.restore();
 }
 ctx.beginPath();ctx.arc(c,c,r,0,Math.PI*2);ctx.lineWidth=6;ctx.strokeStyle='#e2c47e';ctx.stroke();
 ctx.beginPath();ctx.arc(c,c,53,0,Math.PI*2);ctx.fillStyle='#123f3b';ctx.fill();ctx.lineWidth=5;ctx.strokeStyle='#dcb96b';ctx.stroke();
 // Small gold lotus, drawn directly on the rotating disc
 ctx.save();ctx.translate(c,c);ctx.fillStyle='#e8cc8d';ctx.strokeStyle='#aa8545';ctx.lineWidth=1.5;
 for(let k=-2;k<=2;k++){ctx.save();ctx.rotate(k*.34);ctx.beginPath();ctx.moveTo(0,12);ctx.bezierCurveTo(-12,-2,-11,-23,0,-29);ctx.bezierCurveTo(11,-23,12,-2,0,12);ctx.fill();ctx.stroke();ctx.restore()}
 ctx.beginPath();ctx.ellipse(0,13,24,6,0,0,Math.PI*2);ctx.fill();ctx.restore();
}
desenhar();
botao.addEventListener("click",()=>{
 if(rodando)return;
 rodando=true;botao.disabled=true;botao.textContent="Girando...";
 const escolhido=Math.floor(Math.random()*n);
 // Os setores são desenhados com o centro do setor zero no topo.
 // O canvas gira no sentido horário; a seta permanece no topo.
 const atual=((rotacao%360)+360)%360;
 const alvo=(360-escolhido*360/n)%360;
 const delta=(alvo-atual+360)%360;
 rotacao+=360*6+delta;desenhar();
 const resultado=document.getElementById("resultadoRoleta");
 resultado.classList.remove("vencedor");resultado.hidden=true;
 const finalizar=()=>{const normal=((rotacao%360)+360)%360;const apontado=Math.round(((360-normal)%360)/(360/n))%n;desenhar(apontado);resultado.hidden=false;resultado.classList.add('vencedor');canvas.dataset.selected=String(apontado);
  document.getElementById("resultadoTitulo").textContent=`Você ganhou: ${itens[apontado].nome}! 💚`;
  const continuation=document.getElementById('wheelContinue');if(continuation)continuation.hidden=false;botao.disabled=false;botao.textContent="Girar novamente ✧";rodando=false;
  window.roletaCelebrar?.();
 };
 const reduzir=matchMedia("(prefers-reduced-motion: reduce)").matches;
 if(reduzir){canvas.style.transition="none";canvas.style.transform=`rotate(${rotacao}deg)`;setTimeout(finalizar,80);return}
 canvas.style.transition="transform 6s cubic-bezier(.32,0,.12,1)";
 canvas.style.transform=`rotate(${rotacao}deg)`;
 let done=false;
 const onEnd=e=>{if(e.propertyName!=="transform"||done)return;done=true;canvas.removeEventListener("transitionend",onEnd);finalizar()};
 canvas.addEventListener("transitionend",onEnd);
 setTimeout(()=>{if(!done){done=true;canvas.removeEventListener("transitionend",onEnd);finalizar()}},6400);
});

// Permite girar também ao clicar diretamente na roleta.
canvas.style.cursor="pointer";
canvas.addEventListener("click",()=>{if(!rodando)botao.click()});
