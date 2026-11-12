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
    id: "ponto-1",
    name: "Coleta Seletiva Vila A",
    address: "Av. Silvio Américo Sasdelli, 1800",
    neighborhood: "Vila A",
    city: "Foz do Iguaçu",
    zip: "85863-580",
    hours: "Seg a sex, 08h às 17h",
    days: [1, 2, 3, 4, 5],
    open: 8,
    close: 17,
    materials: ["Plástico", "Papel", "Vidro", "Metal"],
    lat: -25.4958,
    lng: -54.5684,
  },
  {
    id: "ponto-2",
    name: "Ecoponto Porto Meira",
    address: "Rua Golfinho, 120",
    neighborhood: "Porto Meira",
    city: "Foz do Iguaçu",
    zip: "85855-430",
    hours: "Seg a sáb, 08h às 16h",
    days: [1, 2, 3, 4, 5, 6],
    open: 8,
    close: 16,
    materials: ["Eletrônicos", "Pilhas e baterias", "Lâmpadas"],
    lat: -25.5786,
    lng: -54.5623,
  },
  {
    id: "ponto-3",
    name: "Farmácia Solidária Central",
    address: "Av. Brasil, 1450",
    neighborhood: "Centro",
    city: "Foz do Iguaçu",
    zip: "85851-000",
    hours: "Seg a sex, 09h às 18h",
    days: [1, 2, 3, 4, 5],
    open: 9,
    close: 18,
    materials: ["Medicamentos"],
    lat: -25.5418,
    lng: -54.5829,
  },
  {
    id: "ponto-4",
    name: "Bazar Circular",
    address: "Rua Almirante Barroso, 850",
    neighborhood: "Centro",
    city: "Foz do Iguaçu",
    zip: "85851-010",
    hours: "Ter a sáb, 09h às 18h",
    days: [2, 3, 4, 5, 6],
    open: 9,
    close: 18,
    materials: ["Roupas"],
    lat: -25.545,
    lng: -54.585,
  },
  {
    id: "ponto-5",
    name: "Ecoponto Jardim São Paulo",
    address: "Rua Mário de Andrade, 420",
    neighborhood: "Jardim São Paulo",
    city: "Foz do Iguaçu",
    zip: "85856-120",
    hours: "Seg a sex, 08h às 16h",
    days: [1, 2, 3, 4, 5],
    open: 8,
    close: 16,
    materials: ["Plástico", "Papel", "Vidro"],
    lat: -25.5385,
    lng: -54.5512,
  },
  {
    id: "ponto-6",
    name: "UVR Graciela Barbosa",
    address: "Rua Guimarães Rosa",
    neighborhood: "Jardim América",
    city: "Foz do Iguaçu",
    zip: "85865-040",
    hours: "Seg a sex, 08h às 17h",
    days: [1, 2, 3, 4, 5],
    open: 8,
    close: 17,
    materials: ["Plástico", "Papel", "Vidro", "Metal"],
    lat: -25.5205664,
    lng: -54.5915011,
  },
  {
    id: "ponto-7",
    name: "UVR Manoel da Silva",
    address: "Rua Iacanga",
    neighborhood: "Jardim das Palmeiras",
    city: "Foz do Iguaçu",
    zip: "85859-560",
    hours: "Seg a sex, 08h às 17h",
    days: [1, 2, 3, 4, 5],
    open: 8,
    close: 17,
    materials: ["Plástico", "Papel", "Vidro", "Metal"],
    lat: -25.4957109,
    lng: -54.5437341,
  },
  {
    id: "ponto-8",
    name: "UVR Pedro Colombeli",
    address: "Rua Angatuba",
    neighborhood: "Três Lagoas",
    city: "Foz do Iguaçu",
    zip: "85862-336",
    hours: "Seg a sex, 08h às 17h",
    days: [1, 2, 3, 4, 5],
    open: 8,
    close: 17,
    materials: ["Plástico", "Papel", "Vidro", "Metal"],
    lat: -25.473214,
    lng: -54.5206589,
  },
  {
    id: "ponto-9",
    name: "UVR Rosana Lemos Turmina",
    address: "Rua Ronaldo Lopes",
    neighborhood: "Morumbi",
    city: "Foz do Iguaçu",
    zip: "85857-050",
    hours: "Seg a sex, 08h às 17h",
    days: [1, 2, 3, 4, 5],
    open: 8,
    close: 17,
    materials: ["Plástico", "Papel", "Vidro", "Metal"],
    lat: -25.5316139,
    lng: -54.5399505,
  },
];

