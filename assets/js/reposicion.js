/* ============================================================
   PRIORI — controller de reposicion.html (juego de 3 cuadernos
   de repuesto, cor sólida). Precio fijo, fuente única REFILL_SETS.
   ============================================================ */

(function () {
  const FLOW = "refill";

  const defaultState = () => ({ cover: "azul", pauta: "lisa" });
  let c = loadLiveState(FLOW) || defaultState();

  function persist() { saveLiveState(FLOW, c); }

  function renderPreview() {
    const box = document.getElementById("refillPreviewBox");
    const notebooks = [c.cover, c.cover, c.cover].map(cover => ({ cover, pauta: c.pauta }));
    box.innerHTML = buildInteriorSVG(notebooks);
  }

  function refresh() {
    persist();

    renderSwatchRow(document.getElementById("refillCoverGrid"), NOTEBOOK_COVERS, c.cover, (val) => { c.cover = val; refresh(); });
    renderPautaRow(document.getElementById("refillPautaRow"), c.pauta, (val) => { c.pauta = val; refresh(); });

    renderPreview();

    const cover = byId(NOTEBOOK_COVERS, c.cover), pauta = byId(PAUTAS, c.pauta);
    document.getElementById("refillSummary").innerHTML = `
      <div class="sum-row"><span class="k">Producto</span><span class="v">${REFILL_SETS.simple.name}</span></div>
      <div class="sum-row"><span class="k">Color</span><span class="v">${cover.name}</span></div>
      <div class="sum-row"><span class="k">Pauta</span><span class="v">${pauta.name}</span></div>`;

    const t = REFILL_SETS.simple.price;
    document.getElementById("refillTotal").textContent = money(t);
    document.getElementById("refillTotalMobile").textContent = money(t);
  }

  function goToDelivery() {
    const cover = byId(NOTEBOOK_COVERS, c.cover), pauta = byId(PAUTAS, c.pauta);
    const lines = [
      { label: "Producto", value: REFILL_SETS.simple.name },
      { label: "Color", value: cover.name },
      { label: "Pauta", value: pauta.name },
    ];
    savePendingOrder({ flow: FLOW, lines, total: REFILL_SETS.simple.price });
    window.location.href = "entrega.html";
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("refillContinueBtn").addEventListener("click", goToDelivery);
    document.getElementById("refillContinueBtnMobile").addEventListener("click", goToDelivery);
    refresh();
  });
})();
