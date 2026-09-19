/* ============================================================
   PRIORI — controller de personalizar.html (configurador de 8 pasos)
   ============================================================ */

(function () {
  const FLOW = "custom";
  const SIZE_FLOW = "custom";

  const defaultState = () => ({
    size: "A5",
    leather: "marron",
    elastic: "marron",
    notebooks: [
      { cover: "azul", pauta: "lisa" },
      { cover: "verde-agua", pauta: "lisa" },
      { cover: "preto", pauta: "lisa" },
    ],
    engrave: { on: false, text: "" },
    charms: [],
    accessories: [],
    refill: {},
    refillColors: {},
    refillPauta: {},
    refillPhotoIndex: {},
    previewSide: "fuera",
  });

  let c = loadLiveState(FLOW) || defaultState();

  function persist() { saveLiveState(FLOW, c); }

  function baseTotal() {
    const size = byId(sizesFor(SIZE_FLOW), c.size);
    let base = size.price;
    c.notebooks.forEach(nb => { if (nb.pauta === "punteada") base += PONTILHADO_EXTRA; });
    return base;
  }

  function total() {
    let t = baseTotal(); // tamaño + extra por pauta punteada
    if (c.engrave.on) t += 4000;
    t += calcCharmsTotal(c.charms);
    c.accessories.forEach(id => { t += byId(ACCESSORIES, id).price; });
    t += refillExtrasTotal(SIZE_FLOW, c.refill);
    return t;
  }

  function charmsSummary() {
    const counts = {};
    c.charms.forEach(id => { counts[id] = (counts[id] || 0) + 1; });
    return Object.keys(counts).map(id => `${byId(CHARMS, id).name}${counts[id] > 1 ? ` x${counts[id]}` : ""}`).join(", ");
  }

  function setCharmQty(id, n) {
    c.charms = c.charms.filter(x => x !== id);
    for (let i = 0; i < n; i++) c.charms.push(id);
    refresh();
  }

  function renderNotebooks() {
    const wrap = document.getElementById("notebooksWrap");
    wrap.innerHTML = c.notebooks.map((nb, i) => `<div class="notebook-block" data-nbblock="${i}"></div>`).join("");
    c.notebooks.forEach((nb, i) => {
      renderNotebookBlock(wrap.querySelector(`[data-nbblock="${i}"]`), i, nb, {
        covers: COVERS_BUILD,
        onCoverChange: (val) => { c.notebooks[i].cover = val; refresh(); },
        onPautaChange: (val) => { c.notebooks[i].pauta = val; refresh(); },
      });
    });
  }

  function renderPreview() {
    const box = document.getElementById("custPreviewBox");
    if (c.previewSide === "dentro") {
      const notebooks = c.notebooks.map(nb => ({ coverHex: byId(COVERS_BUILD, nb.cover).hex, pauta: nb.pauta }));
      box.innerHTML = buildInteriorSVG(notebooks);
    } else {
      const lc = byId(LEATHER_COLORS, c.leather), ec = byId(ELASTIC_COLORS, c.elastic);
      box.innerHTML = buildExteriorSVG({ coverHex: lc.hex, elasticHex: ec.hex, engraveOn: c.engrave.on, engraveText: c.engrave.text, charmIds: c.charms, size: c.size });
    }
  }

  function renderAddons() {
    renderAddonsBlock(document.getElementById("custAddonsWrap"), {
      flow: SIZE_FLOW,
      refillQty: c.refill,
      refillColors: c.refillColors,
      refillPauta: c.refillPauta,
      refillPhotoIndex: c.refillPhotoIndex,
      onRefillQtyChange: (id, n) => { c.refill[id] = n; refresh(); },
      onRefillColorChange: (id, val) => { c.refillColors[id] = val; refresh(); },
      onRefillPautaChange: (id, val) => { c.refillPauta[id] = val; refresh(); },
      onRefillPhotoIndexChange: (id, idx) => { c.refillPhotoIndex[id] = idx; refresh(); },
    });
  }

  function refresh() {
    persist();

    renderSizeGrid(document.getElementById("custSizeGrid"), sizesFor(SIZE_FLOW), c.size, (val) => { c.size = val; refresh(); });
    renderSwatchRow(document.getElementById("leatherGrid"), LEATHER_COLORS, c.leather, (val) => { c.leather = val; refresh(); });
    renderSwatchRow(document.getElementById("elasticGrid"), ELASTIC_COLORS, c.elastic, (val) => { c.elastic = val; refresh(); });

    renderNotebooks();
    renderAddons();

    document.getElementById("engraveToggle").classList.toggle("on", c.engrave.on);
    document.getElementById("engraveInputWrap").classList.toggle("show", c.engrave.on);
    document.getElementById("engraveText").value = c.engrave.text;

    renderCharmGrid(document.getElementById("charmGrid"), CHARMS, c.charms, setCharmQty);
    renderChipGrid(document.getElementById("accessoryGrid"), ACCESSORIES, c.accessories, (id) => {
      toggleInArray(c.accessories, id); refresh();
    });

    renderPreview();

    const size = byId(sizesFor(SIZE_FLOW), c.size);
    const lc = byId(LEATHER_COLORS, c.leather), ec = byId(ELASTIC_COLORS, c.elastic);

    let rows = `
      <div class="sum-row"><span class="k">Tamaño</span><span class="v">${size.name}</span></div>
      <div class="sum-row"><span class="k">Cuero</span><span class="v">${lc.name}</span></div>
      <div class="sum-row"><span class="k">Elástico</span><span class="v">${ec.name}</span></div>`;
    c.notebooks.forEach((nb, i) => {
      const cover = byId(COVERS_BUILD, nb.cover), pauta = byId(PAUTAS, nb.pauta);
      rows += `<div class="sum-row"><span class="k">Cuaderno ${i + 1}</span><span class="v">${cover.name} · ${pauta.name}</span></div>`;
    });
    if (c.engrave.on) rows += `<div class="sum-row"><span class="k">Grabado</span><span class="v">${c.engrave.text || "Sin texto"}</span></div>`;
    if (c.charms.length) rows += `<div class="sum-row"><span class="k">Dijes</span><span class="v">${charmsSummary()}</span></div>`;
    if (c.accessories.length) rows += `<div class="sum-row"><span class="k">Extras</span><span class="v">${c.accessories.map(id => byId(ACCESSORIES, id).name).join(", ")}</span></div>`;
    REFILL_EXTRAS[SIZE_FLOW].forEach(item => {
      const qty = c.refill[item.id] || 0;
      if (qty > 0) {
        const color = item.colors ? byId(item.colors, c.refillColors[item.id] || item.colors[0].id).name : item.fixedColorLabel;
        const pauta = refillItemPautaName(item, c.refillPauta);
        rows += `<div class="sum-row"><span class="k">Agregado</span><span class="v">${item.name} · x${qty} · ${color} · Pauta ${pauta}</span></div>`;
      }
    });
    document.getElementById("custSummary").innerHTML = rows;

    const t = total();
    document.getElementById("custTotal").textContent = money(t);
    document.getElementById("custTotalMobile").textContent = money(t);
  }

  function goToDelivery() {
    const size = byId(sizesFor(SIZE_FLOW), c.size), lc = byId(LEATHER_COLORS, c.leather), ec = byId(ELASTIC_COLORS, c.elastic);
    const lines = [
      { label: "Modelo", value: "personalizado" },
      { label: "Tamaño", value: size.name },
      { label: "Cuero", value: lc.name },
      { label: "Elástico", value: ec.name },
    ];
    c.notebooks.forEach((nb, i) => {
      const cover = byId(COVERS_BUILD, nb.cover), pauta = byId(PAUTAS, nb.pauta);
      lines.push({ label: `Cuaderno ${i + 1}`, value: `${cover.name} · ${pauta.name}` });
    });
    if (c.engrave.on) lines.push({ label: "Grabado", value: c.engrave.text || "(sin texto indicado)" });
    if (c.charms.length) lines.push({ label: "Dijes", value: charmsSummary() });
    if (c.accessories.length) lines.push({ label: "Detalles extra", value: c.accessories.map(id => byId(ACCESSORIES, id).name).join(", ") });
    REFILL_EXTRAS[SIZE_FLOW].forEach(item => {
      const qty = c.refill[item.id] || 0;
      if (qty > 0) {
        const color = item.colors ? byId(item.colors, c.refillColors[item.id] || item.colors[0].id).name : item.fixedColorLabel;
        const pauta = refillItemPautaName(item, c.refillPauta);
        lines.push({ label: `Agregado: ${item.name}`, value: `x${qty} · ${color} · Pauta ${pauta}` });
      }
    });

    savePendingOrder({ flow: FLOW, lines, total: total() });
    window.location.href = "entrega.html";
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("custPautaHint").textContent = money(PONTILHADO_EXTRA);
    document.getElementById("engravePriceHint").textContent = money(4000);
    document.getElementById("charmPriceHint").textContent = money(600);

    renderCharmGrid(document.getElementById("charmGrid"), CHARMS, c.charms, setCharmQty);
    setupPreviewTabs("custPreviewTabs", (side) => { c.previewSide = side; refresh(); });
    if (c.previewSide === "dentro") {
      document.querySelectorAll("#custPreviewTabs .preview-tab").forEach(b => b.classList.toggle("active", b.dataset.side === "dentro"));
    }

    document.getElementById("engraveToggle").addEventListener("click", () => {
      c.engrave.on = !c.engrave.on; refresh();
    });
    document.getElementById("engraveText").addEventListener("input", (e) => {
      c.engrave.text = e.target.value; refresh();
    });

    document.getElementById("custContinueBtn").addEventListener("click", goToDelivery);
    document.getElementById("custContinueBtnMobile").addEventListener("click", goToDelivery);

    refresh();
  });
})();