/* --------------------------------------------------------------------------
   2. DADOS — Guia prático dos materiais
   -------------------------------------------------------------------------- */
const GUIDE = [
  { name: "Plástico", icon: "♻", color: "lime", yes: "Garrafas PET, potes e embalagens limpas", no: "Embalagens com restos de comida ou isopor", destination: "Coleta seletiva" },
  { name: "Papel", icon: "▤", color: "sky", yes: "Caixas, jornais e folhas secas", no: "Papel higiênico, guardanapos e papel engordurado", destination: "Coleta seletiva" },
  { name: "Vidro", icon: "◈", color: "teal", yes: "Garrafas e potes sem resíduos", no: "Espelhos, lâmpadas e vidros temperados", destination: "Coleta seletiva" },
  { name: "Metal", icon: "◉", color: "amber", yes: "Latas de alumínio e aço", no: "Latas com tinta ou produtos químicos", destination: "Coleta seletiva" },
  { name: "Óleo", icon: "◌", color: "orange", yes: "Óleo de cozinha usado em garrafa fechada", no: "Jogar na pia, no vaso ou no solo", destination: "Ecoponto Porto Meira" },
  { name: "Pilhas e baterias", icon: "▣", color: "violet", yes: "Pilhas, baterias e carregadores", no: "Misturar com o lixo comum", destination: "Ecoponto Porto Meira" },
  { name: "Eletrônicos", icon: "▦", color: "blue", yes: "Celulares, cabos e computadores", no: "Desmontar ou descartar na coleta comum", destination: "Ecoponto Porto Meira" },
  { name: "Lâmpadas", icon: "◒", color: "yellow", yes: "Fluorescentes e LED inteiras", no: "Quebrar ou colocar no reciclável", destination: "Ecoponto Porto Meira" },
  { name: "Medicamentos", icon: "✚", color: "rose", yes: "Remédios vencidos e cartelas", no: "Descartar no vaso sanitário", destination: "Farmácia Solidária Central" },
  { name: "Roupas", icon: "♧", color: "pink", yes: "Roupas limpas e calçados em bom estado", no: "Enviar peças molhadas ou contaminadas", destination: "Bazar Circular" },
];

/* --------------------------------------------------------------------------
   3. DADOS — Painel de impacto ("Por que isso importa?")
   -------------------------------------------------------------------------- */
