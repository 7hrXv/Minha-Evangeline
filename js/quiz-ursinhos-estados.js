(()=>{'use strict';
const get=id=>document.getElementById(id),yes=get('loveYes'),no=get('loveNo'),retry=get('loveTryAgain'),prompt=get('lovePrompt'),reaction=get('loveReaction'),quiz=get('coupleQuiz'),celebration=get('loveCelebration'),bear=get('loveBear'),still=get('bearStill'),story=document.querySelector('.lovers-story'),frame=document.querySelector('.bear-frame'),nav=document.querySelector('.lovers-navigation'),layer=get('loveFloating'),choices=document.querySelector('.love-choices');
if(!yes||!quiz||!retry||!celebration)return;
const reduced=matchMedia('(prefers-reduced-motion:reduce)'),mobile=matchMedia('(max-width:700px)');
let paused=false,leaving=false;
let state='question',busy=false,current=0,points=0,answered=false,escapes=0,keyboard=false,suppressUntil=0,celebrationTimer,celebrationDue=0,celebrationRemaining=3000;
const questions=window.EvangelineQuizPerguntas.map(q=>[q.pergunta,q.alternativas,q.correta]);
const next=get('romanticNext'),options=get('romanticOptions'),feedback=get('romanticFeedback'),heading=get('quizQuestion'),heart=get('romanticHeart');
const skip=get('quizSkip'),confirm=get('quizSkipConfirm'),resume=get('quizResume'),skipAnyway=get('quizSkipAnyway'),sad=get('sadBear');
const words=['juntos','meu tudo','para sempre','meu amor','✦','❀','♡','✧'];
const particles=Array.from({length:20},(_,i)=>{const p=document.createElement('span');p.className=i<8?'celebration-word':'celebration-confetti';p.textContent=i<8?words[i]:'';p.style.setProperty('--x',(i<8?(i%2?78:2):(8+(i*29)%84))+'%');p.style.setProperty('--size',(i<8?16:7)+'px');p.style.setProperty('--duration',(2.6+i%3*.3)+'s');p.style.setProperty('--delay',(i%5*.08)+'s');p.style.setProperty('--tone',['#6b8a69','#f6edd8','#baa16a'][i%3]);layer.appendChild(p);return p;});
function image(){const file=state==='no'?'urso-bravo':state==='celebration'?'ursos-beijo':'urso-rosas';still.srcset=`assets/ursos/${file}.webp`;bear.src=reduced.matches||document.hidden||state==='quiz'||state==='result'?still.srcset:`assets/ursos/${file}.gif`;bear.alt=state==='no'?'Ursinho fazendo cara de bravo, numa reação divertida':state==='celebration'?'Dois ursinhos se abraçando e se beijando':'Ursinho apaixonado chegando com rosas';document.querySelector('.bear-caption').textContent=state==='celebration'?'o meu tudo, em um abraço':state==='no'?'um biquinho cheio de carinho':'um carinho, só para você';}
function paint(){get('romanticScore').textContent=`${points} / ${questions.length}`;get('romanticHeartFill').setAttribute('y',String(110*(1-points/questions.length)));heart.setAttribute('aria-label',`Coração preenchido em ${points/questions.length*100}%`);heart.classList.toggle('full',points===questions.length);const progress=state==='result'?questions.length:current+(answered?1:0);get('coupleProgress').setAttribute('aria-valuemax',String(questions.length));get('coupleProgress').setAttribute('aria-valuenow',String(progress));get('coupleProgressFill').style.width=(progress/questions.length*100)+'%';}
function showQuestion(){answered=false;options.replaceChildren();feedback.textContent='';paint();get('romanticProgress').textContent=`Pergunta ${current+1} de ${questions.length}`;heading.textContent=questions[current][0];next.textContent=current===questions.length-1?'Ver nosso resultado →':'Próxima pergunta →';next.disabled=true;
 questions[current][1].forEach((text,index)=>{const b=document.createElement('button');b.type='button';b.className='romantic-option';b.textContent=text;b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>{if(state!=='quiz'||answered||busy||paused||leaving)return;answered=true;const correct=index===questions[current][2];if(correct){points++;heart.classList.remove('point-won');void heart.offsetWidth;heart.classList.add('point-won');setTimeout(()=>heart.classList.remove('point-won'),650);}options.querySelectorAll('button').forEach((el,j)=>{el.disabled=true;el.setAttribute('aria-pressed',String(j===index));if(j===questions[current][2])el.classList.add('correct');if(j===index&&!correct)el.classList.add('wrong');});feedback.textContent=correct?'✦ Acertou! Mais um pedacinho do nosso coração.':(current===6&&index===2?'Errou! Só em momentos específicos 🙈':'Quase! A resposta certa está destacada em verde.');next.disabled=false;paint();});options.appendChild(b);});
}
let lastEscape=-Infinity,lastMouse=null;
function resetEscape(){lastEscape=-Infinity;lastMouse=null;escapes=0;suppressUntil=0;no.style.removeProperty('left');no.style.removeProperty('top');}
function scheduleQuiz(){clearTimeout(celebrationTimer);if(document.hidden||state!=='celebration')return;celebrationDue=Date.now()+celebrationRemaining;celebrationTimer=setTimeout(()=>{celebrationRemaining=0;if(state==='celebration')change('quiz');},celebrationRemaining);}
function render(target){clearTimeout(celebrationTimer);state=target;paused=false;confirm.hidden=true;skip.hidden=state!=='quiz';story.dataset.state=state;prompt.hidden=state!=='question';reaction.hidden=state!=='no';celebration.hidden=state!=='celebration';quiz.hidden=state!=='quiz'&&state!=='result';frame.hidden=state==='quiz'||state==='result';nav.hidden=state!=='result';layer.hidden=true;image();
 if(state==='question')resetEscape();
 if(state==='celebration'){celebrationRemaining=3000;layer.hidden=reduced.matches;particles.forEach((p,i)=>p.hidden=mobile.matches&&i>=10);scheduleQuiz();}
 if(state==='quiz')showQuestion();
 if(state==='result'){options.replaceChildren();paint();get('romanticProgress').textContent='Quiz do amor · resultado';heading.textContent=`Você acertou ${points} de ${questions.length} perguntas!`;feedback.textContent=points===questions.length?'Seu coração está completo! Cada lembrança com você é uma estrela na nossa história. ✨':'O que mais importa é o carinho que a gente constrói a cada dia. 💚';next.disabled=false;next.textContent='Jogar novamente ↻';}
}
function change(target,before){if(busy)return;busy=true;yes.disabled=no.disabled=retry.disabled=true;next.disabled=true;
 const commit=()=>{if(before)before();render(target);story.classList.remove('is-switching');};
 const unlock=()=>{busy=false;yes.disabled=no.disabled=retry.disabled=false;const focus=state==='question'?yes:state==='no'?get('loveReactionTitle'):state==='celebration'?get('loveSuccessTitle'):heading;focus.focus({preventScroll:true});};
 if(reduced.matches){commit();setTimeout(unlock,180);return;}story.classList.add('is-switching');setTimeout(commit,140);setTimeout(unlock,340);
}
function flee(event){
 const touch=event.type==='pointerdown'&&event.pointerType!=='mouse';
 if(touch)keyboard=false;
 if(state!=='question'||busy||keyboard||escapes>=30)return false;
 if(event.type==='pointerenter'&&event.pointerType!=='mouse')return false;
 if(event.type==='pointerdown'&&!touch)return false;
 const now=Date.now();if(now-lastEscape<300)return false;
 if(!touch&&lastMouse&&Math.hypot(event.clientX-lastMouse.x,event.clientY-lastMouse.y)<18)return false;
 const w=choices.clientWidth,h=choices.clientHeight,bw=no.offsetWidth,bh=no.offsetHeight;
 const minX=6,maxX=w-bw-6,minY=yes.offsetHeight+16,maxY=h-bh-6;
 if(maxX<minX||maxY<minY)return false;
 let x=minX+(maxX-minX)*(((escapes+1)*.61803398875)%1);
 const y=minY+(maxY-minY)*(((escapes+1)*.41421356237)%1);
 const oldX=parseFloat(no.style.left),oldY=parseFloat(no.style.top);
 if(Number.isFinite(oldX)&&Math.hypot(x-oldX,y-oldY)<35)x=minX+maxX-x;
 no.style.left=x+'px';no.style.top=y+'px';escapes++;lastEscape=now;
 if(!touch)lastMouse={x:event.clientX,y:event.clientY};
 if(touch){event.preventDefault();suppressUntil=now+450;}
 return true;
}
no.addEventListener('pointerenter',flee);no.addEventListener('pointerdown',flee);
document.addEventListener('keydown',e=>{if(['Tab','Enter',' '].includes(e.key))keyboard=true;});document.addEventListener('pointerdown',()=>{keyboard=false;},{passive:true});
window.addEventListener('resize',()=>{if(state!=='question'||escapes===0)return;const w=choices.clientWidth,h=choices.clientHeight;no.style.left=Math.max(6,Math.min(w-no.offsetWidth-6,parseFloat(no.style.left)||6))+'px';no.style.top=Math.max(yes.offsetHeight+16,Math.min(h-no.offsetHeight-6,parseFloat(no.style.top)||0))+'px';});
yes.addEventListener('click',()=>{if(state==='question')change('celebration',()=>{current=0;points=0;answered=false;});});
no.addEventListener('click',e=>{if(e.detail===0)suppressUntil=0;if(state==='question'&&Date.now()>=suppressUntil)change('no');});
retry.addEventListener('click',()=>{if(state==='no')change('question');});
next.addEventListener('click',()=>{if(busy||paused||leaving)return;if(state==='result'){change('quiz',()=>{current=0;points=0;answered=false;});return;}if(state!=='quiz'||!answered)return;change(current===questions.length-1?'result':'quiz',()=>current++);});
function sadImage(active){sad.src=active&&!reduced.matches&&!document.hidden?'assets/ursos/urso-triste-animado.gif':'assets/ursos/urso-triste-animado.webp';}
skip.addEventListener('click',()=>{if(state!=='quiz'||busy||paused||leaving)return;paused=true;quiz.hidden=true;confirm.hidden=false;sadImage(true);get('skipQuizTitle').focus({preventScroll:true});});
function resumeQuiz(){if(!paused||leaving)return;paused=false;confirm.hidden=true;sadImage(false);quiz.hidden=false;skip.focus({preventScroll:true});}
resume.addEventListener('click',resumeQuiz);
confirm.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();resumeQuiz();}});
skipAnyway.addEventListener('click',()=>{if(!paused||leaving)return;leaving=true;skipAnyway.disabled=true;resume.disabled=true;clearTimeout(celebrationTimer);sadImage(false);const destination=nav.querySelector('a:last-child').getAttribute('href');location.assign(destination);});
function sync(){sadImage(paused);document.body.classList.toggle('effects-paused',document.hidden);image();if(state==='celebration'){if(document.hidden){celebrationRemaining=Math.max(0,celebrationDue-Date.now());clearTimeout(celebrationTimer);}else scheduleQuiz();}if(reduced.matches)layer.hidden=true;}
document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);bear.addEventListener('error',()=>bear.hidden=true);bear.addEventListener('load',()=>bear.hidden=false);render('question');
})();
