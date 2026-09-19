/* ============================================================
   PRIORI — controller de reposicion.html: cada uno de los 3
   cuadernos de repuesto elige su propio tamaño, color y pauta.
   ============================================================ */

(function () {
  const FLOW = "refill";
  const SIZE_FLOW = "refill";

  const defaultNotebook = () => ({ size: "A5", cover: COVERS_REFILL_A5[0].id, pauta: "lisa" });
  const defaultState = () => ({ notebooks: [defaultNotebook(), defaultNotebook(), defaultNotebook()] });

  // merge en vez de reemplazo directo: un estado guardado por una sesión
  // anterior (antes de que se agregara algún campo nuevo) no debe dejar
  // ese campo undefined y romper el render.
  let c = Object.assign(defaultState(), loadLiveState(FLOW) || {});

  function persist() { saveLiveState(FLOW, c); }

  function coversFor(size) { return size === "A6" ? COVERS_REFILL_A6 : COVERS_REFILL_A5; }

  function total() {
    return c.notebooks.reduce((sum, nb) => sum + SIZE_PRICES[SIZE_FLOW][nb.size], 0);
  }

  function renderNotebooks() {
    const wrap = document.getElementById("notebooksWrap");
    wrap.innerHTML = c.notebooks.map((nb, i) => `<div class="notebook-block" data-nbblock="${i}"></div>`).join("");
    c.notebooks.forEach((nb, i) => {
      renderNotebookBlock(wrap.querySelector(`[data-nbblock="${i}"]`), i, nb, {
        covers: coversFor(nb.size),
        pautaOptions: PAUTAS_REFILL,
        showSize: true,
        sizePrices: SIZE_PRICES[SIZE_FLOW],
        onCoverChange: (val) => { c.notebooks[i].cover = val; refresh(); },
        onPautaChange: (val) => { c.notebooks[i].pauta = val; refresh(); },
        onSizeChange: (val) => {
          c.notebooks[i].size = val;
          // al cambiar de tamaño, la paleta de colores cambia — resetea a la primera opción válida.
          c.notebooks[i].cover = coversFor(val)[0].id;
          refresh();
        },
      });
    });
  }

  function renderPreview() {
    const box = document.getElementById("refillPreviewBox");
    const notebooks = c.notebooks.map(nb => ({ coverHex: byId(coversFor(nb.size), nb.cover).hex, pauta: nb.pauta }));
    box.innerHTML = buildInteriorSVG(notebooks);
  }

  function refresh() {
    persist();

    renderNotebooks();
    renderPreview();

    document.getElementById("refillSummary").innerHTML = c.notebooks.map((nb, i) => {
      const cover = byId(coversFor(nb.size), nb.cover), pauta = byId(PAUTAS, nb.pauta);
      return `<div class="sum-row"><span class="k">Cuaderno ${i + 1}</span><span class="v">${nb.size} · ${cover.name} · ${pauta.name}</span></div>`;
    }).join("");

    const t = total();
    document.getElementById("refillTotal").textContent = money(t);
    document.getElementById("refillTotalMobile").textContent = money(t);
  }

  function goToDelivery() {
    const lines = c.notebooks.map((nb, i) => {
      const cover = byId(coversFor(nb.size), nb.cover), pauta = byId(PAUTAS, nb.pauta);
      return { label: `Cuaderno ${i + 1}`, value: `${nb.size} · ${cover.name} · ${pauta.name}` };
    });
    savePendingOrder({ flow: FLOW, lines, total: total() });
    window.location.href = "entrega.html";
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("refillContinueBtn").addEventListener("click", goToDelivery);
    document.getElementById("refillContinueBtnMobile").addEventListener("click", goToDelivery);
    refresh();
  });
})();