const IMPACT = {
  "Óleo": {
    title: "Uma garrafa de óleo não vai para a pia.",
    text: "Um litro de óleo pode contaminar milhares de litros de água. Guardar em uma garrafa e levar ao ponto certo protege os rios e evita entupimentos.",
    fact: "1 L de óleo pode contaminar até 25.000 L de água",
  },
  "Pilhas e baterias": {
    title: "Pilhas merecem um destino especial.",
    text: "Metais pesados podem infiltrar no solo e chegar à água. Nos pontos de coleta, eles são separados com segurança e podem voltar para a cadeia produtiva.",
    fact: "Uma pilha descartada corretamente evita contaminação do solo",
  },
  "Eletrônicos": {
    title: "Seu aparelho antigo ainda tem valor.",
    text: "Eletrônicos carregam materiais que podem ser reaproveitados. O descarte correto reduz a mineração e mantém substâncias perigosas longe da natureza.",
    fact: "Até 80% de um eletrônico pode ter materiais reaproveitáveis",
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
  return `https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}`;
}

// Texto de distância exibido no card do ponto
function distanceLabel(point) {
  if (!state.userCoords) return "Ative a localização para ver a distância";
  const km = distanceKm(state.userCoords.latitude, state.userCoords.longitude, point.lat, point.lng);
  return `${km.toFixed(1)} km de você`;
}

// Verifica se o ponto está aberto neste momento (dia e hora do visitante)
function isOpenNow(point, now = new Date()) {
  const day = now.getDay();                       // 0 = domingo ... 6 = sábado
  const hour = now.getHours() + now.getMinutes() / 60;
  return point.days.includes(day) && hour >= point.open && hour < point.close;
}

// Selo "Aberto agora" / "Fechado" (usado no card e no popup do mapa)
function openBadge(point) {
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
  initMap();       // o mapa só pode iniciar quando estiver visível na tela
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
function initMap() {
  map = L.map("map").setView([-25.526, -54.558], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // Garante o tamanho correto após a capa ser escondida
  setTimeout(() => map.invalidateSize(), 100);
}

// Cria/atualiza os marcadores no mapa conforme a lista filtrada
function renderMarkers(list) {
  Object.values(markers).forEach((marker) => marker.remove());
  markers = {};

  list.forEach((point, index) => {
    const selected = state.selectedId === point.id;
    const marker = L.circleMarker([point.lat, point.lng], {
      radius: selected ? 11 : 8,
      color: selected ? "#d48646" : "#227a4c",
      fillColor: selected ? "#d48646" : "#64a85d",
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
      color: active ? "#d48646" : "#227a4c",
      fillColor: active ? "#d48646" : "#64a85d",
    });
  });

  if (map && point) {
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
  state.search = searchInput.value;
  applyFilters();
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    state.search = searchInput.value;
    applyFilters();
  }
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
  const term = state.search.trim().toLowerCase();

  let list = POINTS.filter((point) => {
    const text = `${point.name} ${point.address} ${point.neighborhood} ${point.city} ${point.zip}`.toLowerCase();
    const matchesSearch = !term || text.includes(term);
    const matchesMaterial = state.material === "Todos" || point.materials.includes(state.material);
    return matchesSearch && matchesMaterial;
  });

  if (state.userCoords) {
    const { latitude, longitude } = state.userCoords;
    list = [...list].sort(
      (a, b) => distanceKm(latitude, longitude, a.lat, a.lng) - distanceKm(latitude, longitude, b.lat, b.lng)
    );
  }

  renderList(list);
  if (map) renderMarkers(list);

  document.getElementById("list-count").textContent = `${list.length} ${list.length === 1 ? "ponto encontrado" : "pontos encontrados"}`;
  document.getElementById("map-count").textContent = `${list.length} ${list.length === 1 ? "ponto" : "pontos"}`;
}

/* --------------------------------------------------------------------------
   11. LISTA DE PONTOS (cards laterais)
   -------------------------------------------------------------------------- */
function renderList(list) {
  const container = document.getElementById("point-list");
  container.innerHTML = "";

  if (!list.length) {
    container.innerHTML = '<div class="empty-state">Nenhum ponto encontrado. Tente outro bairro ou material.</div>';
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
        <small>${point.address} · ${point.neighborhood}</small>
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
    card.querySelector(".route-button").addEventListener("click", (event) => event.stopPropagation());

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
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      state.located = true;
      state.userCoords = coords;

      // Marcador azul da posição do visitante
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

      locationButtons[0].querySelector("span").textContent = "Mais próximos primeiro";
      locationButtons[1].querySelector("span").textContent = "Você está aqui";

      applyFilters(); // reordena os pontos do mais perto ao mais longe
    },
    () => { state.located = false; } // visitante negou a permissão
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
renderGuide();
renderImpact("Óleo");
