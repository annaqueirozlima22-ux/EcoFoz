/* ==========================================================================
   EcoFoz — script.js
   Toda a lógica do site: dados dos pontos de coleta de Foz do Iguaçu,
   busca, filtros, mapa (Leaflet), geolocalização, aviso de "Aberto agora",
   guia de materiais, painel de impacto e alternância de tema.
   ========================================================================== */

"use strict";

/* --------------------------------------------------------------------------
   1. DADOS — Pontos de descarte de Foz do Iguaçu
   Coordenadas GPS e materiais conferidos:
   - Jardim São Paulo aceita apenas recicláveis secos (Plástico, Papel, Vidro);
   - Porto Meira recebe Eletrônicos, Pilhas e baterias e Lâmpadas;
   - As 4 UVRs são pontos fixos oficiais da Prefeitura de Foz do Iguaçu
     (fonte: Secretaria de Meio Ambiente / g1 PR).

   Horário de funcionamento (para o aviso "Aberto agora"):
   - days: dias da semana abertos (0 = domingo, 1 = segunda ... 6 = sábado)
   - open / close: hora de abertura e fechamento (formato 24h)
   -------------------------------------------------------------------------- */
const POINTS = [
  {
    "id": "1",
    "name": "Droga Raia",
    "address": "Av. Jorge Schimmelpfeng, 140",
    "neighborhood": "Centro",
    "materials": [
      "Pilhas e baterias"
    ],
    "source": "https://sistema.gmclog.com.br/info/green?page=23&sf242398615=1",
    "city": "Foz do Iguaçu",
    "zip": "85851-110",
    "hours": "Confirme antes de ir",
    "lat": -25.547102,
    "lng": -54.586896,
    "phone": "(45) 99143-1717",
    "geoSource": "https://buscacomercio.com/cidades/foz-do-iguacu/farmacias/droga-raia-3/",
    "extraSource": "https://cnes2.datasus.gov.br/Mod_Conjunto.asp?VCo_Unidade=4108300664383",
    "type": "Logística reversa — pilhas portáteis; confirme tipos aceitos"
  },
  {
    "id": "2",
    "name": "Droga Raia",
    "address": "Rua Xavier da Silva, 1229",
    "neighborhood": "Centro",
    "materials": [
      "Pilhas e baterias"
    ],
    "source": "https://sistema.gmclog.com.br/info/green?page=23&sf242398615=1",
    "city": "Foz do Iguaçu",
    "zip": "85851-180",
    "hours": "Confirme antes de ir",
    "lat": -25.537694,
    "lng": -54.576429,
    "phone": "(45) 99155-5032",
    "geoSource": "https://buscacomercio.com/cidades/foz-do-iguacu/farmacias/droga-raia-2/",
    "extraSource": "https://cnes2.datasus.gov.br/Mod_Conjunto.asp?VCo_Unidade=4108300924458",
    "type": "Logística reversa — pilhas portáteis; confirme tipos aceitos"
  },
  {
    "id": "3",
    "name": "Droga Raia",
    "address": "Av. Costa e Silva, 374",
    "neighborhood": "Campos do Iguaçu",
    "materials": [
      "Pilhas e baterias"
    ],
    "source": "https://sistema.gmclog.com.br/info/green?page=23&sf242398615=1",
    "city": "Foz do Iguaçu",
    "zip": "",
    "hours": "Confirme antes de ir",
    "type": "Logística reversa — confirme tipos aceitos"
  },
  {
    "id": "4",
    "name": "Droga Raia",
    "address": "Av. República Argentina, 3236",
    "neighborhood": "Centro",
    "materials": [
      "Pilhas e baterias"
    ],
    "source": "https://sistema.gmclog.com.br/info/green?page=23&sf242398615=1",
    "city": "Foz do Iguaçu",
    "zip": "",
    "hours": "Confirme antes de ir",
    "type": "Logística reversa — confirme tipos aceitos"
  },
  {
    "id": "5",
    "name": "Droga Raia",
    "address": "Av. Paraná, 292",
    "neighborhood": "Centro",
    "materials": [
      "Pilhas e baterias"
    ],
    "source": "https://sistema.gmclog.com.br/info/green?page=23&sf242398615=1",
    "city": "Foz do Iguaçu",
    "zip": "",
    "hours": "Confirme antes de ir",
    "type": "Logística reversa — confirme tipos aceitos"
  },
  {
    "id": "6",
    "name": "Droga Raia",
    "address": "Av. José Maria de Brito, 1860",
    "neighborhood": "Jardim Central",
    "materials": [
      "Pilhas e baterias"
    ],
    "source": "https://sistema.gmclog.com.br/info/green?page=23&sf242398615=1",
    "city": "Foz do Iguaçu",
    "zip": "",
    "hours": "Confirme antes de ir",
    "type": "Logística reversa — confirme tipos aceitos"
  },
  {
    "id": "7",
    "name": "Farmautil",
    "address": "Av. Mário Filho, 1615",
    "neighborhood": "Portal",
    "materials": [
      "Medicamentos"
    ],
    "source": "https://www.logmed.org.br/arquivos/atuais/pontos-de-descarte-29-04-2025.pdf",
    "city": "Foz do Iguaçu",
    "zip": "85859-000",
    "hours": "Confirme antes de ir",
    "type": "Logística reversa — cadastro de abril de 2025; confirme atendimento"
  },
  {
    "id": "8",
    "name": "Farmautil",
    "address": "Av. República Argentina, 3654 sala 10",
    "neighborhood": "Panorama",
    "materials": [
      "Medicamentos"
    ],
    "source": "https://www.logmed.org.br/arquivos/atuais/pontos-de-descarte-29-04-2025.pdf",
    "city": "Foz do Iguaçu",
    "zip": "85856-578",
    "hours": "Confirme antes de ir",
    "type": "Logística reversa — cadastro de abril de 2025; confirme atendimento"
  },
  {
    "id": "9",
    "name": "Farmautil",
    "address": "Av. das Cataratas, 794",
    "neighborhood": "Yolanda",
    "materials": [
      "Medicamentos"
    ],
    "source": "https://www.logmed.org.br/arquivos/atuais/pontos-de-descarte-29-04-2025.pdf",
    "city": "Foz do Iguaçu",
    "zip": "85853-000",
    "hours": "Confirme antes de ir",
    "type": "Logística reversa — cadastro de abril de 2025; confirme atendimento"
  },
  {
    "id": "10",
    "name": "Farmautil Vila A",
    "address": "Av. Silvio Américo Sasdelli, 1999",
    "neighborhood": "Vila A",
    "materials": [
      "Medicamentos"
    ],
    "source": "https://ecomed.eco.br/descarte/foz-do-iguacu-pr",
    "city": "Foz do Iguaçu",
    "zip": "",
    "hours": "Seg–sáb 07h30–23h; dom 08h–23h",
    "lat": -25.494257,
    "lng": -54.563741,
    "geoSource": "https://buscacomercio.com/cidades/foz-do-iguacu/farmacias/farmacia-farmautil/",
    "extraSource": "https://www.farmautil.com.br/",
    "phone": "(45) 3524-1205",
    "type": "Logística reversa — confirmação recomendada"
  },
  {
    "id": "11",
    "name": "Projeto LixoTec",
    "address": "Av. Bonito-Lindo, 720",
    "neighborhood": "Portal da Foz",
    "materials": [
      "Eletrônicos"
    ],
    "source": "https://projetolixotec.com.br/",
    "city": "Foz do Iguaçu",
    "zip": "85859-386",
    "hours": "Seg–sex 08h–16h",
    "phone": "(45) 99947-3674",
    "type": "Empresa/projeto de coleta agendada; confirme entrega presencial"
  },
  {
    "id": "12",
    "name": "UVR Manoel da Silva",
    "address": "Rua Iacanga",
    "neighborhood": "Jardim das Palmeiras",
    "materials": [
      "Entulho",
      "Móveis"
    ],
    "source": "https://cgn.inf.br/noticia/767895/moradores-de-foz-podem-descartar-materiais-inertes-em-quatro-uvrs",
    "city": "Foz do Iguaçu",
    "zip": "",
    "hours": "Confirme antes de ir",
    "type": "Centro de triagem com ecoponto anunciado em 2022 — confirme atividade e limite de volume"
  },
  {
    "id": "13",
    "name": "UVR Graciela Barbosa",
    "address": "Rua Guimarães Rosa",
    "neighborhood": "Jardim América",
    "materials": [
      "Entulho",
      "Móveis"
    ],
    "source": "https://cgn.inf.br/noticia/767895/moradores-de-foz-podem-descartar-materiais-inertes-em-quatro-uvrs",
    "city": "Foz do Iguaçu",
    "zip": "",
    "hours": "Confirme antes de ir",
    "type": "Centro de triagem com ecoponto anunciado em 2022 — confirme atividade e limite de volume"
  },
  {
    "id": "14",
    "name": "UVR Pedro Colombeli",
    "address": "Rua Angatuba",
    "neighborhood": "Três Lagoas",
    "materials": [
      "Entulho",
      "Móveis"
    ],
    "source": "https://cgn.inf.br/noticia/767895/moradores-de-foz-podem-descartar-materiais-inertes-em-quatro-uvrs",
    "city": "Foz do Iguaçu",
    "zip": "",
    "hours": "Confirme antes de ir",
    "type": "Centro de triagem com ecoponto anunciado em 2022 — confirme atividade e limite de volume"
  },
  {
    "id": "15",
    "name": "UVR Rosana Lemos Turmina",
    "address": "Rua Ronaldo Lopes",
    "neighborhood": "Morumbi",
    "materials": [
      "Entulho",
      "Móveis"
    ],
    "source": "https://cgn.inf.br/noticia/767895/moradores-de-foz-podem-descartar-materiais-inertes-em-quatro-uvrs",
    "city": "Foz do Iguaçu",
    "zip": "",
    "hours": "Confirme antes de ir",
    "type": "Centro de triagem com ecoponto anunciado em 2022 — confirme atividade e limite de volume"
  },
  {
    "id": "16",
    "name": "Óleo Ponto — Mercado Líder",
    "address": "Av. Silvio Américo Sasdelli, 1943",
    "neighborhood": "Vila A",
    "materials": [
      "Óleo"
    ],
    "source": "https://www.destino.foz.br/novas-tecnologias-do-programa-vila-a-inteligente-sao-instaladas-em-foz-do-iguacu/",
    "city": "Foz do Iguaçu",
    "zip": "",
    "hours": "Confirme antes de ir",
    "extraSource": "https://www.apras.org.br/wp-content/uploads/2026/03/LOJAS-PARTICIPANTES-DE-OLHO-NA-VALIDADE-2026.pdf",
    "type": "Ponto anunciado em 2022 — atividade atual não confirmada"
  }
];
/* --------------------------------------------------------------------------
   2. DADOS — Guia prático dos materiais
   -------------------------------------------------------------------------- */
