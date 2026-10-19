document.addEventListener('DOMContentLoaded', () => {
  const chapters = [
    { kicker:'ONDE TUDO FLORESCE', title:'O começo de algo bonito', text:'Às vezes, alguém chega e deixa o mundo um pouquinho mais bonito. Você se tornou uma das partes mais especiais dos meus dias.', quote:'“Entre tantas possibilidades, meu coração gosta de encontrar você.”', caption:'Sob as luzes do bayou ✦', icon:'✧' },
    { kicker:'AS PEQUENAS COISAS', title:'Detalhes que viram lembranças', text:'Uma conversa, uma risada, uma mensagem inesperada… são os pequenos momentos que acabam ocupando um espaço enorme no coração.', quote:'“A felicidade também mora nas coisas simples — principalmente quando são com você.”', caption:'Pequenos momentos, grandes memórias', icon:'❀' },
    { kicker:'O QUE É NOSSO', title:'Escolher caminhar juntos', text:'Uma história bonita não precisa ser perfeita. Ela cresce com carinho, respeito, sinceridade e vontade de entender um ao outro até nos dias complicados.', quote:'“Amar também é aprender, cuidar e escolher ficar por perto.”', caption:'Que a gente continue florescendo', icon:'♡' },
    { kicker:'TUDO QUE AINDA VEM', title:'Ainda temos muito para viver', text:'Quero colecionar novos lugares, novas fotos, piadas que só nós entendemos e lembranças que um dia vamos contar sorrindo.', quote:'“Meu capítulo favorito é aquele que ainda vamos escrever.”', caption:'O melhor ainda pode estar por vir', icon:'✦' },
    { kicker:'PARA MINHA EVANGELINE', title:'Você é parte da minha história', text:'Mirella, este pequeno cantinho é uma forma de guardar um pouco do carinho que sinto por você. Que ele te lembre o quanto você é importante para mim.', quote:'“Se eu pudesse escolher de novo, ainda gostaria de encontrar você.”', caption:'Com amor, hoje e sempre ♡', icon:'♥' }
  ];
  let current = 0;
  const $ = id => document.getElementById(id);
  const copy = $('memoryCopy');
  function render() {
    const c = chapters[current];
    $('chapterLabel').textContent = `CAPÍTULO ${String(current + 1).padStart(2, '0')}`;
    $('chapterCount').textContent = `${String(current + 1).padStart(2, '0')} / ${String(chapters.length).padStart(2, '0')}`;
    $('chapterProgress').style.width = `${((current + 1) / chapters.length) * 100}%`;
    $('memoryKicker').textContent = c.kicker;
    $('memoryTitle').textContent = c.title;
    $('memoryText').textContent = c.text;
    $('memoryQuote').textContent = c.quote;
    $('artCaption').textContent = c.caption;
    $('chapterIcon').textContent = c.icon;
    $('storyPrev').disabled = current === 0;
    $('storyNext').textContent = current === chapters.length - 1 ? 'Ver surpresa final ♡' : 'Próximo capítulo →';
    $('stageDots').innerHTML = '';
    chapters.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button'; dot.className = `stage-dot${i === current ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Ir para capítulo ${i + 1}`);
      dot.addEventListener('click', () => { current = i; render(); });
      $('stageDots').appendChild(dot);
    });
    copy.classList.remove('chapter-enter');
    void copy.offsetWidth;
    copy.classList.add('chapter-enter');
  }
  $('storyPrev').addEventListener('click', () => { if (current > 0) { current--; render(); } });
  $('storyNext').addEventListener('click', () => {
    if (current < chapters.length - 1) { current++; render(); }
    else { $('finalSurprise').hidden = false; $('finalSurprise').scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  });
  $('revealSurprise').addEventListener('click', () => {
    $('surpriseLetter').hidden = false;
    $('revealSurprise').textContent = 'Surpresa aberta ♡';
    $('revealSurprise').disabled = true;
    $('surpriseLetter').scrollIntoView({ behavior: 'smooth', block: 'center' });
    for (let i = 0; i < 18; i++) {
      const spark = document.createElement('span'); spark.className = 'surprise-spark'; spark.textContent = ['✦','♡','✧'][i % 3];
      spark.style.left = `${Math.random() * 100}%`; spark.style.setProperty('--delay', `${Math.random() * .8}s`);
      $('finalSurprise').appendChild(spark); setTimeout(() => spark.remove(), 2600);
    }
  });
  $('restartStory').addEventListener('click', () => {
    current = 0; render(); $('finalSurprise').hidden = true; $('surpriseLetter').hidden = true;
    $('revealSurprise').disabled = false; $('revealSurprise').textContent = 'Abrir minha surpresa ✨';
    document.querySelector('.retrospective-heading').scrollIntoView({ behavior: 'smooth' });
  });
  $('couplePhoto').addEventListener('change', event => {
    const file = event.target.files && event.target.files[0]; if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader(); reader.onload = e => {
      $('memoryImage').src = e.target.result;
      $('artCaption').textContent = 'Uma lembrança de vocês ♡';
      $('memoryArt').classList.add('has-couple-photo');
    }; reader.readAsDataURL(file);
  });
  render();
});
