# EcoFoz — Descarte certo em Foz do Iguaçu

Projeto escolar estático. Extraia o ZIP e mantenha index.html, style.css, script.js e README.md juntos. Abra index.html no navegador ou abra a pasta no VS Code e use Live Server. No GitHub, envie os quatro arquivos à raiz da branch main; em Settings > Pages, escolha Deploy from a branch > main > / (root). Abra a URL publicada, não a página de código do repositório.

## Funcionamento
14 materiais, 16 endereços documentados (incluindo cadastros históricos), três com coordenadas publicadas por fonte cartográfica de terceiros. Os demais aparecem somente na lista, com rota por endereço. As farmácias de pilhas aparecem em roxo e a de medicamentos em rosa. Não confunda ponto listado com serviço atualmente confirmado. A localização do usuário é opcional, depende do navegador e de contexto seguro (HTTPS ou localhost); distâncias em linha reta apenas para pontos com GPS.

Leaflet 1.9.4 é carregado por CDN (jsDelivr, com alternativa unpkg para JS); mapa OpenStreetMap, fontes e imagens originais dependem de internet. Não há backend, chave, instalação ou build. Não foi possível baixar dependências para empacotar localmente, nem verificar disponibilidade das imagens remotas. Se mapa falhar, lista, filtros e guia permanecem disponíveis. Links de rota exigem internet. Busca procura dados cadastrados, não geocodifica qualquer endereço.

## Fontes e manutenção
Consulta documental: 24/11/2026. Não houve confirmação telefônica nem visita. Cada registro em POINTS, no script.js, contém fonte de descarte e, quando disponível, fonte GPS e fonte complementar. Só acrescente lat/lng depois de verificar a correspondência com o endereço. Horários desconhecidos não geram indicação de aberto/fechado.

- Recicla Pilhas: https://sistema.gmclog.com.br/info/green?page=23&sf242398615=1
- LogMed: https://www.logmed.org.br/arquivos/atuais/pontos-de-descarte-29-04-2025.pdf (cadastro histórico); https://logmed.org.br/onde-descartar
- LixoTec: https://projetolixotec.com.br/ (coleta agendada; confirme entrega presencial).
- UVRs: https://cgn.inf.br/noticia/767895/moradores-de-foz-podem-descartar-materiais-inertes-em-quatro-uvrs (publicação municipal reproduzida em 2022; confirme vigência dos ecopontos para entulho e móveis).
- Coleta seletiva: https://www.google.com/maps/d/viewer?mid=1rAIoETLpyKsas0lupKjdEzwjglB1OFyr ; WhatsApp (45) 3308-2163 informado em notícia de 2026. Papel, papelão, vidro de embalagens, plástico e metal não são entulho. Óleo vegetal: coleta divulgada anteriormente; confirme orientação atual.
- Óleo Ponto: https://www.destino.foz.br/novas-tecnologias-do-programa-vila-a-inteligente-sao-instaladas-em-foz-do-iguacu/ (2022, continuidade não confirmada).
- Green Eletron, Reciclus e Reciclanip: localizadores indicados no site; não foi possível confirmar endereços específicos de lâmpadas, pneus ou doações de roupas.

## Validação
Sintaxe JavaScript verificada com node --check. Teste Chromium bloqueado por política do ambiente tanto em file:// quanto localhost. Download de Leaflet bloqueado por DNS; mapa real, links externos, geolocalização, layout e publicação GitHub Pages não puderam ser testados integralmente. Antes da entrega escolar: testar entrada, 14 filtros, pesquisa sem acento, três marcadores, rotas, tema, localização permitida/negada e abertura no celular. O site não é um cadastro oficial nem exaustivo.

## Correção do erro 403
O mapa usa Leaflet e serviço raster Esri World Street Map, com atribuição. Se o serviço falhar, o fundo é removido e os marcadores continuam disponíveis. Requer internet e disponibilidade do provedor. A busca interna filtra pontos cadastrados; endereços livres abrem o Google Maps por link, não são geocodificados dentro do EcoFoz. A localização limpa o texto anterior e mantém o filtro de material. Distâncias somente para pontos com GPS.
