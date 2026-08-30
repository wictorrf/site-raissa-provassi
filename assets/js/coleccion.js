/* ============================================================
   PRIORI — controller de coleccion.html (colección lista, 4 pasos)
   ============================================================ */

(function () {
  const FLOW = "collection";
  const DEFAULT_INTERIOR_NOTEBOOKS = ["azul", "rosa", "negro"];

  function presetFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("preset");
    return byId(PRESETS, id) ? id : "clasico";
  }

  const defaultState = () => ({
    preset: presetFromQuery(),
    size: "A5",
    pauta: "lisa",
    addons: { refill: false, gift: false },
    previewSide: "fuera",
  });

  let c = loadLiveState(FLOW) || defaultState();
  // si vino con ?preset= de la home, prioriza ese modelo aunque haya estado guardado.
  const qPreset = new URLSearchParams(window.location.search).get("preset");
  if (qPreset && byId(PRESETS, qPreset)) c.preset = qPreset;

  function persist() { saveLiveState(FLOW, c); }

  function baseTotal() {
    const size = byId(SIZES, c.size);
    let t = size.price;
    if (c.pauta !== "lisa") t += PRINTED_PAUTA_PRICE * 3;
    return t;
  }
  function total() {
    let t = baseTotal();
    if (c.addons.refill) t += ADDONS.refill.price;
    if (c.addons.gift) t += Math.round(baseTotal() * (1 - GIFT_DISCOUNT));
    return t;
  }

  function renderPresetGrid() {
    const grid = document.getElementById("presetGrid");
    grid.innerHTML = PRESETS.map(p => {
      const lc = byId(LEATHER_COLORS, p.leather), ec = byId(ELASTIC_COLORS, p.elastic);
      return `<div class="preset-card ${p.id === c.preset ? 'selected' : ''}" data-id="${p.id}">
        <div class="preset-photo photo-slot" data-photo-hint="foto: modelo ${p.name}" style="background:linear-gradient(150deg, ${lc.hex}22, ${ec.hex}33);">
          ${journalIconSVG(lc.hex, ec.hex, 74)}
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
      const notebooks = DEFAULT_INTERIOR_NOTEBOOKS.map(cover => ({ cover, pauta: c.pauta }));
      box.innerHTML = buildInteriorSVG(notebooks);
    } else {
      box.innerHTML = buildExteriorSVG({ coverHex: lc.hex, elasticHex: ec.hex, engraveOn: false, engraveText: "", charmIds: [] });
    }
  }

  function renderAddons() {
    renderAddonsBlock(document.getElementById("collAddonsWrap"), {
      addonsState: c.addons,
      base: baseTotal(),
      onToggle: (id) => { c.addons[id] = !c.addons[id]; refresh(); },
    });
  }

  function refresh() {
    persist();

    document.querySelectorAll("#presetGrid .preset-card").forEach(el => {
      el.classList.toggle("selected", el.dataset.id === c.preset);
    });
    renderSizeGrid(document.getElementById("collSizeGrid"), c.size, (val) => { c.size = val; renderAddons(); refresh(); });
    renderPautaRow(document.getElementById("collPautaRow"), c.pauta, (val) => { c.pauta = val; renderAddons(); refresh(); });

    renderPreview();

    const preset = byId(PRESETS, c.preset);
    const lc = byId(LEATHER_COLORS, preset.leather), ec = byId(ELASTIC_COLORS, preset.elastic);
    const size = byId(SIZES, c.size), pauta = byId(PAUTAS, c.pauta);

    document.getElementById("collSummary").innerHTML = `
      <div class="sum-row"><span class="k">Modelo</span><span class="v">${preset.name}</span></div>
      <div class="sum-row"><span class="k">Tamaño</span><span class="v">${size.name}</span></div>
      <div class="sum-row"><span class="k">Cuero</span><span class="v">${lc.name}</span></div>
      <div class="sum-row"><span class="k">Elástico</span><span class="v">${ec.name}</span></div>
      <div class="sum-row"><span class="k">Pauta</span><span class="v">${pauta.name}</span></div>`;

    const t = total();
    document.getElementById("collTotal").textContent = money(t);
    document.getElementById("collTotalMobile").textContent = money(t);
  }

  function goToDelivery() {
    const preset = byId(PRESETS, c.preset);
    const lc = byId(LEATHER_COLORS, preset.leather), ec = byId(ELASTIC_COLORS, preset.elastic);
    const size = byId(SIZES, c.size), pauta = byId(PAUTAS, c.pauta);
    const lines = [
      { label: "Modelo", value: `${preset.name} (colección)` },
      { label: "Tamaño", value: size.name },
      { label: "Cuero", value: lc.name },
      { label: "Elástico", value: ec.name },
      { label: "Pauta (3 cuadernos)", value: pauta.name },
    ];
    if (c.addons.refill) lines.push({ label: "Agregado", value: ADDONS.refill.name });
    if (c.addons.gift) lines.push({ label: "Agregado", value: `segundo journal de regalo (-${Math.round(GIFT_DISCOUNT * 100)}%)` });

    savePendingOrder({ flow: FLOW, lines, total: total() });
    window.location.href = "entrega.html";
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("collPautaHint").textContent = money(PRINTED_PAUTA_PRICE * 3);

    renderPresetGrid();
    renderAddons();
    setupPreviewTabs("collPreviewTabs", (side) => { c.previewSide = side; refresh(); });
    if (c.previewSide === "dentro") {
      document.querySelectorAll("#collPreviewTabs .preview-tab").forEach(b => b.classList.toggle("active", b.dataset.side === "dentro"));
    }

    document.getElementById("collContinueBtn").addEventListener("click", goToDelivery);
    document.getElementById("collContinueBtnMobile").addEventListener("click", goToDelivery);

    refresh();
  });
})();