const GUIDE = [
  { name: "Plástico", icon: "♻", color: "lime", yes: "Garrafas PET, potes e embalagens limpas", no: "Embalagens com restos de comida ou isopor", destination: "Coleta seletiva" },
  { name: "Papel", icon: "▤", color: "sky", yes: "Caixas, jornais e folhas secas", no: "Papel higiênico, guardanapos e papel engordurado", destination: "Coleta seletiva" },
  { name: "Vidro", icon: "◈", color: "teal", yes: "Garrafas e potes sem resíduos", no: "Espelhos, lâmpadas e vidros temperados", destination: "Coleta seletiva" },
  { name: "Metal", icon: "◉", color: "amber", yes: "Latas de alumínio e aço", no: "Latas com tinta ou produtos químicos", destination: "Coleta seletiva" },
  { name: "Óleo", icon: "◌", color: "orange", yes: "Óleo de cozinha usado em garrafa fechada", no: "Jogar na pia, no vaso ou no solo", destination: "Coleta seletiva municipal; confirme orientação atual" },
  { name: "Pilhas e baterias", icon: "▣", color: "violet", yes: "Pilhas e baterias portáteis; confirme os tipos aceitos", no: "Misturar com o lixo comum", destination: "Logística reversa / consulte os serviços" },
  { name: "Eletrônicos", icon: "▦", color: "blue", yes: "Celulares, cabos e computadores", no: "Desmontar ou descartar na coleta comum", destination: "Logística reversa / consulte os serviços" },
  { name: "Lâmpadas", icon: "◒", color: "yellow", yes: "Fluorescentes e LED inteiras", no: "Quebrar ou colocar no reciclável", destination: "Logística reversa / consulte os serviços" },
  { name: "Medicamentos", icon: "✚", color: "rose", yes: "Remédios vencidos e cartelas", no: "Descartar no vaso sanitário", destination: "Farmácias participantes" },
  { name: "Roupas", icon: "♧", color: "pink", yes: "Roupas limpas e calçados em bom estado", no: "Enviar peças molhadas ou contaminadas", destination: "Doação de peças em bom estado" },
];

