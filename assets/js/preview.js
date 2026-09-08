/* ============================================================
   PRIORI — preview SVG del journal (capa/tapa y "por dentro")
   Lógica portada sin cambios del index.html original.
   ============================================================ */

function journalIconSVG(coverHex, elasticHex, widthPx) {
  return `<svg viewBox="0 0 220 300" style="width:${widthPx}px; display:block;">
    <rect x="150" y="14" width="56" height="272" rx="7" fill="#F2EAD9"></rect>
    <rect x="30" y="10" width="150" height="280" rx="12" fill="${coverHex}"></rect>
    <circle cx="47" cy="27" r="3" fill="rgba(255,255,255,.55)"></circle>
    <circle cx="163" cy="27" r="3" fill="rgba(255,255,255,.55)"></circle>
    <circle cx="47" cy="273" r="3" fill="rgba(255,255,255,.55)"></circle>
    <circle cx="163" cy="273" r="3" fill="rgba(255,255,255,.55)"></circle>
    <rect x="30" y="141" width="150" height="9" rx="2" fill="${elasticHex}"></rect>
  </svg>`;
}

function escapeXml(s) {
  return String(s || "").replace(/[<>&"']/g, ch => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" }[ch]));
}

// "Por fuera": tapa + elástico + grabado opcional + dijes colgando en línea vertical.
// Estilo tomado de la referencia (catalogo.estudiorelier.com/personalizar): tapa
// bien redondeada, sombra suave de "tarjeta flotando" y una etiqueta con el tamaño.
function buildExteriorSVG({ coverHex, elasticHex, engraveOn, engraveText, charmIds, size }) {
  const hasText = !!(engraveText && engraveText.trim());
  const engraveMarkup = engraveOn ? `
    <text x="105" y="92" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-style="italic"
      font-weight="600" font-size="17" fill="rgba(255,255,255,${hasText ? 0.92 : 0.4})">${escapeXml(hasText ? engraveText.trim() : "Tu nombre")}</text>` : "";
  // los dijes cuelgan del elástico, uno debajo del otro (no en grilla).
  const charmX = 66, charmStartY = 172, charmGap = 28;
  const charmsMarkup = (charmIds || []).map((id, i) => {
    const cy = charmStartY + i * charmGap;
    return `
      <circle cx="${charmX}" cy="${cy}" r="12" fill="#FAF7F2" stroke="rgba(0,0,0,.14)" stroke-width="1"></circle>
      <text x="${charmX}" y="${cy + 5}" text-anchor="middle" font-size="14">${CHARM_EMOJI[id] || "•"}</text>`;
  }).join("");
  const badgeMarkup = size ? `
    <rect x="149" y="16" width="41" height="24" rx="12" fill="#FAF7F2"></rect>
    <text x="169.5" y="32" text-anchor="middle" font-family="'Manrope',sans-serif" font-weight="700" font-size="12" fill="#3D2913">${escapeXml(size)}</text>` : "";
  return `
  <svg class="journal-svg-dynamic" viewBox="0 0 220 300" style="width:150px; overflow:visible;">
    <defs>
      <filter id="pv-shadow" x="-60%" y="-30%" width="220%" height="180%">
        <feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#000" flood-opacity=".3"></feDropShadow>
      </filter>
    </defs>
    <g filter="url(#pv-shadow)">
      <rect x="30" y="10" width="150" height="280" rx="20" fill="${coverHex}"></rect>
      <circle cx="47" cy="30" r="3" fill="rgba(255,255,255,.5)"></circle>
      <circle cx="163" cy="30" r="3" fill="rgba(255,255,255,.5)"></circle>
      <circle cx="47" cy="270" r="3" fill="rgba(255,255,255,.5)"></circle>
      <circle cx="163" cy="270" r="3" fill="rgba(255,255,255,.5)"></circle>
      ${engraveMarkup}
      <rect x="30" y="140" width="150" height="11" fill="${elasticHex}"></rect>
      <rect x="30" y="140" width="150" height="3" fill="rgba(255,255,255,.2)"></rect>
      ${charmsMarkup}
    </g>
    ${badgeMarkup}
  </svg>`;
}

// "Por dentro": los 3 cuadernos lado a lado, cada uno con su color y pauta.
function buildInteriorSVG(notebooks) {
  const w = 56, gap = 8, totalW = w * 3 + gap * 2, startX = (220 - totalW) / 2;
  const patternDefs = `
    <defs>
      <pattern id="pat-punteada" width="9" height="9" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.1" fill="rgba(35,31,27,.35)"></circle>
      </pattern>
      <pattern id="pat-rayada" width="10" height="10" patternUnits="userSpaceOnUse">
        <line x1="0" y1="9" x2="10" y2="9" stroke="rgba(35,31,27,.3)" stroke-width="1"></line>
      </pattern>
    </defs>`;
  const notebooksMarkup = notebooks.map((nb, i) => {
    const cover = byId(NOTEBOOK_COVERS, nb.cover);
    const x = startX + i * (w + gap);
    const pageFill = nb.pauta === "lisa" ? "#FBF8F2" : `url(#pat-${nb.pauta})`;
    const pageBase = nb.pauta === "lisa" ? "" : `<rect x="${x + 6}" y="70" width="${w - 12}" height="196" rx="3" fill="#FBF8F2"></rect>`;
    return `
      <rect x="${x}" y="20" width="${w}" height="260" rx="9" fill="${cover.hex}"></rect>
      <rect x="${x + 6}" y="70" width="${w - 12}" height="196" rx="3" fill="${pageFill}"></rect>
      ${pageBase}
      <circle cx="${x + w / 2}" cy="35" r="10" fill="rgba(255,255,255,.88)"></circle>
      <text class="nb-badge" x="${x + w / 2}" y="39" text-anchor="middle" font-size="11" fill="#1B2740">${i + 1}</text>`;
  }).join("");
  return `<svg class="journal-svg-dynamic" viewBox="0 0 220 300" style="width:190px;">${patternDefs}${notebooksMarkup}</svg>`;
}

// Wire de las tabs "Por fuera"/"Por dentro" de una sidebar de preview.
// onSideChange(side) debe actualizar el estado de la página y volver a renderizar.
function setupPreviewTabs(tabsId, onSideChange) {
  document.querySelectorAll(`#${tabsId} .preview-tab`).forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(`#${tabsId} .preview-tab`).forEach(b => b.classList.toggle("active", b === btn));
      onSideChange(btn.dataset.side);
    });
  });
}
