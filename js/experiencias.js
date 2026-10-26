(()=>{'use strict';const kind=document.body.dataset.exp;if(!kind)return;const $=id=>document.getElementById(id),E=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const load=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(_){return d}},save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(_){return false}};
const fmt=iso=>{const d=new Date(iso+'T12:00:00');return isNaN(d)?'':new Intl.DateTimeFormat('pt-BR',{dateStyle:'long',timeZone:'America/Sao_Paulo'}).format(d)};
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
if(kind==='memoria'){const imgs=['nos-dois','selfie-juntos','beijo-carinho','sorrisos-juntos','abraco-juntos','nossas-maos'],grid=$('memGrid'),st=$('memStatus');let first=null,lock=false,found=0,moves=0;
 /* Baralho novo a cada partida: embaralha todos os pares (Fisher-Yates), nunca repete a ordem da partida anterior e evita começar com muitos pares colados. */
 const LASTK='evangeline-memoria-ordem-v1';let last=String(load(LASTK,'')||'');
 const colados=d=>{let c=0;for(let i=0;i<d.length;i++){if(i%4<3&&d[i]===d[i+1])c++;if(i+4<d.length&&d[i]===d[i+4])c++}return c};
 function newDeck(){const base=[...imgs,...imgs];let d=base.slice();
  for(let t=0;t<300;t++){d=base.slice();for(let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[d[i],d[j]]=[d[j],d[i]]}if(d.join()!==last&&colados(d)<=1)break}
  if(d.join()===last)d.push(d.shift());
  last=d.join();save(LASTK,last);return d}
 function build(){grid.replaceChildren();found=0;moves=0;first=null;lock=false;$('memPairs').textContent='Pares: 0 / 6';$('memMoves').textContent='Jogadas: 0';st.textContent='Vire duas cartas e encontre o par.';
  const deck=newDeck().map(n=>({n}));
  deck.forEach(c=>{const b=E('button','mem-card');b.type='button';b.setAttribute('aria-label','Carta virada para baixo');b.dataset.n=c.n;b.innerHTML='<span class="mem-in"><span class="mem-f" aria-hidden="true">✦</span><span class="mem-b"><img alt="Foto de Arthur e Mirella" decoding="async" loading="lazy"></span></span>';b.querySelector('img').src='assets/images/'+c.n+'.webp';b.addEventListener('click',()=>flip(b));grid.append(b)})}
 function flip(b){if(lock||b.classList.contains('open')||b.classList.contains('done'))return;b.classList.add('open');b.setAttribute('aria-label','Carta virada');if(!first){first=b;return}
  moves++;$('memMoves').textContent='Jogadas: '+moves;const a=first;first=null;
  if(a.dataset.n===b.dataset.n){[a,b].forEach(x=>{x.classList.remove('open');x.classList.add('done');x.disabled=true});found++;$('memPairs').textContent='Pares: '+found+' / 6';
   st.textContent=found===6?'Todos os pares! Em cada foto, a gente. Obrigado por este primeiro ano, Mirella ♡':'Par encontrado ✦';}
  else{lock=true;st.textContent='Quase! Tente de novo.';setTimeout(()=>{a.classList.remove('open');b.classList.remove('open');lock=false},reduce?400:850)}}
 $('memReset').addEventListener('click',build);build()}
if(kind==='encontro'){const K='evangeline-encontro-v1',steps=[['Onde vai ser?',['Um passeio ao ar livre','Ficar juntinhos em casa','Um cantinho novo da cidade']],['O que vamos comer?',['Pizza e conversa','Doces e café','Um jantar caprichado','Um lanchinho feito juntos']],['E a atividade?',['Filme ou série','Jogos e brincadeiras','Música e dança','Fotos e caminhada']]],box=$('dateStep'),inv=$('dateInvite'),st=$('dateStatus');let pick=[];
 function ask(){inv.hidden=true;box.hidden=false;box.replaceChildren();const i=pick.length;if(i>=3)return show(pick,false);box.append(E('span','step-dots','● '.repeat(i)+'○ '.repeat(3-i)),E('h3','step-title',steps[i][0]));steps[i][1].forEach(o=>{const b=E('button','opt',o);b.type='button';b.addEventListener('click',()=>{pick.push(o);ask()});box.append(b)});st.textContent=i?'Escolha registrada ✦':'Escolha uma opção por etapa.'}
 function show(p,saved){box.hidden=true;inv.hidden=false;inv.replaceChildren(E('h3','','Um convite para o próximo capítulo'),E('p','','Mirella, que tal combinarmos algo assim? São só sugestões, para a gente ajustar juntos:'));const ul=E('ul');p.forEach(x=>ul.append(E('li','',x)));inv.append(ul,E('p','','Com carinho, Arthur ♡'));
  const a=E('button','exp-btn','Guardar este plano');a.type='button';const r=E('button','exp-btn ghost','Refazer');r.type='button';a.addEventListener('click',()=>{st.textContent=save(K,{choices:p,date:new Date().toISOString()})?'Plano guardado neste navegador ✦':'Não foi possível guardar neste navegador.'});r.addEventListener('click',()=>{pick=[];ask()});inv.append(a,' ',r);st.textContent=saved?'Este é o plano que você guardou antes.':'Convite pronto!'}
 const old=load(K,null);if(old&&Array.isArray(old.choices)&&old.choices.length===3){pick=old.choices.filter(x=>typeof x==='string');show(pick,true)}else ask()}
