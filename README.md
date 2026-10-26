# Minha Evangeline — Edição Cenográfica

Um presente de Arthur para Mirella. HTML, CSS e JavaScript, sem etapa de compilação.

## Abrir

Extraia a pasta e use INICIAR_SITE.bat (Windows com Python) ou Live Server no VS Code. Abra index.html por HTTP/HTTPS. A senha é **2110**. Abrir diretamente por file:// pode impedir o YouTube de receber a identificação necessária.

## Caminho da história

1. entrada.html — convite e senha.
2. boas-vindas.html — apresentação com fotos.
3. retrospectiva.html — álbum com 14 fotografias e ampliação.
4. cartas.html — carta principal e seis envelopes.
5. historia.html — roleta de momentos.
6. contador.html — ursinhos, celebração e quiz com 15 perguntas.
7. jogo-memoria.html — jogo da memória com 6 pares de fotos, sorteadas a cada partida.
8. jogo-vagalumes.html — pegue os vaga-lumes em 30 segundos para acender uma estrela.
9. jogo-quebra-cabeca.html — quebra-cabeça deslizante 3×3 (sempre solucionável), com reiniciar, outra foto e ver foto.
10. mural.html — coração de quatro peças, sala de música e fotos.
11. bau.html — mural de recados com adicionar, editar, excluir e exportar.
12. final.html — árvore, declaração e contador desde 21/10/2025.

Nos jogos, "Continuar" fica sempre disponível: dá para seguir sem vencer. O "Continuar" da roleta e da carta também aparece desde a entrada.

O botão **Ver páginas 💚** aparece depois da senha (js/menu-paginas.js, css/menu-paginas.css), lista as 12 páginas a partir de js/site-config.js, destaca a atual e fecha ao escolher. As fotos dos jogos vêm de js/jogos-fotos.js.

As páginas quiz.html e memorias.html são apenas compatibilidade com os destinos antigos. index.html preserva uma única instância da trilha global entre os capítulos.

## Distribuição dos personagens

Os 20 recortes existentes foram reposicionados em títulos, margens do álbum, laterais das interações e aberturas de seções. Nenhum permanece no bloco decorativo inferior. Não foram acrescentados personagens ou alterados os arquivos das imagens. Os espaços se reorganizam no celular. Detalhes em personalizacao/personagens-posicoes.md e estilos em css/personagens-composicao.css.

## Novidades desta edição

- Dedicatórias no próprio papel da polaroid, com caligrafia legível, assinatura, pequenos ornamentos e entrada após a foto; sem a faixa verde.
- Novas poses de Tiana, Naveen, sapinhos, Ray e Louis, sem repetir o mesmo recorte na mesma página. Bases e sombras de contato apoiam os personagens; apenas Ray flutua.
- Mais objetos locais de papelaria, livros, partituras e fotografia, em composições distintas.
- Dez cenários sem textura pontilhada, com versões adaptadas para celular. Fundo contínuo de ponta a ponta e área interna de leitura transparente.
- Efeitos distribuídos pela janela inteira e reutilizados durante a rolagem: 44 elementos no computador, 20 no celular, ou oito estrelas estáticas com movimento reduzido. Rajadas usam uma parte reservada do mesmo conjunto. Pausa com a página oculta e sem efeitos sobre as áreas ocupadas pelo conteúdo.
- Leitor de trechos sincronizado com o tempo real do player, incluindo pausa e busca para frente/trás. Nenhuma letra foi fornecida, portanto o arquivo de personalização vem sem trechos; a dedicatória visível é original, não letra.

Camadas finais: css/refino-cenografico.css, css/cenarios-vivos.css e js/cenarios-vivos.js. Textos e tempos da letra em personalizacao/letra-musica.js. As demais camadas preservam a navegação e as funcionalidades anteriores.

## Música atual

**Oração — A Banda Mais Bonita da Cidade, com Leo Fressato**, vídeo QW0i1U4u0KE, escolhido pelo Arthur. O ID antigo foi retirado da integração. Player oficial visível com controles, reprodução/pausa, som e volume; vinil sincronizado exclusivamente com estado PLAYING real, parado em pausa, buffering, fim ou erro. A trilha de fundo é suspensa antes da tentativa de play e durante o buffering.

A página do vídeo e a prévia oficial de incorporação abriram no teste público. Após clicar na prévia, o navegador permaneceu em 0:00, readyState 0, sem erro de mídia. Isso não confirma reprodução e não comprova proibição de incorporação pelo autor. A reprodução no aparelho do Arthur ou hospedagem final não pôde ser verificada.

Se o serviço falhar, o player quebrado é recolhido e permanece o link da mesma faixa no YouTube. Não há reprodução simulada. Não há arquivo MP3 incluído. Para áudio local autorizado da mesma faixa, configure personalizacao/config-musica.js; a configuração não aparece para a Mirella. Detalhes em personalizacao/LEIA-ME.md.

## Dados e personalização

Os recados continuam nas chaves minha-evangeline-mural-carinho-v1 e evangelineMessages, sem limpeza ou migração destrutiva. O armazenamento pertence ao navegador e à origem; um ZIP não transporta recados salvos somente em outro aparelho.

- js/site-config.js: sequência e trilha global opcional.
- js/quiz-perguntas.js: quinze perguntas e respostas, pontuação e coração em quinze passos.
- js/mural-coracao-config.js: mensagens originais, tempos e fotos da sequência, sem atribuí-las à letra da música.
- cartas.html e final.html: mensagens pessoais.
