# Música — personalização do Arthur

Vídeo atual: Oração — A Banda Mais Bonita da Cidade (com Leo Fressato), ID `QW0i1U4u0KE`, https://www.youtube.com/watch?v=QW0i1U4u0KE . Substitui Baby95 por solicitação do Arthur.

O player oficial tem controles, volume e fallback para o YouTube. Use o Live Server, INICIAR_SITE.bat ou hospedagem HTTP/HTTPS. O vinil só gira após o estado PLAYING real do player, parando em pausa, buffering, fim e erro. A trilha global é suspensa antes da tentativa de reprodução e no buffering.

Verificação em 22/10/2026: a página oficial abriu, identificou a faixa e ofereceu Compartilhar → Incorporar, com prévia e código de embed. A prévia aceitou o clique, mas o navegador de teste permaneceu em 0:00, readyState 0, sem erro de mídia. Não é evidência de bloqueio pelo autor, nem comprova reprodução completa. Não foi possível confirmar no aparelho do Arthur ou na hospedagem final, que não foi informada.

Se houver erro 101/150, o autor bloqueou a incorporação; 100 indica vídeo indisponível; 153 indica ausência de Referer/identificação do cliente. O projeto inclui origem e política de Referer adequadas em HTTP/HTTPS. O iframe quebrado é recolhido e o link da mesma faixa permanece disponível.

Opcional: coloque seu arquivo de áudio autorizado desta faixa em assets/audio/oracao.mp3 e informe `arquivo` em config-musica.js. Não há MP3 no projeto e nenhuma reprodução é simulada. A área de personalização não aparece na experiência da Mirella.

## Letra sincronizada

Edite `personalizacao/letra-musica.js`. `trechos` é uma lista de objetos com `texto`, `inicio` e `duracao` (tempos em segundos do vídeo). Insira somente a letra fornecida por você. A lista está vazia porque a letra ainda não foi enviada. As mensagens românticas anteriormente usadas como exemplo não foram apresentadas como letra.

O leitor consulta o relógio real do player a cada 150 ms; não tem uma linha do tempo independente. Ao pausar, a frase se mantém; ao buscar outro ponto, ela acompanha o tempo. Nas lacunas entre trechos aparece apenas um ornamento. Depois do último trecho há uma dedicatória original. Texto e duração não provocam fim prematuro do vídeo. Sem trechos, a área exibe somente a dedicatória, sem inventar letra.
