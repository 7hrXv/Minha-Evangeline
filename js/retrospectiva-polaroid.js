const chapters=[
  {
    "title": "O encanto de você",
    "text": "Tem gente que chega e muda o jeito como a gente vê o mundo. Você trouxe luz aos meus dias.",
    "photos": [
      0,
      13,
      5
    ]
  },
  {
    "title": "Nós dois",
    "text": "Entre sorrisos, conversas e momentos simples, fomos criando nossas melhores lembranças.",
    "photos": [
      1,
      8,
      9,
      3
    ]
  },
  {
    "title": "De mãos dadas",
    "text": "O meu lugar favorito é onde a sua mão encontra a minha. Que a gente siga assim.",
    "photos": [
      2,
      10,
      11
    ]
  },
  {
    "title": "Cada detalhe seu",
    "text": "Seu sorriso, seu carinho e a maneira como você faz tudo ficar mais bonito: eu guardo cada detalhe.",
    "photos": [
      14,
      12,
      4
    ]
  },
  {
    "title": "O nosso para sempre",
    "text": "Essa história ainda tem muitas páginas pela frente. E eu quero escrever cada uma com você.",
    "photos": [
      6,
      7,
      1
    ]
  }
];
const photos=[
  {
    "src": "assets/images/mirella.jpg",
    "alt": "Retrato especial da Mirella",
    "caption": "Meu amor ♡"
  },
  {
    "src": "assets/images/nos-dois.webp",
    "alt": "Foto do casal juntos",
    "caption": "Nós dois ♡"
  },
  {
    "src": "assets/images/nossas-maos.webp",
    "alt": "Foto das mãos do casal",
    "caption": "De mãos dadas ♡"
  },
  {
    "src": "assets/images/passeio-juntos.webp",
    "alt": "Foto do casal durante um passeio",
    "caption": "Nosso passeio ♡"
  },
  {
    "src": "assets/images/selfie-juntos.webp",
    "alt": "Selfie do casal",
    "caption": "Juntinhos ♡"
  },
  {
    "src": "assets/images/mirella-filtro.webp",
    "alt": "Selfie divertida da Mirella com filtro",
    "caption": "Seu jeitinho ♡"
  },
  {
    "src": "assets/images/montagem-nossa.webp",
    "alt": "Lembrança especial do casal",
    "caption": "Momentos nossos ♡"
  },
  {
    "src": "assets/images/filtro-cachorrinho.webp",
    "alt": "Lembrança especial do casal",
    "caption": "Nossas brincadeiras ♡"
  },
  {
    "src": "assets/images/sorrisos-juntos.webp",
    "alt": "Lembrança especial do casal",
    "caption": "Nossos sorrisos ♡"
  },
  {
    "src": "assets/images/caretas-juntos.jpg",
    "alt": "Lembrança especial do casal",
    "caption": "Nosso jeitinho ♡"
  },
  {
    "src": "assets/images/beijo-carinho.webp",
    "alt": "Lembrança especial do casal",
    "caption": "Um carinho só nosso ♡"
  },
  {
    "src": "assets/images/abraco-juntos.webp",
    "alt": "Lembrança especial do casal",
    "caption": "Sempre pertinho ♡"
  },
  {
    "src": "assets/images/beijo-na-testa.webp",
    "alt": "Lembrança especial do casal",
    "caption": "Meu lugar favorito ♡"
  },
  {
    "src": "assets/images/sorriso-mirella.webp",
    "alt": "Lembrança especial do casal",
    "caption": "Seu sorriso ♡"
  },
  {
    "src": "assets/images/foto-fofinha.webp",
    "alt": "Lembrança especial do casal",
    "caption": "Você e eu ♡"
  }
];
let current=0;
const $=id=>document.getElementById(id);
function render(){
 const ch=chapters[current];
 $('retroCount').textContent=String(current+1).padStart(2,'0')+" / "+String(chapters.length).padStart(2,'0');
 $('retroTitle').textContent=ch.title;$('retroText').textContent=ch.text;
 $('retroPhotos').innerHTML=ch.photos.map((i,k)=>`<figure class="hanging-polaroid" role="button" tabindex="0" aria-label="Ampliar foto: ${photos[i].caption}" data-photo="${k}" style="--angle:${k%2===0?-5:5}deg;--delay:${k*0.12}s"><span class="clip" aria-hidden="true"></span><img src="${photos[i].src}" alt="${photos[i].alt}"><figcaption>${photos[i].caption}</figcaption></figure>`).join('');
 $('retroPhotos').querySelectorAll('.hanging-polaroid').forEach(el=>{const open=()=>showPhoto(Number(el.dataset.photo));el.addEventListener('click',open);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}})});
 $('retroDots').innerHTML=chapters.map((_,i)=>`<button type="button" class="${i===current?'active':''}" aria-label="Ir para capítulo ${i+1}" data-index="${i}"></button>`).join('');
 $('retroDots').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{current=Number(b.dataset.index);render()}));
 $('retroPrev').disabled=current===0;
 $('retroNext').disabled=current===chapters.length-1;
 $('retroSurprise').hidden=current!==chapters.length-1;
}
$('retroPrev').addEventListener('click',()=>{if(current>0){current--;render()}});
$('retroNext').addEventListener('click',()=>{if(current<chapters.length-1){current++;render()}});
$('openSurprise').addEventListener('click',()=>{$('surpriseMessage').hidden=false;$('openSurprise').hidden=true});
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'&&current<chapters.length-1){current++;render()}if(e.key==='ArrowLeft'&&current>0){current--;render()}});
render();
let activePhoto=0;
function showPhoto(index){const items=chapters[current].photos;activePhoto=(index+items.length)%items.length;const photo=photos[items[activePhoto]];$('lightboxImage').src=photo.src;$('lightboxImage').alt=photo.alt;$('lightboxCaption').textContent=photo.caption;$('retroLightbox').hidden=false;document.body.style.overflow='hidden';$('lightboxClose').focus()}
function closePhoto(){$('retroLightbox').hidden=true;document.body.style.overflow=''}
$('lightboxClose').addEventListener('click',closePhoto);
$('lightboxPrev').addEventListener('click',()=>showPhoto(activePhoto-1));
$('lightboxNext').addEventListener('click',()=>showPhoto(activePhoto+1));
$('retroLightbox').addEventListener('click',e=>{if(e.target===$('retroLightbox'))closePhoto()});
document.addEventListener('keydown',e=>{if(!$('retroLightbox').hidden){if(e.key==='Escape')closePhoto();if(e.key==='ArrowLeft'){e.stopImmediatePropagation();showPhoto(activePhoto-1)}if(e.key==='ArrowRight'){e.stopImmediatePropagation();showPhoto(activePhoto+1)}}},true);
