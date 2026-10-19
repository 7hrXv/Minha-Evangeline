document.addEventListener('DOMContentLoaded',()=>{
'use strict';
const questions=[
['Qual princesa inspirou este site?',['Tiana','Ariel','Rapunzel'],0],
['Qual é o príncipe da história?',['Louis','Naveen','Ray'],1],
['O que faz uma relação ficar mais forte?',['Nunca conversar','Respeito e diálogo','Só presentes'],1],
['Qual é a ideia deste site?',['Guardar carinho e memórias','Fazer compras','Estudar matemática'],0]
];
const get=id=>document.getElementById(id);
const optionBox=get('romanticOptions'),next=get('romanticNext'),feedback=get('romanticFeedback'),heart=get('romanticHeart');
let current=0,points=0,locked=false;
function paint(){get('romanticScore').textContent=`${points} / ${questions.length}`;get('romanticHeartFill').setAttribute('y',String(110*(1-points/questions.length)));heart.classList.toggle('full',points===questions.length&&current===questions.length);}
function show(){
optionBox.replaceChildren();feedback.textContent='';paint();
if(current===questions.length){get('romanticProgress').textContent='NOSSA HISTÓRIA CONTINUA';get('quizQuestion').textContent=`Você acertou ${points} de ${questions.length} perguntas!`;feedback.textContent=points===questions.length?'Seu coração está completo! Cada lembrança com você é uma estrela na nossa história. ✨':'O que mais importa é o carinho que a gente constrói a cada dia. 💚';next.textContent='Jogar novamente ↻';heart.classList.toggle('full',points===questions.length);return;}
locked=false;const [question,answers]=questions[current];get('romanticProgress').textContent=`PERGUNTA ${current+1} DE ${questions.length}`;get('quizQuestion').textContent=question;next.textContent=current===questions.length-1?'Ver nosso resultado →':'Próxima pergunta →';
answers.forEach((answer,index)=>{const b=document.createElement('button');b.type='button';b.className='romantic-option';b.textContent=answer;b.addEventListener('click',()=>{if(locked)return;locked=true;const correct=index===questions[current][2];if(correct)points++;optionBox.querySelectorAll('button').forEach((btn,j)=>{btn.disabled=true;if(j===questions[current][2])btn.classList.add('correct');if(j===index&&!correct)btn.classList.add('wrong');});feedback.textContent=correct?'✦ Acertou! Mais um pedacinho do nosso coração.':'Quase! A resposta certa está iluminada em dourado.';paint();});optionBox.append(b);});
}
next.addEventListener('click',()=>{if(current===questions.length){current=0;points=0;locked=false;heart.classList.remove('full');show();return;}if(!locked){feedback.textContent='Escolha uma alternativa antes de continuar.';return;}current++;show();});show();
});
