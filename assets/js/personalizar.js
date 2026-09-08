/* ============================================================
   PRIORI — controller de personalizar.html (configurador de 8 pasos)
   ============================================================ */

(function () {
  const FLOW = "custom";

  const defaultState = () => ({
    size: "A5",
    leather: "marron",
    elastic: "marron",
    notebooks: [
      { cover: "azul", pauta: "lisa" },
      { cover: "rosa", pauta: "lisa" },
      { cover: "negro", pauta: "lisa" },
    ],
    engrave: { on: false, text: "" },
    charms: [],
    accessories: [],
    addons: { refill: false, gift: false },
    previewSide: "fuera",
  });

  let c = loadLiveState(FLOW) || defaultState();

  function persist() { saveLiveState(FLOW, c); }

  function total() {
    const size = byId(SIZES, c.size);
    let t = size.price;
    c.notebooks.forEach(nb => { if (nb.pauta !== "lisa") t += PRINTED_PAUTA_PRICE; });
    if (c.engrave.on) t += 4000;
    c.charms.forEach(id => { t += byId(CHARMS, id).price; });
    c.accessories.forEach(id => { t += byId(ACCESSORIES, id).price; });
    if (c.addons.refill) t += ADDONS.refill.price;
    if (c.addons.gift) {
      let base = size.price;
      c.notebooks.forEach(nb => { if (nb.pauta !== "lisa") base += PRINTED_PAUTA_PRICE; });
      t += Math.round(base * (1 - GIFT_DISCOUNT));
    }
    return t;
  }

  function baseForGift() {
    const size = byId(SIZES, c.size);
    let base = size.price;
    c.notebooks.forEach(nb => { if (nb.pauta !== "lisa") base += PRINTED_PAUTA_PRICE; });
    return base;
  }

  function renderNotebooks() {
    const wrap = document.getElementById("notebooksWrap");
    wrap.innerHTML = c.notebooks.map((nb, i) => `
      <div class="notebook-block">
        <h4>Cuaderno ${i + 1}</h4>
        <div class="nb-row">
          <span class="nb-label">Tapa</span>
          <div class="swatch-row" data-nbcover="${i}"></div>
        </div>
        <div class="nb-row">
          <span class="nb-label">Pauta</span>
          <div class="pauta-row" data-nbpauta="${i}"></div>
        </div>
      </div>`).join("");

    c.notebooks.forEach((nb, i) => {
      renderSwatchRow(wrap.querySelector(`[data-nbcover="${i}"]`), NOTEBOOK_COVERS, nb.cover, (val) => {
        c.notebooks[i].cover = val; refresh();
      });
      renderPautaRow(wrap.querySelector(`[data-nbpauta="${i}"]`), nb.pauta, (val) => {
        c.notebooks[i].pauta = val; refresh();
      });
    });
  }

  function renderPreview() {
    const box = document.getElementById("custPreviewBox");
    if (c.previewSide === "dentro") {
      box.innerHTML = buildInteriorSVG(c.notebooks);
    } else {
      const lc = byId(LEATHER_COLORS, c.leather), ec = byId(ELASTIC_COLORS, c.elastic);
      box.innerHTML = buildExteriorSVG({ coverHex: lc.hex, elasticHex: ec.hex, engraveOn: c.engrave.on, engraveText: c.engrave.text, charmIds: c.charms, size: c.size });
    }
  }

  function refresh() {
    persist();

    renderSizeGrid(document.getElementById("custSizeGrid"), c.size, (val) => { c.size = val; renderAddons(); refresh(); });
    renderSwatchRow(document.getElementById("leatherGrid"), LEATHER_COLORS, c.leather, (val) => { c.leather = val; refresh(); });
    renderSwatchRow(document.getElementById("elasticGrid"), ELASTIC_COLORS, c.elastic, (val) => { c.elastic = val; refresh(); });

    document.getElementById("engraveToggle").classList.toggle("on", c.engrave.on);
    document.getElementById("engraveInputWrap").classList.toggle("show", c.engrave.on);
    document.getElementById("engraveText").value = c.engrave.text;

    document.querySelectorAll("#charmGrid .chip").forEach(el => {
      el.classList.toggle("selected", c.charms.includes(el.dataset.id));
    });
    document.querySelectorAll("#accessoryGrid .chip").forEach(el => {
      el.classList.toggle("selected", c.accessories.includes(el.dataset.id));
    });

    renderPreview();

    const size = byId(SIZES, c.size);
    const lc = byId(LEATHER_COLORS, c.leather), ec = byId(ELASTIC_COLORS, c.elastic);

    let rows = `
      <div class="sum-row"><span class="k">Tamaño</span><span class="v">${size.name}</span></div>
      <div class="sum-row"><span class="k">Cuero</span><span class="v">${lc.name}</span></div>
      <div class="sum-row"><span class="k">Elástico</span><span class="v">${ec.name}</span></div>`;
    c.notebooks.forEach((nb, i) => {
      const cover = byId(NOTEBOOK_COVERS, nb.cover), pauta = byId(PAUTAS, nb.pauta);
      rows += `<div class="sum-row"><span class="k">Cuaderno ${i + 1}</span><span class="v">${cover.name} · ${pauta.name}</span></div>`;
    });
    if (c.engrave.on) rows += `<div class="sum-row"><span class="k">Grabado</span><span class="v">${c.engrave.text || "Sin texto"}</span></div>`;
    if (c.charms.length) rows += `<div class="sum-row"><span class="k">Dijes</span><span class="v">${c.charms.map(id => byId(CHARMS, id).name).join(", ")}</span></div>`;
    if (c.accessories.length) rows += `<div class="sum-row"><span class="k">Extras</span><span class="v">${c.accessories.map(id => byId(ACCESSORIES, id).name).join(", ")}</span></div>`;
    document.getElementById("custSummary").innerHTML = rows;

    const t = total();
    document.getElementById("custTotal").textContent = money(t);
    document.getElementById("custTotalMobile").textContent = money(t);
  }

  function renderAddons() {
    renderAddonsBlock(document.getElementById("custAddonsWrap"), {
      addonsState: c.addons,
      base: baseForGift(),
      onToggle: (id) => { c.addons[id] = !c.addons[id]; refresh(); },
    });
  }

  function goToDelivery() {
    const size = byId(SIZES, c.size), lc = byId(LEATHER_COLORS, c.leather), ec = byId(ELASTIC_COLORS, c.elastic);
    const lines = [
      { label: "Modelo", value: "personalizado" },
      { label: "Tamaño", value: size.name },
      { label: "Cuero", value: lc.name },
      { label: "Elástico", value: ec.name },
    ];
    c.notebooks.forEach((nb, i) => {
      const cover = byId(NOTEBOOK_COVERS, nb.cover), pauta = byId(PAUTAS, nb.pauta);
      lines.push({ label: `Cuaderno ${i + 1}`, value: `${cover.name} · ${pauta.name}` });
    });
    if (c.engrave.on) lines.push({ label: "Grabado", value: c.engrave.text || "(sin texto indicado)" });
    if (c.charms.length) lines.push({ label: "Dijes", value: c.charms.map(id => byId(CHARMS, id).name).join(", ") });
    if (c.accessories.length) lines.push({ label: "Detalles extra", value: c.accessories.map(id => byId(ACCESSORIES, id).name).join(", ") });
    if (c.addons.refill) lines.push({ label: "Agregado", value: ADDONS.refill.name });
    if (c.addons.gift) lines.push({ label: "Agregado", value: `segundo journal de regalo (-${Math.round(GIFT_DISCOUNT * 100)}%)` });

    savePendingOrder({ flow: FLOW, lines, total: total() });
    window.location.href = "entrega.html";
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("custPautaHint").textContent = money(PRINTED_PAUTA_PRICE);
    document.getElementById("engravePriceHint").textContent = money(4000);
    document.getElementById("charmPriceHint").textContent = money(3000);

    renderNotebooks();
    renderCharmGrid(document.getElementById("charmGrid"), CHARMS, c.charms, (id) => {
      toggleInArray(c.charms, id); refresh();
    });
    renderChipGrid(document.getElementById("accessoryGrid"), ACCESSORIES, c.accessories, (id) => {
      toggleInArray(c.accessories, id); refresh();
    });
    renderAddons();
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