/* --------------------------------------------------------------------------
   3. DADOS — Painel de impacto ("Por que isso importa?")
   -------------------------------------------------------------------------- */
GUIDE.push(
{name:'Papelão',icon:'▤',color:'sky',yes:'Caixas limpas e secas',no:'Caixas engorduradas',destination:'Coleta seletiva'},
{name:'Entulho',icon:'▦',color:'amber',yes:'Pequenas quantidades de tijolos e concreto',no:'Amianto e resíduos perigosos',destination:'Ecoponto autorizado'},
{name:'Móveis',icon:'▣',color:'teal',yes:'Móveis usados',no:'Abandonar na rua',destination:'Doação ou ecoponto autorizado'},
{name:'Pneus',icon:'◉',color:'blue',yes:'Pneus inservíveis',no:'Queimar ou deixar na rua',destination:'Revendedor ou ponto autorizado'});
const IMPACT = {
  "Óleo": {
    title: "Uma garrafa de óleo não vai para a pia.",
    text: "Um litro de óleo pode contaminar milhares de litros de água. Guardar em uma garrafa e levar ao ponto certo protege os rios e evita entupimentos.",
    fact: "Óleo na pia pode causar entupimentos e prejudicar a água",
  },
  "Pilhas e baterias": {
    title: "Pilhas merecem um destino especial.",
    text: "Metais pesados podem infiltrar no solo e chegar à água. Nos pontos de coleta, eles são separados com segurança e podem voltar para a cadeia produtiva.",
    fact: "Uma pilha descartada corretamente evita contaminação do solo",
  },
  "Eletrônicos": {
    title: "Seu aparelho antigo ainda tem valor.",
    text: "Eletrônicos carregam materiais que podem ser reaproveitados. O descarte correto reduz a mineração e mantém substâncias perigosas longe da natureza.",
    fact: "Eletrônicos contêm materiais que podem ser recuperados",
  },
};

