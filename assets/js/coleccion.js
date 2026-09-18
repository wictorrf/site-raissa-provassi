/* ============================================================
   PRIORI — controller de coleccion.html (colección lista, 3 pasos)
   ============================================================ */

(function () {
  const FLOW = "collection";
  const SIZE_FLOW = "preset";
  const INTERIOR_PREVIEW_HEXES = [COVERS_BUILD[0].hex, COVERS_BUILD[2].hex, COVERS_BUILD[5].hex];

  function presetFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("preset");
    return byId(PRESETS, id) ? id : PRESETS[0].id;
  }

  const defaultState = () => ({
    preset: presetFromQuery(),
    size: "A5",
    addons: { gift: false },
    refill: {},
    refillColors: {},
    previewSide: "fuera",
  });

  let c = loadLiveState(FLOW) || defaultState();
  // si vino con ?preset= de la home, prioriza ese modelo aunque haya estado guardado.
  const qPreset = new URLSearchParams(window.location.search).get("preset");
  if (qPreset && byId(PRESETS, qPreset)) c.preset = qPreset;

  function persist() { saveLiveState(FLOW, c); }

  // la pauta de la colección lista es siempre "lisa" — no es seleccionable
  // (la clienta pidió sacar la opción de punteada/rayada acá).
  function baseTotal() {
    return byId(sizesFor(SIZE_FLOW), c.size).price;
  }
  function total() {
    let t = baseTotal();
    t += refillExtrasTotal(SIZE_FLOW, c.refill);
    if (c.addons.gift) t += Math.round(baseTotal() * (1 - GIFT_DISCOUNT));
    return t;
  }

  function renderPresetGrid() {
    const grid = document.getElementById("presetGrid");
    grid.innerHTML = PRESETS.map(p => {
      const lc = byId(LEATHER_COLORS, p.leather), ec = byId(ELASTIC_COLORS, p.elastic);
      return `<div class="preset-card ${p.id === c.preset ? 'selected' : ''}" data-id="${p.id}">
        <div class="preset-photo photo-slot" data-photo-hint="foto: modelo ${p.name}" style="background:linear-gradient(150deg, ${lc.hex}22, ${ec.hex}33);">
          <span>Foto</span>
        </div>
        <div class="preset-card-body">
          <div>
            <div class="preset-name">${p.name}</div>
            <p class="preset-copy">${p.copy}</p>
            <div class="preset-desc">${p.desc}</div>
          </div>
        </div>
      </div>`;
    }).join("");
    grid.querySelectorAll(".preset-card").forEach(el => {
      el.addEventListener("click", () => { c.preset = el.dataset.id; refresh(); });
    });
  }

  function renderPreview() {
    const box = document.getElementById("collPreviewBox");
    const preset = byId(PRESETS, c.preset);
    const lc = byId(LEATHER_COLORS, preset.leather), ec = byId(ELASTIC_COLORS, preset.elastic);
    if (c.previewSide === "dentro") {
      const notebooks = INTERIOR_PREVIEW_HEXES.map(coverHex => ({ coverHex, pauta: "lisa" }));
      box.innerHTML = buildInteriorSVG(notebooks);
    } else {
      box.innerHTML = buildExteriorSVG({ coverHex: lc.hex, elasticHex: ec.hex, engraveOn: false, engraveText: "", charmIds: [], size: c.size });
    }
  }

  function renderAddons() {
    renderAddonsBlock(document.getElementById("collAddonsWrap"), {
      flow: SIZE_FLOW,
      refillQty: c.refill,
      refillColors: c.refillColors,
      addonsState: c.addons,
      base: baseTotal(),
      onRefillQtyChange: (id, n) => { c.refill[id] = n; refresh(); },
      onRefillColorChange: (id, val) => { c.refillColors[id] = val; refresh(); },
      onToggleGift: () => { c.addons.gift = !c.addons.gift; refresh(); },
    });
  }

  function refresh() {
    persist();

    document.querySelectorAll("#presetGrid .preset-card").forEach(el => {
      el.classList.toggle("selected", el.dataset.id === c.preset);
    });
    renderSizeGrid(document.getElementById("collSizeGrid"), sizesFor(SIZE_FLOW), c.size, (val) => { c.size = val; renderAddons(); refresh(); });
    renderAddons();

    renderPreview();

    const preset = byId(PRESETS, c.preset);
    const lc = byId(LEATHER_COLORS, preset.leather), ec = byId(ELASTIC_COLORS, preset.elastic);
    const size = byId(sizesFor(SIZE_FLOW), c.size);

    document.getElementById("collSummary").innerHTML = `
      <div class="sum-row"><span class="k">Modelo</span><span class="v">${preset.name}</span></div>
      <div class="sum-row"><span class="k">Tamaño</span><span class="v">${size.name}</span></div>
      <div class="sum-row"><span class="k">Cuero</span><span class="v">${lc.name}</span></div>
      <div class="sum-row"><span class="k">Elástico</span><span class="v">${ec.name}</span></div>
      <div class="sum-row"><span class="k">Pauta</span><span class="v">Lisa</span></div>`;

    const t = total();
    document.getElementById("collTotal").textContent = money(t);
    document.getElementById("collTotalMobile").textContent = money(t);
  }

  function goToDelivery() {
    const preset = byId(PRESETS, c.preset);
    const lc = byId(LEATHER_COLORS, preset.leather), ec = byId(ELASTIC_COLORS, preset.elastic);
    const size = byId(sizesFor(SIZE_FLOW), c.size);
    const lines = [
      { label: "Modelo", value: `${preset.name} (colección)` },
      { label: "Tamaño", value: size.name },
      { label: "Cuero", value: lc.name },
      { label: "Elástico", value: ec.name },
      { label: "Pauta (3 cuadernos)", value: "Lisa" },
    ];
    REFILL_EXTRAS[SIZE_FLOW].forEach(item => {
      const qty = c.refill[item.id] || 0;
      if (qty > 0) {
        const color = item.colors ? byId(item.colors, c.refillColors[item.id] || item.colors[0].id).name : item.fixedColorLabel;
        lines.push({ label: `Agregado: ${item.name}`, value: `x${qty} · ${color}` });
      }
    });
    if (c.addons.gift) lines.push({ label: "Agregado", value: `segundo journal de regalo (-${Math.round(GIFT_DISCOUNT * 100)}%)` });

    savePendingOrder({ flow: FLOW, lines, total: total() });
    window.location.href = "entrega.html";
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderPresetGrid();
    setupPreviewTabs("collPreviewTabs", (side) => { c.previewSide = side; refresh(); });
    if (c.previewSide === "dentro") {
      document.querySelectorAll("#collPreviewTabs .preview-tab").forEach(b => b.classList.toggle("active", b.dataset.side === "dentro"));
    }

    document.getElementById("collContinueBtn").addEventListener("click", goToDelivery);
    document.getElementById("collContinueBtnMobile").addEventListener("click", goToDelivery);

    refresh();
  });
})();
