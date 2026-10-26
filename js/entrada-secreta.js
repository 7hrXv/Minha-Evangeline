(()=>{'use strict';
if(new URLSearchParams(location.search).has('bloquear')){try{sessionStorage.removeItem('evangeline-session-unlocked');}catch(e){}}
const code=document.getElementById('secretCode'),form=document.getElementById('secretForm'),status=document.getElementById('entryStatus'),slots=[...document.querySelectorAll('.entry-digit')],keys=document.querySelectorAll('[data-digit]'),del=document.getElementById('entryDelete');let busy=false;
const update=()=>{const value=code.value.replace(/\D/g,'').slice(0,4);if(code.value!==value)code.value=value;slots.forEach((el,i)=>{el.textContent=i<value.length?'✦':'✧';el.classList.toggle('filled',i<value.length);});};
const message=(text,type='')=>{status.textContent=text;status.className='entry-status '+type;code.setAttribute('aria-invalid',String(type==='error'));};
const add=digit=>{if(busy)return;code.value=(code.value+digit).slice(0,4);message('');update();};
keys.forEach(b=>b.addEventListener('click',()=>add(b.dataset.digit)));
del?.addEventListener('click',()=>{if(busy)return;code.value=code.value.slice(0,-1);message('');update();});
code.addEventListener('input',()=>{message('');update();});
document.addEventListener('keydown',e=>{if(busy||e.ctrlKey||e.altKey||e.metaKey)return;if(e.key==='Backspace'){if(document.activeElement!==code){e.preventDefault();code.value=code.value.slice(0,-1);update();}}else if(/^[0-9]$/.test(e.key)&&document.activeElement!==code){e.preventDefault();add(e.key);}else if(e.key==='Enter'&&document.activeElement!==code){e.preventDefault();form.requestSubmit();}});
form.addEventListener('submit',e=>{e.preventDefault();if(busy)return;update();if(code.value==='2110'){busy=true;try{sessionStorage.setItem('evangeline-session-unlocked','yes');}catch(err){busy=false;message('O navegador bloqueou o armazenamento da sessão. Ative-o para continuar.','error');return;}message('A magia começa com você, Mirella.','success');const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
const overlay=document.getElementById('entryUnlock');overlay.setAttribute('aria-hidden','false');
form.querySelectorAll('button,input').forEach(el=>el.disabled=true);
document.body.classList.add('is-unlocking');
try{sessionStorage.setItem('evangeline-arrival-fade','yes');}catch(err){}
const destination=new URL('boas-vindas.html',location.href).href;
setTimeout(()=>document.body.classList.add('is-departing'),reduced?500:2600);
setTimeout(()=>location.replace(destination),reduced?900:3000);}else{message('Esse não é o nosso segredo… tente outra vez.','error');code.value='';update();}});
document.addEventListener('visibilitychange',()=>document.body.classList.toggle('entry-effects-paused',document.hidden));
function resetEntry(){
 busy=false;code.value='';message('');update();
 document.body.classList.remove('is-unlocking','is-departing');
 document.getElementById('entryUnlock').setAttribute('aria-hidden','true');
 form.querySelectorAll('button,input').forEach(el=>el.disabled=false);
 if(new URLSearchParams(location.search).has('bloquear')){try{sessionStorage.removeItem('evangeline-session-unlocked');sessionStorage.removeItem('evangeline-arrival-fade');}catch(e){}}
}
resetEntry();
document.defaultView?.addEventListener('pageshow',resetEntry);
})();