if(kind==='sonhos'){const K='evangeline-sonhos-v1',form=$('sonhoForm'),ta=$('sonhoText'),g=$('garden'),card=$('sonhoCard'),st=$('sonhoStatus'),sv=$('sonhoSave'),cn=$('sonhoCancel');let items=load(K,[]);if(!Array.isArray(items))items=[];items=items.filter(x=>x&&typeof x.text==='string'&&x.id).slice(0,24);let edit=null,sel=null;
 const svg='<svg viewBox="0 0 60 60" aria-hidden="true"><g fill="#f4e9cf" stroke="#b8924a" stroke-width="1.2"><path d="M30 46Q14 30 30 8Q46 30 30 46Z"/><path d="M30 47Q8 42 6 22Q26 24 30 47Z"/><path d="M30 47Q52 42 54 22Q34 24 30 47Z"/></g><circle cx="30" cy="44" r="4" fill="#d9b25a"/><path d="M30 48v10" stroke="#3e6b4a" stroke-width="2"/></svg>';
 function pos(i){const c=i%6,r=Math.floor(i/6),j=(i*37)%11-5;return[(c+.5)/6*100+j*.6,22+r*24+((i*53)%9)-4]}
 function draw(){[...g.querySelectorAll('.flower')].forEach(e=>e.remove());$('gardenEmpty').hidden=items.length>0;items.forEach((d,i)=>{const b=E('button','flower'+(d.id===sel?' sel':''));b.type='button';b.innerHTML=svg;b.setAttribute('aria-label','Sonho '+(i+1)+': abrir');const[x,y]=pos(i);b.style.left=x+'%';b.style.top=y+'%';b.addEventListener('click',()=>open(d));if(d.fresh)delete d.fresh;g.append(b)})}
 function open(d){sel=d.id;card.hidden=false;card.replaceChildren(E('p','',d.text));const e=E('button','exp-btn ghost','Editar'),a=E('button','exp-btn ghost','Apagar');e.type=a.type='button';
  e.addEventListener('click',()=>{edit=d.id;ta.value=d.text;sv.textContent='Salvar alteração';cn.hidden=false;count();ta.focus()});
  a.addEventListener('click',()=>{card.replaceChildren(E('p','','Apagar este sonho do jardim?'));const y=E('button','exp-btn','Sim, apagar'),n=E('button','exp-btn ghost','Manter');y.type=n.type='button';y.addEventListener('click',()=>{items=items.filter(x=>x.id!==d.id);save(K,items);sel=null;card.hidden=true;st.textContent='Sonho removido do jardim.';draw()});n.addEventListener('click',()=>open(d));card.append(y,' ',n)});card.append(e,' ',a);draw()}
 function count(){$('sonhoCount').textContent=ta.value.length+' / 160'}ta.addEventListener('input',count);
 function reset(){edit=null;ta.value='';sv.textContent='Plantar sonho';cn.hidden=true;count()}cn.addEventListener('click',reset);
 form.addEventListener('submit',ev=>{ev.preventDefault();const t=ta.value.trim();if(!t){st.textContent='Escreva um sonho antes de plantar.';return}
  if(edit){items=items.map(x=>x.id===edit?{...x,text:t}:x);sel=edit;st.textContent='Sonho atualizado ✦'}else{if(items.length>=24){st.textContent='O jardim está cheio. Apague um sonho para plantar outro.';return}const id=(crypto.randomUUID?crypto.randomUUID():String(Date.now()));items.push({id,text:t,date:new Date().toISOString()});sel=id;st.textContent='Uma flor nasceu no jardim ✿'}
  if(!save(K,items))st.textContent='Não foi possível salvar neste navegador.';reset();draw();const d=items.find(x=>x.id===sel);if(d)open(d)});
 draw()}
if(kind==='capsula'){const K='evangeline-capsula-v1',f=$('capForm'),t=$('capText'),dt=$('capDate'),box=$('capSaved'),st=$('capStatus');let cap=load(K,null);if(cap&&typeof cap.text!=='string')cap=null;
 const cnt=()=>{$('capCount').textContent=t.value.length+' / 1200'};t.addEventListener('input',cnt);
 function view(opened){f.hidden=!!cap;box.hidden=!cap;if(!cap){cnt();return}box.replaceChildren(E('h3','','Cápsula guardada ✦'),E('p','',cap.date?'Data sugerida para reler: '+fmt(cap.date)+'.':'Sem data escolhida. Abra quando quiser.'));
  if(opened){const pre=E('pre','',cap.text);box.append(pre);if(cap.date&&cap.date>new Date().toLocaleDateString('en-CA',{timeZone:'America/Sao_Paulo'}))box.append(E('p','','A data sugerida ainda não chegou, mas ela é só uma proposta. Você pode abrir quando o coração pedir.'))}
  const mk=(x,fn,c)=>{const b=E('button','exp-btn'+(c?' ghost':''),x);b.type='button';b.addEventListener('click',fn);return b};
  box.append(mk(opened?'Fechar mensagem':'Abrir mensagem',()=>view(!opened)),' ',mk('Editar',()=>{t.value=cap.text;dt.value=cap.date||'';cap=null;f.hidden=false;box.hidden=true;cnt();t.focus();st.textContent='Edite e guarde de novo. A mensagem anterior só muda quando você guardar.';pending=true},1),' ',mk('Apagar',()=>{if(!confirm('Apagar a mensagem da cápsula?'))return;try{localStorage.removeItem(K)}catch(_){}cap=null;st.textContent='Cápsula apagada.';t.value='';dt.value='';view(false)},1))}
 let pending=false;
 f.addEventListener('submit',e=>{e.preventDefault();const x=t.value.trim();if(!x){st.textContent='Escreva uma mensagem antes de guardar.';return}cap={text:x,date:dt.value||'',saved:new Date().toISOString()};st.textContent=save(K,cap)?'Mensagem guardada neste navegador ✦':'Não foi possível guardar neste navegador.';view(false)});
 view(false)}
})();