/* ============================================================
   PRIORI — bloque "Sumá algo más" (los 3 refis extra con cantidad),
   compartido entre personalizar.js y coleccion.js.
   ============================================================ */

// flow = "preset" (coleccion.html) | "custom" (personalizar.html) — cada uno
// usa su propia lista de precios en REFILL_EXTRAS (data.js).
// refillQty = { [itemId]: cantidad }, refillColors = { [itemId]: colorId }
// refillPauta = { [itemId]: pautaId } (solo se usa en items con pautaOptions)
// refillPhotoIndex = { [itemId]: índice del carrusel de fotos }
function renderAddonsBlock(container, { flow, refillQty, refillColors, refillPauta, refillPhotoIndex, onRefillQtyChange, onRefillColorChange, onRefillPautaChange, onRefillPhotoIndexChange }) {
  const extras = REFILL_EXTRAS[flow];

  const refillCards = extras.map(item => {
    let colorMarkup = "";
    if (item.colors) {
      colorMarkup = `<div class="nb-row"><span class="nb-label">Color</span><div class="swatch-row" data-refillcolor="${item.id}"></div></div>`;
    } else if (item.fixedColorLabel) {
      colorMarkup = `<p class="addon-fixed-color">${item.fixedColorLabel}</p>`;
    }
    return `
      <div class="addon-card refill-extra-card">
        <div class="refill-extra-body">
          <div class="addon-top"><strong>${item.name}</strong><span class="addon-price">${money(item.unitPrice)} c/u</span></div>
          <div class="nb-row addon-qty-row">
            <span class="nb-label">Cantidad</span>
            <div class="qty-stepper" data-refillqty="${item.id}"></div>
          </div>
          ${colorMarkup}
          <div class="nb-row">
            <span class="nb-label">Pauta</span>
            <div class="pauta-row" data-refillpauta="${item.id}"></div>
          </div>
        </div>
        <div class="refill-extra-photos" data-refillphotos="${item.id}"></div>
      </div>`;
  }).join("");

  container.innerHTML = refillCards;

  extras.forEach(item => {
    renderQuantityStepper(container.querySelector(`[data-refillqty="${item.id}"]`), refillQty[item.id] || 0, (n) => onRefillQtyChange(item.id, n));
    if (item.colors) {
      renderSwatchRow(container.querySelector(`[data-refillcolor="${item.id}"]`), item.colors, refillColors[item.id] || item.colors[0].id, (val) => onRefillColorChange(item.id, val));
    }
    const pautaContainer = container.querySelector(`[data-refillpauta="${item.id}"]`);
    if (item.pautaOptions) {
      renderPautaRow(pautaContainer, refillPauta[item.id] || item.pautaOptions[0].id, (val) => onRefillPautaChange(item.id, val), item.pautaOptions);
    } else {
      renderPautaRow(pautaContainer, item.pauta, () => {}, [byId(PAUTAS, item.pauta)]);
    }
    renderPhotoCarousel(container.querySelector(`[data-refillphotos="${item.id}"]`), item.photos, refillPhotoIndex[item.id] || 0, item.name, (idx) => onRefillPhotoIndexChange(item.id, idx));
  });
}

// Resuelve la pauta efectiva de un ítem de refil extra: fija (item.pauta) o
// la que la clienta eligió (refillPauta) cuando el item tiene pautaOptions.
function refillItemPautaName(item, refillPauta) {
  const id = item.pautaOptions ? (refillPauta[item.id] || item.pautaOptions[0].id) : item.pauta;
  return byId(PAUTAS, id).name;
}

function refillExtrasTotal(flow, refillQty) {
  return REFILL_EXTRAS[flow].reduce((sum, item) => sum + (refillQty[item.id] || 0) * item.unitPrice, 0);
}
