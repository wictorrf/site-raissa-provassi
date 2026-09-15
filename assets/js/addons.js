/* ============================================================
   PRIORI — bloque "Sumá algo más" (los 3 refis extra con cantidad
   + "Regalá a alguien"), compartido entre personalizar.js y
   coleccion.js.
   ============================================================ */

// flow = "preset" (coleccion.html) | "custom" (personalizar.html) — cada uno
// usa su propia lista de precios en REFILL_EXTRAS (data.js).
// refillQty = { [itemId]: cantidad }, refillColors = { [itemId]: colorId }
// addonsState = { gift: bool }, base = precio del journal sin extras (para el 35% off)
function renderAddonsBlock(container, { flow, refillQty, refillColors, addonsState, base, onRefillQtyChange, onRefillColorChange, onToggleGift }) {
  const extras = REFILL_EXTRAS[flow];
  const giftPrice = Math.round(base * (1 - GIFT_DISCOUNT));

  const refillCards = extras.map(item => {
    let colorMarkup = "";
    if (item.colors) {
      colorMarkup = `<div class="nb-row"><span class="nb-label">Color</span><div class="swatch-row" data-refillcolor="${item.id}"></div></div>`;
    } else if (item.fixedColorLabel) {
      colorMarkup = `<p class="addon-fixed-color">${item.fixedColorLabel}</p>`;
    }
    return `
      <div class="addon-card refill-extra-card">
        <div class="addon-body">
          <div class="addon-top"><strong>${item.name}</strong><span class="addon-price">${money(item.unitPrice)} c/u</span></div>
          <div class="nb-row addon-qty-row">
            <span class="nb-label">Cantidad</span>
            <div class="qty-stepper" data-refillqty="${item.id}"></div>
          </div>
          ${colorMarkup}
          <div class="nb-row">
            <span class="nb-label">Fotos de referencia</span>
            <div class="photo-slots-row" data-refillphotos="${item.id}"></div>
          </div>
        </div>
      </div>`;
  }).join("");

  container.innerHTML = refillCards + `
    <div class="addon-card ${addonsState.gift ? 'selected' : ''}" data-id="gift">
      <div class="addon-check">✓</div>
      <div class="addon-body">
        <div class="addon-top"><strong>Regalá a alguien</strong><span class="addon-price"><span class="was">${money(base)}</span>${money(giftPrice)}</span></div>
        <p>Llevá un segundo journal (mismo tamaño y pauta) con ${Math.round(GIFT_DISCOUNT * 100)}% de descuento.</p>
      </div>
    </div>`;

  extras.forEach(item => {
    renderQuantityStepper(container.querySelector(`[data-refillqty="${item.id}"]`), refillQty[item.id] || 0, (n) => onRefillQtyChange(item.id, n));
    if (item.colors) {
      renderSwatchRow(container.querySelector(`[data-refillcolor="${item.id}"]`), item.colors, refillColors[item.id] || item.colors[0].id, (val) => onRefillColorChange(item.id, val));
    }
    renderPhotoSlots(container.querySelector(`[data-refillphotos="${item.id}"]`), item.photos, item.name);
  });

  container.querySelector('[data-id="gift"]').addEventListener("click", onToggleGift);
}

function refillExtrasTotal(flow, refillQty) {
  return REFILL_EXTRAS[flow].reduce((sum, item) => sum + (refillQty[item.id] || 0) * item.unitPrice, 0);
}
