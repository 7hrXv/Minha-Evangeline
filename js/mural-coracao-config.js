/* Configuração da sequência. youtubeId identifica o vídeo oficial, nunca um MP3.
   Tempos em segundos acompanham a reprodução real do player.
   Substitua SOMENTE as frases abaixo pela letra que você fornecer e ajustar.
   Os exemplos são mensagens originais, não a letra de uma música.
   audio: arquivo local opcional da mesma canção (ex.: assets/audio/nossa-musica.mp3).
   Quando fornecido, o player oferece reprodução dentro do site. A configuração fica em personalizacao/config-musica.js.
   Com YouTube, as fotos são reveladas ao terminar o vídeo ou pelo botão dedicado.
   inicio e duracao controlam quando cada frase aparece e por quanto tempo.
   As imagens usam object-fit:contain: aparecem inteiras, sem recortar rostos. */
window.MuralCoracaoConfig={
 youtubeId:window.EvangelineMusica?.videoId||'QW0i1U4u0KE',audio:window.EvangelineMusica?.arquivo||'',volume:window.EvangelineMusica?.volume??.5,
 frases:window.EvangelineLetra?.trechos||[],
 mensagemFinal:window.EvangelineLetra?.dedicatoria||'Mirella, este momento é nosso. Ouve comigo, sem pressa.',
 fotos:[
  {src:'assets/images/nos-dois.webp',proporcao:1.7777778,legenda:'Mirella, eu escolheria dividir a vida com você.'},
  {src:'assets/images/abraco-juntos.webp',proporcao:1.7777778,legenda:'Se eu pudesse guardar um lugar, seria no seu abraço.'},
  {src:'assets/images/beijo-carinho.webp',proporcao:1.7777778,legenda:'O meu carinho por você cabe nos pequenos gestos.'},
  {src:'assets/images/selfie-juntos.webp',proporcao:0.5625000,legenda:'Nós dois, do jeitinho que eu gosto de lembrar.'},
  {src:'assets/images/sorrisos-juntos.webp',proporcao:0.5625000,legenda:'Que eu continue sendo motivo desse sorriso.'}
 ],intervaloFotos:1.1
};