/* --------------------------------------------------------------------------
   4. ÍCONES SVG (reutilizados nos cards gerados via JavaScript)
   -------------------------------------------------------------------------- */
function svgIcon(paths, size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}
const ICON = {
  pin: (s = 12) => svgIcon('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>', s),
  clock: (s = 12) => svgIcon('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>', s),
  nav: (s = 12) => svgIcon('<polygon points="3 11 22 2 13 21 11 13 3 11"/>', s),
  chevron: (s = 18) => svgIcon('<path d="m9 18 6-6-6-6"/>', s),
  check: (s = 15) => svgIcon('<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>', s),
  x: (s = 15) => svgIcon('<path d="M18 6 6 18M6 6l12 12"/>', s),
};

/* --------------------------------------------------------------------------
   5. ESTADO GLOBAL DA PÁGINA
   -------------------------------------------------------------------------- */
const state = {
  search: "",          // texto digitado na busca
  material: "Todos",   // filtro de material ativo
  selectedId: null,    // ponto selecionado no mapa/lista
  userCoords: null,    // posição do visitante (geolocalização)
  located: false,      // se a localização já foi ativada
};

let map = null;        // instância do mapa Leaflet
let markers = {};      // marcadores por id do ponto
let userMarker = null; // marcador azul da posição do visitante

/* --------------------------------------------------------------------------
   6. UTILITÁRIOS
   -------------------------------------------------------------------------- */

