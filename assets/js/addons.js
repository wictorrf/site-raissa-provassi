/* ============================================================
   PRIORI — bloque "Sumá algo más" (refill extra + "Regalá a
   alguien"), compartido entre personalizar.js y coleccion.js.
   ============================================================ */

// base = precio del journal sin extras (para calcular el 35% off del regalo).
// addonsState = { refill: bool, gift: bool }
function renderAddonsBlock(container, { addonsState, base, onToggle }) {
  const giftPrice = Math.round(base * (1 - GIFT_DISCOUNT));
  container.innerHTML = `
    <div class="addon-card ${addonsState.refill ? 'selected' : ''}" data-id="refill">
      <div class="addon-check">✓</div>
      <div class="addon-body">
        <div class="addon-top"><strong>${ADDONS.refill.name}</strong><span class="addon-price"><span class="was">${money(ADDONS.refill.original)}</span>${money(ADDONS.refill.price)}</span></div>
        <p>${ADDONS.refill.desc}</p>
      </div>
    </div>
    <div class="addon-card ${addonsState.gift ? 'selected' : ''}" data-id="gift">
      <div class="addon-check">✓</div>
      <div class="addon-body">
        <div class="addon-top"><strong>Regalá a alguien</strong><span class="addon-price"><span class="was">${money(base)}</span>${money(giftPrice)}</span></div>
        <p>Llevá un segundo journal (mismo tamaño y pauta) con ${Math.round(GIFT_DISCOUNT * 100)}% de descuento.</p>
      </div>
    </div>`;
  container.querySelectorAll(".addon-card").forEach(el => {
    el.addEventListener("click", () => { onToggle(el.dataset.id); });
  });
}
