/* ============================================================
   PRIORI — helpers de render de opciones (tamaño, swatches,
   pauta, chips, cantidad, cuadernos individuales, fotos),
   compartidos entre personalizar.js, coleccion.js y reposicion.js.
   ============================================================ */

function toggleInArray(arr, id) {
  const i = arr.indexOf(id);
  if (i === -1) arr.push(id); else arr.splice(i, 1);
}

function renderSizeGrid(container, list, currentSize, onPick) {
  container.innerHTML = list.map(s => `
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

function renderPautaRow(container, currentPauta, onPick, list) {
  const options = list || PAUTAS;
  container.innerHTML = options.map(p => `
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
    <div class="chip charm-chip ${selectedIds.includes(item.id) ? 'selected' : ''}" data-id="${item.id}">
      <span class="charm-photo" data-photo-hint="foto: ${item.name}"></span>
      <span class="charm-info"><span class="charm-name">${item.name}</span><span class="chip-price">${money(item.price)}</span></span>
    </div>`).join("");
  container.querySelectorAll(".chip").forEach(el => {
    el.addEventListener("click", () => { onToggle(el.dataset.id); });
  });
}

// Dijes: dejamos el espacio circular pensado para la foto real de cada dije;
// por ahora, mientras no tengamos las fotos, mostramos un emoji de referencia.
// pickedIds trae repetidos (uno por unidad elegida) para soportar cantidad.
function renderCharmGrid(container, list, pickedIds, onQtyChange) {
  container.innerHTML = list.map(item => {
    const qty = pickedIds.filter(id => id === item.id).length;
    return `
    <div class="chip charm-chip ${qty > 0 ? 'selected' : ''}" data-id="${item.id}">
      <span class="charm-photo">${CHARM_EMOJI[item.id] || "•"}</span>
      <span class="charm-info"><span class="charm-name">${item.name}</span></span>
      <div class="qty-stepper mini" data-charmqty="${item.id}"></div>
    </div>`;
  }).join("");
  list.forEach(item => {
    const qty = pickedIds.filter(id => id === item.id).length;
    renderQuantityStepper(container.querySelector(`[data-charmqty="${item.id}"]`), qty, (n) => onQtyChange(item.id, n));
  });
}

// Seletor de cantidad genérico (− N +), usado en dijes y en los refis extra.
function renderQuantityStepper(container, qty, onChange, opts) {
  const min = (opts && opts.min) || 0;
  const max = (opts && opts.max) || 20;
  container.innerHTML = `
    <button type="button" class="qty-btn" data-dir="-1" ${qty <= min ? "disabled" : ""} aria-label="Restar">−</button>
    <span class="qty-val">${qty}</span>
    <button type="button" class="qty-btn" data-dir="1" ${qty >= max ? "disabled" : ""} aria-label="Sumar">+</button>`;
  container.querySelectorAll(".qty-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const next = qty + Number(btn.dataset.dir);
      if (next >= min && next <= max) onChange(next);
    });
  });
}

// N placeholders de foto en fila (mientras no llegan las fotos reales del producto).
function renderPhotoSlots(container, count, hintPrefix) {
  container.innerHTML = Array.from({ length: count }, (_, i) => `
    <div class="photo-slot mini-photo-slot" data-photo-hint="${hintPrefix} — foto ${i + 1}/${count}"><span>Foto ${i + 1}</span></div>`).join("");
}

// Bloque "Cuaderno N" (tamaño opcional + color de tapa + pauta), reutilizado por
// personalizar.js ("Los 3 cuadernos") y reposicion.js (cada cuaderno de repuesto).
function renderNotebookBlock(container, index, notebook, opts) {
  const { covers, pautaOptions, showSize, sizePrices, onCoverChange, onPautaChange, onSizeChange } = opts;
  container.innerHTML = `
    <h4>Cuaderno ${index + 1}</h4>
    ${showSize ? `<div class="nb-row"><span class="nb-label">Tamaño</span><div class="nb-size-row" data-nbsize="${index}"></div></div>` : ""}
    <div class="nb-row"><span class="nb-label">Color</span><div class="swatch-row" data-nbcover="${index}"></div></div>
    <div class="nb-row"><span class="nb-label">Pauta</span><div class="pauta-row" data-nbpauta="${index}"></div></div>`;

  if (showSize) {
    const sizeRow = container.querySelector(`[data-nbsize="${index}"]`);
    sizeRow.innerHTML = ["A5", "A6"].map(id => `
      <div class="nb-size-option ${id === notebook.size ? 'selected' : ''}" data-id="${id}">
        <span>${id}</span><span class="nb-size-price">${money(sizePrices[id])}</span>
      </div>`).join("");
    sizeRow.querySelectorAll(".nb-size-option").forEach(el => {
      el.addEventListener("click", () => onSizeChange(el.dataset.id));
    });
  }
  renderSwatchRow(container.querySelector(`[data-nbcover="${index}"]`), covers, notebook.cover, onCoverChange);
  renderPautaRow(container.querySelector(`[data-nbpauta="${index}"]`), notebook.pauta, onPautaChange, pautaOptions);
}
