# EcoFoz — Descarte Certo em Foz do Iguaçu

Site educativo sobre reciclagem em Foz do Iguaçu, PR. Ajuda o cidadão a
descobrir **o que pode e não pode ser reciclado** e **onde descartar** cada
material na cidade, com mapa interativo, busca e filtros.

## Como executar

Não precisa instalar nada. Basta abrir o arquivo `index.html` em qualquer
navegador (duplo clique) — o site funciona de forma totalmente estática.

## Arquivos do projeto

| Arquivo     | Conteúdo                                                                 |
|-------------|--------------------------------------------------------------------------|
| `index.html`| Estrutura da página: capa de entrada, cabeçalho, busca, filtros, mapa, guia de materiais, painel de impacto e rodapé. |
| `style.css` | Todo o design: cores, tipografia, cards, botões, mapa, tema claro/escuro e layout responsivo. |
| `script.js` | Toda a lógica: dados dos pontos de coleta, busca por bairro/endereço/CEP, filtros por material, mapa (Leaflet), geolocalização e alternância de tema. |
| `README.md` | Este documento.                                                           |

## Funcionalidades

- **Capa de entrada** com botão "Entrar no EcoFoz".
- **Mapa real** (Leaflet + OpenStreetMap) com 5 pontos de coleta de Foz do
  Iguaçu e popups com endereço e materiais aceitos.
- **Busca** por bairro, endereço, cidade ou CEP.
- **Filtros por material**: Plástico, Óleo, Pilhas e baterias, Eletrônicos,
  Medicamentos etc.
- **Botão "Como chegar"** em cada ponto: abre o trajeto no aplicativo de
  mapas do celular.
- **Aviso de horário**: cada ponto mostra "Aberto agora" ou "Fechado" de
  acordo com o dia e a hora do visitante.
- **Geolocalização**: botão "Encontrar perto de mim" ordena os pontos do mais
  próximo ao mais distante e mostra a distância em km.
- **Guia prático** com 10 categorias de materiais (o que pode e o que não
  pode ser descartado, e o destino correto de cada um).
- **Painel interativo "Por que isso importa?"** com o impacto ambiental do
  descarte correto de óleo, pilhas/baterias e eletrônicos.
- **Tema claro e escuro** e layout responsivo para celular, tablet e computador.

## Pontos de coleta cadastrados

1. **Coleta Seletiva Vila A** — Av. Silvio Américo Sasdelli, 1800 · Vila A
   (Plástico, Papel, Vidro e Metal)
2. **Ecoponto Porto Meira** — Rua Golfinho, 120 · Porto Meira
   (Eletrônicos, Pilhas e baterias e Lâmpadas)
3. **Farmácia Solidária Central** — Av. Brasil, 1450 · Centro (Medicamentos)
4. **Bazar Circular** — Rua Almirante Barroso, 850 · Centro (Roupas)
5. **Ecoponto Jardim São Paulo** — Rua Mário de Andrade, 420 · Jardim São Paulo
   (Plástico, Papel e Vidro — recicláveis secos)
6. **UVR Graciela Barbosa** — Rua Guimarães Rosa · Jardim América
   (Plástico, Papel, Vidro e Metal)
7. **UVR Manoel da Silva** — Rua Iacanga · Jardim das Palmeiras
   (Plástico, Papel, Vidro e Metal)
8. **UVR Pedro Colombeli** — Rua Angatuba · Três Lagoas
   (Plástico, Papel, Vidro e Metal)
9. **UVR Rosana Lemos Turmina** — Rua Ronaldo Lopes · Morumbi
   (Plástico, Papel, Vidro e Metal)

> As UVRs são pontos fixos oficiais da Prefeitura de Foz do Iguaçu
> (fonte: Secretaria de Meio Ambiente / g1 PR). Confira o horário antes de ir.

## Tecnologias

- HTML5, CSS3 e JavaScript puro (sem frameworks e sem build).
- [Leaflet 1.9.4](https://leafletjs.com/) via CDN para o mapa, com tiles do
  OpenStreetMap.
- Fontes Google Fonts (Plus Jakarta Sans e DM Sans).

---

© 2026 EcoFoz · Feito com cuidado para Foz do Iguaçu · PR
