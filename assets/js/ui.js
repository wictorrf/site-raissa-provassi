/* ============================================================
   PRIORI — helpers de render de opciones (tamaño, swatches,
   pauta, chips), compartidos entre personalizar.js y coleccion.js.
   Lógica portada sin cambios del index.html original.
   ============================================================ */

function toggleInArray(arr, id) {
  const i = arr.indexOf(id);
  if (i === -1) arr.push(id); else arr.splice(i, 1);
}

function renderSizeGrid(container, currentSize, onPick) {
  container.innerHTML = SIZES.map(s => `
    <div class="size-option ${s.id === currentSize ? 'selected' : ''}" data-size="${s.id}">
      <div class="sz-name">${s.name}</div>
      <div class="sz-dim">${s.dim}</div>
      <div class="sz-price">${money(s.price)}</div>
    </div>`).join("");
  container.querySelectorAll(".size-option").forEach(el => {
    el.addEventListener("click", () => { onPick(el.dataset.size); });
  });
}

function renderSwatchRow(container, list, currentId, onPick) {
  container.innerHTML = list.map(c => `
    <div class="swatch-item ${c.id === currentId ? 'selected' : ''}" data-id="${c.id}">
      <span class="swatch" style="background:${c.hex}"></span>
      <span>${c.name}</span>
    </div>`).join("");
  container.querySelectorAll(".swatch-item").forEach(el => {
    el.addEventListener("click", () => { onPick(el.dataset.id); });
  });
}

function renderPautaRow(container, currentPauta, onPick) {
  container.innerHTML = PAUTAS.map(p => `
    <div class="pauta-option ${p.id === currentPauta ? 'selected' : ''}" data-id="${p.id}">
      <div class="pauta-swatch p-${p.id}"></div>
      <span>${p.name}</span>
    </div>`).join("");
  container.querySelectorAll(".pauta-option").forEach(el => {
    el.addEventListener("click", () => { onPick(el.dataset.id); });
  });
}

function renderChipGrid(container, list, selectedIds, onToggle) {
  container.innerHTML = list.map(item => `
    <div class="chip ${selectedIds.includes(item.id) ? 'selected' : ''}" data-id="${item.id}">
      <span>${item.name}</span><span class="chip-price">${money(item.price)}</span>
    </div>`).join("");
  container.querySelectorAll(".chip").forEach(el => {
    el.addEventListener("click", () => { onToggle(el.dataset.id); });
  });
}

// Dijes: dejamos el espacio circular pensado para la foto real de cada dije;
// por ahora, mientras no tengamos las fotos, mostramos un emoji de referencia.
function renderCharmGrid(container, list, selectedIds, onToggle) {
  container.innerHTML = list.map(item => `
    <div class="chip charm-chip ${selectedIds.includes(item.id) ? 'selected' : ''}" data-id="${item.id}">
      <span class="charm-photo">${CHARM_EMOJI[item.id] || "•"}</span>
      <span class="charm-info"><span class="charm-name">${item.name}</span><span class="chip-price">${money(item.price)}</span></span>
    </div>`).join("");
  container.querySelectorAll(".chip").forEach(el => {
    el.addEventListener("click", () => { onToggle(el.dataset.id); });
  });
}
