(()=>{'use strict';
if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
const body=document.body;
if(!body.classList.contains('chapter')||body.matches('.final-page,.secret-entry,.puzzle-mural-page,.game-page'))return;
const main=document.querySelector('.chapter-main');if(!main)return;
const items=[...main.querySelectorAll(':scope>*,.love-prompt>:not(noscript):not(.love-answer)')].filter(el=>{
 if(el.matches('.cast-chapter-heading,.chapter-heading,.recados-moldura,script,style'))return false;
 const cs=getComputedStyle(el);
 return cs.display!=='contents'&&cs.animationName==='none'&&!el.closest('.reveal-pending,.reveal-entered');
});
items.forEach((el,i)=>{
 el.style.setProperty('--seq-delay',(.25+Math.min(i,6)*.12)+'s');
 el.classList.add('seq-in');
 el.addEventListener('animationend',e=>{if(e.target===el)el.classList.remove('seq-in')},{once:true});
});
})();
