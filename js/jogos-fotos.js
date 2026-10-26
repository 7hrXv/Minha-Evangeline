/* Fotos já existentes do site, reutilizadas pelos jogos. r = altura/largura. */
window.EvangelineFotos=[
{src:'assets/images/nos-dois.webp',r:720/1280,f:.4,alt:'Arthur e Mirella juntos'},
{src:'assets/images/beijo-carinho.webp',r:720/1280,f:.4,alt:'Um beijo carinhoso'},
{src:'assets/images/foto-quebra-cabeca-nova.jpg',r:158/338,f:.5,alt:'Arthur e Mirella juntos'},
{src:'assets/images/abraco-juntos.webp',r:1280/720,f:.3,alt:'Um abraço apertado'},
{src:'assets/images/caretas-juntos.webp',r:1200/900,f:.3,alt:'Caretas de Arthur e Mirella'},
{src:'assets/images/sorrisos-juntos.webp',r:1280/720,f:.3,alt:'Sorrisos juntos'},
{src:'assets/images/passeio-juntos.webp',r:1280/720,f:.3,alt:'Passeio de Arthur e Mirella'},
{src:'assets/images/nossas-maos.webp',r:924/694,f:.5,alt:'Nossas mãos'},
{src:'assets/images/foto-fofinha.webp',r:1280/720,f:.3,alt:'Uma foto fofinha dos dois'},
{src:'assets/images/montagem-nossa.webp',r:1280/720,f:.3,alt:'Montagem de Arthur e Mirella'}
];
window.EvangelineJogos={
 embaralhar(lista){const a=lista.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a},
 reduzido:matchMedia('(prefers-reduced-motion:reduce)').matches
};
