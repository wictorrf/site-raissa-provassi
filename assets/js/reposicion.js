/* ============================================================
   PRIORI — controller de reposicion.html: dos cuadernos de repuesto,
   cada uno con su propio tamaño, color, pauta y cantidad.
   ============================================================ */

(function () {
  const FLOW = "refill";
  const SIZE_FLOW = "refill";
  const MAX_QTY = 20;

  const defaultNotebook = () => ({ size: "A5", cover: COVERS_REPOSICION[0].id, pauta: "lisa", qty: 1 });
  const defaultState = () => ({ notebooks: [defaultNotebook(), defaultNotebook()] });

  // merge en vez de reemplazo directo: un estado guardado por una sesión
  // anterior (antes de que se agregara algún campo nuevo) no debe dejar
  // ese campo undefined y romper el render.
  let c = Object.assign(defaultState(), loadLiveState(FLOW) || {});
  // un estado guardado de una versión anterior puede traer 3 cuadernos, colores que ya
  // no existen o ningún campo de cantidad: se lo lleva a opciones válidas.
  c.notebooks = defaultState().notebooks.map((def, i) => {
    const nb = (c.notebooks && c.notebooks[i]) || def;
    return {
      size: SIZE_PRICES[SIZE_FLOW][nb.size] ? nb.size : def.size,
      cover: byId(COVERS_REPOSICION, nb.cover) ? nb.cover : def.cover,
      pauta: byId(PAUTAS_REFILL, nb.pauta) ? nb.pauta : def.pauta,
      qty: Number.isInteger(nb.qty) ? Math.min(Math.max(nb.qty, 0), MAX_QTY) : def.qty,
    };
  });
  // el pedido siempre tiene al menos 1 cuaderno
  if (c.notebooks.every(nb => nb.qty === 0)) c.notebooks[0].qty = 1;

  function persist() { saveLiveState(FLOW, c); }

  // cuadernos que de verdad se piden (cantidad > 0), conservando su número original
  function ordered() {
    return c.notebooks.map((nb, i) => ({ nb, n: i + 1 })).filter(({ nb }) => nb.qty > 0);
  }

  function total() {
    return c.notebooks.reduce((sum, nb) => sum + SIZE_PRICES[SIZE_FLOW][nb.size] * nb.qty, 0);
  }

  function renderNotebooks() {
    const wrap = document.getElementById("notebooksWrap");
    wrap.innerHTML = c.notebooks.map((nb, i) => `<div class="notebook-block" data-nbblock="${i}"></div>`).join("");
    c.notebooks.forEach((nb, i) => {
      const othersQty = c.notebooks.reduce((sum, other, j) => j === i ? sum : sum + other.qty, 0);
      renderNotebookBlock(wrap.querySelector(`[data-nbblock="${i}"]`), i, nb, {
        covers: COVERS_REPOSICION,
        pautaOptions: PAUTAS_REFILL,
        showSize: true,
        sizePrices: SIZE_PRICES[SIZE_FLOW],
        showQty: true,
        minQty: othersQty === 0 ? 1 : 0, // no deja bajar a 0 si el otro cuaderno ya está en 0
        maxQty: MAX_QTY,
        onQtyChange: (val) => { c.notebooks[i].qty = val; refresh(); },
        onCoverChange: (val) => { c.notebooks[i].cover = val; refresh(); },
        onPautaChange: (val) => { c.notebooks[i].pauta = val; refresh(); },
        onSizeChange: (val) => { c.notebooks[i].size = val; refresh(); },
      });
    });
  }

  function renderPreview() {
    const box = document.getElementById("refillPreviewBox");
    const notebooks = ordered().map(({ nb, n }) => ({ coverHex: byId(COVERS_REPOSICION, nb.cover).hex, pauta: nb.pauta, label: n }));
    box.innerHTML = buildInteriorSVG(notebooks);
  }

  function describe(nb) {
    return `x${nb.qty} · ${nb.size} · ${byId(COVERS_REPOSICION, nb.cover).name} · ${byId(PAUTAS_REFILL, nb.pauta).name}`;
  }

  function refresh() {
    persist();

    renderNotebooks();
    renderPreview();

    document.getElementById("refillSummary").innerHTML = ordered().map(({ nb, n }) =>
      `<div class="sum-row"><span class="k">Cuaderno ${n}</span><span class="v">${describe(nb)}</span></div>`).join("");

    const t = total();
    document.getElementById("refillTotal").textContent = money(t);
    document.getElementById("refillTotalMobile").textContent = money(t);
  }

  function goToDelivery() {
    const lines = ordered().map(({ nb, n }) => ({ label: `Cuaderno ${n}`, value: describe(nb) }));
    savePendingOrder({ flow: FLOW, lines, total: total() });
    window.location.href = "entrega.html";
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("refillContinueBtn").addEventListener("click", goToDelivery);
    document.getElementById("refillContinueBtnMobile").addEventListener("click", goToDelivery);
    refresh();
  });
})();