// Distância em km entre duas coordenadas (fórmula de Haversine)
function distanceKm(lat1, lng1, lat2, lng2) {
  const earthRadius = 6371;
  const toRad = (value) => (value * Math.PI) / 180;
  const deltaLat = toRad(lat2 - lat1);
  const deltaLng = toRad(lng2 - lng1);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(deltaLng / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Link de trajeto: abre o app de mapas do celular já com a rota até o ponto
function routeUrl(point) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(point.name+", "+point.address+", Foz do Iguaçu, PR")}`;
}

// Texto de distância exibido no card do ponto
function distanceLabel(point) {
  if (!hasCoords(point)) return "Coordenadas pendentes";
  if (!state.userCoords) return "Ative a localização para ver a distância";
  const km = distanceKm(state.userCoords.latitude, state.userCoords.longitude, point.lat, point.lng);
  return `${km.toFixed(1)} km em linha reta`;
}

// Verifica se o ponto está aberto neste momento (dia e hora do visitante)
function isOpenNow(point, now = new Date()) {
  const day = now.getDay();                       // 0 = domingo ... 6 = sábado
  const hour = now.getHours() + now.getMinutes() / 60;
  return point.days.includes(day) && hour >= point.open && hour < point.close;
}

// Selo "Aberto agora" / "Fechado" (usado no card e no popup do mapa)
function openBadge(point) {
  if (!point.days) return "";
  const open = isOpenNow(point);
  return `<span class="open-badge ${open ? "aberto" : "fechado"}">● ${open ? "Aberto agora" : "Fechado"}</span>`;
}

/* --------------------------------------------------------------------------
   7. CAPA DE ENTRADA
   -------------------------------------------------------------------------- */
const welcomeScreen = document.getElementById("welcome-screen");
const siteShell = document.getElementById("site-shell");

document.getElementById("continue-button").addEventListener("click", () => {
  welcomeScreen.hidden = true;
  siteShell.hidden = false;
  initMap().then(applyFilters);       // o mapa só pode iniciar quando estiver visível na tela
  applyFilters();  // desenha lista e marcadores pela primeira vez
});

/* --------------------------------------------------------------------------
   8. TEMA CLARO / ESCURO
   -------------------------------------------------------------------------- */
const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", () => {
  const dark = siteShell.classList.toggle("theme-dark");
  themeToggle.textContent = dark ? "☀" : "☾";
});

/* --------------------------------------------------------------------------
   9. MAPA (Leaflet + OpenStreetMap)
   -------------------------------------------------------------------------- */
const hasCoords = p => Number.isFinite(p.lat) && Number.isFinite(p.lng);
const normalize = t => t.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const status = (id,msg) => document.getElementById(id).textContent=msg;
async function initMap() {
  if(map) return;
  if(!window.L) { status('map-status','Carregando mapa…');
    for(const host of ['https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/','https://unpkg.com/leaflet@1.9.4/dist/']) {
      try { await new Promise((resolve,reject)=>{const js=document.createElement('script');js.src=host+'leaflet.js';const timer=setTimeout(()=>{js.remove();reject();},5000);js.onload=()=>{clearTimeout(timer);resolve()};js.onerror=()=>{clearTimeout(timer);reject()};document.head.append(js)}); if(window.L) break; } catch(e) {}
    }
  }
  if(!window.L){status('map-status','Mapa indisponível. Utilize a lista e os links de rota.');return;}
  try {
  map = L.map("map").setView([-25.526, -54.558], 12);

  // Serviço público de mapas raster; não utiliza o endpoint CARTO com chave.
  const tiles = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
    attribution: 'Tiles &copy; Esri — HERE, Garmin, USGS, Intermap, INCREMENT P, NRCan, Esri Japan, METI, Esri China (Hong Kong), Esri Korea, Esri (Thailand), NGCC, OpenStreetMap contributors e comunidade GIS',
    maxZoom: 19,
    maxNativeZoom: 19,
  });
  let failed = false;
  tiles.on("tileerror", () => {
    if (failed) return;
    failed = true;
    map.removeLayer(tiles);
    status("map-status", "Fundo cartográfico indisponível. Os marcadores com GPS continuam disponíveis; use Como chegar para ver as ruas.");
  });
  status("map-status", "");
  tiles.addTo(map);

  // Garante o tamanho correto após a capa ser escondida
  setTimeout(() => {if(map) map.invalidateSize()}, 100);
  } catch(e) { map=null;status("map-status","Mapa indisponível; consulte a lista."); }
}

// Cria/atualiza os marcadores no mapa conforme a lista filtrada
function renderMarkers(list) {
  Object.values(markers).forEach((marker) => marker.remove());
  markers = {};

  list.forEach((point, index) => {
    if (!hasCoords(point)) return;
    const selected = state.selectedId === point.id;
    const marker = L.circleMarker([point.lat, point.lng], {
      radius: selected ? 11 : 8,
      color: selected ? "#d48646" : (point.materials.includes("Medicamentos")?"#bd365f":"#7952b3"),
      fillColor: selected ? "#d48646" : (point.materials.includes("Medicamentos")?"#e17c98":"#a58ad1"),
      fillOpacity: 0.9,
      weight: 3,
    });

    marker.bindPopup(
      `<strong>${index + 1}. ${point.name}</strong><br>` +
      `${point.address} · ${point.neighborhood}<br>` +
      `<small>${point.materials.join(" · ")}</small><br>` +
      `${openBadge(point)}<br>` +
      `<a class="popup-route" href="${routeUrl(point)}" target="_blank" rel="noopener">Como chegar</a>`
    );

    marker.on("click", () => selectPoint(point.id, false));
    marker.addTo(map);
    markers[point.id] = marker;
  });
}

// Seleciona um ponto: destaca card e marcador, centraliza e abre o popup
function selectPoint(id, fly = true) {
  state.selectedId = id;
  const point = POINTS.find((p) => p.id === id);

  document.querySelectorAll(".point-card").forEach((card) => {
    card.classList.toggle("selected", card.dataset.id === id);
  });

  Object.entries(markers).forEach(([markerId, marker]) => {
    const active = markerId === id;
    marker.setStyle({
      radius: active ? 11 : 8,
      color: active ? "#d48646" : (POINTS.find(p=>p.id===markerId).materials.includes("Medicamentos")?"#bd365f":"#7952b3"),
      fillColor: active ? "#d48646" : (POINTS.find(p=>p.id===markerId).materials.includes("Medicamentos")?"#e17c98":"#a58ad1"),
    });
  });

  if (map && point && hasCoords(point)) {
    if (fly) map.flyTo([point.lat, point.lng], 15, { duration: 0.7 });
    markers[id]?.openPopup();
  }
}

/* --------------------------------------------------------------------------
   10. BUSCA E FILTROS
   -------------------------------------------------------------------------- */
const searchInput = document.getElementById("drop-point-search");
const filterRow = document.getElementById("filter-row");

document.getElementById("search-drop-points-button").addEventListener("click", () => {
  searchAddress();
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchAddress();
  }
});

// Busca local primeiro; endereço livre pode ser localizado pelo ViaCEP (CEP) ou Google Maps.
function searchAddress() {
  state.search = searchInput.value.trim();
  applyFilters();
  const q = state.search;
  const output = document.getElementById("address-result");
  output.replaceChildren();
  if (!q) return;
  const a = document.createElement("a");
  a.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q + ", Foz do Iguaçu, PR, Brasil");
  a.target = "_blank"; a.rel = "noopener"; a.textContent = "Localizar este endereço no Google Maps";
  output.append("A busca interna consulta os pontos cadastrados. Para qualquer rua ou CEP: ", a);
}
document.getElementById("clear-search").addEventListener("click", () => {
  searchInput.value = ""; state.search = ""; document.getElementById("address-result").replaceChildren(); setMaterial("Todos");
});

filterRow.addEventListener("click", (event) => {
  const button = event.target.closest(".filter");
  if (!button) return;
  setMaterial(button.dataset.material);
});

// Troca o filtro de material (usado também pelos cards do guia)
function setMaterial(material) {
  state.material = material;
  filterRow.querySelectorAll(".filter").forEach((button) => {
    button.classList.toggle("active", button.dataset.material === material);
  });
  applyFilters();
}

// Aplica busca + filtro + ordenação por distância e redesenha a tela
function applyFilters() {
  const term = normalize(state.search.trim());

  let list = POINTS.filter((point) => {
    const text = normalize(`${point.name} ${point.address} ${point.neighborhood} ${point.city} ${point.zip} ${point.zip.replace(/-/g, "")}`);
    const matchesSearch = !term || term.split(/\s+/).every(word => text.includes(word));
    const matchesMaterial = state.material === "Todos" || point.materials.includes(state.material);
    return matchesSearch && matchesMaterial;
  });

  if (state.userCoords) {
    const { latitude, longitude } = state.userCoords;
    list = [...list].sort(
      (a, b) => (hasCoords(a)?distanceKm(latitude, longitude, a.lat, a.lng):1e9) - (hasCoords(b)?distanceKm(latitude, longitude, b.lat, b.lng):1e9)
    );
  }

  renderList(list);
  if (map) { renderMarkers(list); const mapped=list.filter(hasCoords); const bounds=mapped.map(p=>[p.lat,p.lng]); if(state.userCoords) bounds.push([state.userCoords.latitude,state.userCoords.longitude]); if(bounds.length) map.fitBounds(bounds,{padding:[45,65],maxZoom:15}); }
  document.getElementById("service-info").hidden = !["Todos","Plástico","Papel","Papelão","Vidro","Metal","Óleo","Lâmpadas","Roupas","Pneus"].includes(state.material);

  document.getElementById("list-count").textContent = `${list.length} ${list.length === 1 ? "ponto encontrado" : "pontos encontrados"}`;
  document.getElementById("map-count").textContent = `${list.filter(hasCoords).length} no mapa / ${list.length} na lista`;
}

/* --------------------------------------------------------------------------
   11. LISTA DE PONTOS (cards laterais)
   -------------------------------------------------------------------------- */
function renderList(list) {
  const container = document.getElementById("point-list");
  container.innerHTML = "";

  if (!list.length) {
    container.innerHTML = '<div class="empty-state">Nenhum ponto cadastrado corresponde à busca e ao filtro. Limpe a busca ou consulte os serviços e o guia de materiais.</div>';
    return;
  }

  list.forEach((point, index) => {
    const card = document.createElement("article");
    card.className = "point-card" + (state.selectedId === point.id ? " selected" : "");
    card.dataset.id = point.id;
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("data-testid", `drop-point-card-${point.id}`);

    card.innerHTML = `
      <span class="point-number">${String(index + 1).padStart(2, "0")}</span>
      <span class="point-info">
        <b>${point.name}</b>
        <small>${point.address} · ${point.neighborhood} ${point.zip}</small>
        <small>${point.type}</small><small>${point.phone || "Telefone não confirmado"}</small>
        <small>Consulta: 24/11/2026 · ${hasCoords(point)?`GPS: ${point.lat}, ${point.lng}`:"Sem coordenadas verificadas"}</small>
        <small><a href="${point.source}" target="_blank" rel="noopener">Fonte do descarte</a> ${point.geoSource?`<a href="${point.geoSource}" target="_blank" rel="noopener">Fonte GPS</a>`:""} ${point.extraSource?`<a href="${point.extraSource}" target="_blank" rel="noopener">Fonte adicional</a>`:""}</small>
        <small>${ICON.clock()} ${point.hours} ${openBadge(point)}</small>
        <small class="distance-line">${ICON.nav()} ${distanceLabel(point)}</small>
        <span class="material-tags">${point.materials.map((m) => `<i>${m}</i>`).join("")}</span>
        <a class="route-button" href="${routeUrl(point)}" target="_blank" rel="noopener" data-testid="route-button-${point.id}">${ICON.nav()} Como chegar</a>
      </span>
      <span class="point-arrow">${ICON.chevron()}</span>
    `;

    // Clique no card seleciona o ponto; o link de rota não propaga o clique
    card.addEventListener("click", () => selectPoint(point.id));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter") selectPoint(point.id);
    });
    card.querySelectorAll("a").forEach(a=>a.addEventListener("click",event=>event.stopPropagation()));

    container.appendChild(card);
  });
}

/* --------------------------------------------------------------------------
   12. GEOLOCALIZAÇÃO ("Encontrar perto de mim")
   -------------------------------------------------------------------------- */
const locationButtons = [
  document.getElementById("use-location-button"),
  document.getElementById("map-location-button"),
];

locationButtons.forEach((button) => button.addEventListener("click", locateUser));

function locateUser() {
  if (!navigator.geolocation) {status("location-status","Localização indisponível neste navegador.");return;}

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      state.located = true;
      state.userCoords = coords;
      state.search = ""; searchInput.value = ""; document.getElementById("address-result").replaceChildren();

      // Marcador azul da posição do visitante
      if (map && window.L) {
      if (userMarker) userMarker.remove();
      userMarker = L.circleMarker([coords.latitude, coords.longitude], {
        radius: 9,
        color: "#fff",
        fillColor: "#287bd1",
        fillOpacity: 1,
        weight: 3,
      }).addTo(map);
      userMarker.bindPopup("Você está aqui");
      userMarker.setRadius(9);
      userMarker._path?.setAttribute("data-testid", "user-location-dot");

      map.flyTo([coords.latitude, coords.longitude], 13, { duration: 0.8 });

      }
      status("location-status","Distâncias em linha reta; endereços sem GPS ficam ao final.");
      locationButtons[0].querySelector("span").textContent = "Mais próximos primeiro";
      locationButtons[1].querySelector("span").textContent = "Você está aqui";

      applyFilters(); // reordena os pontos do mais perto ao mais longe
    },
    () => { state.located = false; status("location-status","Localização não autorizada ou indisponível. Use a busca; no celular prefira HTTPS."); }, {timeout:10000,maximumAge:60000} // visitante negou a permissão
  );
}

/* --------------------------------------------------------------------------
   13. GUIA DE MATERIAIS (cards gerados a partir dos dados)
   -------------------------------------------------------------------------- */
function renderGuide() {
  const grid = document.getElementById("guide-grid");

  GUIDE.forEach((item) => {
    const slug = item.name.toLowerCase().replaceAll(" ", "-");
    const card = document.createElement("article");
    card.className = "guide-card";
    card.setAttribute("data-testid", `guide-card-${slug}`);

    card.innerHTML = `
      <div class="guide-icon ${item.color}">${item.icon}</div>
      <h3>${item.name}</h3>
      <div class="guide-line yes">${ICON.check()}<span><b>Pode:</b> ${item.yes}</span></div>
      <div class="guide-line no">${ICON.x()}<span><b>Não pode:</b> ${item.no}</span></div>
      <div class="guide-destination">${ICON.pin()} ${item.destination}</div>
      <button class="guide-find-button" data-testid="find-guide-point-${slug}">Ver pontos próximos ${ICON.chevron(13)}</button>
    `;

    // Leva o visitante direto para a lista já filtrada pelo material
    card.querySelector(".guide-find-button").addEventListener("click", () => {
      searchInput.value = "";
      state.search = "";
      setMaterial(item.name);
      document.getElementById("encontre").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    grid.appendChild(card);
  });
}

/* --------------------------------------------------------------------------
   14. PAINEL DE IMPACTO
   -------------------------------------------------------------------------- */
function renderImpact(name) {
  const impact = IMPACT[name];
  document.getElementById("impact-title").textContent = impact.title;
  document.getElementById("impact-text").textContent = impact.text;
  document.getElementById("impact-fact").textContent = impact.fact;
}

document.getElementById("impact-tabs").addEventListener("click", (event) => {
  const tab = event.target.closest(".impact-tab");
  if (!tab) return;
  document.querySelectorAll(".impact-tab").forEach((t) => t.classList.toggle("active", t === tab));
  renderImpact(tab.dataset.impact);
});

/* --------------------------------------------------------------------------
   15. INICIALIZAÇÃO (guia e impacto não dependem do mapa)
   -------------------------------------------------------------------------- */
document.getElementById("stat-points-count").textContent = POINTS.length;
filterRow.innerHTML = `<span>Filtrar por material:</span>` + ["Todos",...GUIDE.map(g=>g.name)].map(m=>`<button class="filter ${m==="Todos"?"active":""}" data-material="${m}">${m==="Óleo"?"Óleo de cozinha":m}</button>`).join("");
document.getElementById("stat-material-count").textContent=GUIDE.length;
renderGuide();
renderImpact("Óleo");
