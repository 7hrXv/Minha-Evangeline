
document.addEventListener('DOMContentLoaded',()=>{
const questions=[['Qual princesa inspirou este site?',['Tiana','Ariel','Rapunzel'],0],['Qual é o príncipe da história?',['Louis','Naveen','Ray'],1],['O que faz uma relação ficar mais forte?',['Nunca conversar','Respeito e diálogo','Só presentes'],1],['Qual é a ideia deste site?',['Guardar carinho e memórias','Fazer compras','Estudar matemática'],0]];
let qi=0,score=0,answered=false;
const $=id=>document.getElementById(id), options=$('quizOptions'),next=$('quizNext');
function update(){ $('scoreDisplay').textContent=`${score} / ${questions.length} pontos`; $('heartFill').setAttribute('y',String(92*(1-score/questions.length)));if(score===questions.length)document.querySelector('.ev-heart').classList.add('perfect');else document.querySelector('.ev-heart').classList.remove('perfect'); }
function render(){update();options.replaceChildren();$('quizFeedback').textContent='';if(qi===questions.length){$('quizCount').textContent='QUIZ CONCLUÍDO';$('quizQuestion').textContent=`Você fez ${score} de ${questions.length} pontos!`;next.textContent='Jogar novamente';return;}
answered=false;let q=questions[qi];$('quizCount').textContent=`PERGUNTA ${qi+1} DE ${questions.length}`;$('quizQuestion').textContent=q[0];next.textContent=qi===questions.length-1?'Ver resultado →':'Próxima pergunta →';
q[1].forEach((label,i)=>{let b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',()=>{if(answered)return;answered=true;options.querySelectorAll('button').forEach(x=>x.disabled=true);if(i===q[2]){score++;b.classList.add('chosen');$('quizFeedback').textContent='✦ Você acertou!';}else{$('quizFeedback').textContent='Quase! A resposta certa era: '+q[1][q[2]];}update();});options.appendChild(b);});}
next.addEventListener('click',()=>{if(qi===questions.length){qi=0;score=0;render();return;}if(!answered){$('quizFeedback').textContent='Escolha uma resposta primeiro.';return;}qi++;render();});render();
const answer=$('heartAnswer');try{answer.value=localStorage.getItem('evangelineHeartAnswer')||'';}catch{}
$('heartSave').addEventListener('click',()=>{try{localStorage.setItem('evangelineHeartAnswer',answer.value);$('heartSaveFeedback').textContent='Resposta guardada neste navegador.';}catch{$('heartSaveFeedback').textContent='Não foi possível salvar agora.';}});
});
