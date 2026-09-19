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

// Detalles extra: cada opción es una tarjeta con la foto cuadrada arriba
// (mientras no tengamos las fotos reales, un placeholder) y el nombre/precio
// abajo, para que se vea grande y clara.
function renderChipGrid(container, list, selectedIds, onToggle) {
  container.innerHTML = list.map(item => `
    <div class="tile-card ${selectedIds.includes(item.id) ? 'selected' : ''}" data-id="${item.id}">
      <div class="tile-photo photo-slot" data-photo-hint="foto: ${item.name}"><span>Foto</span></div>
      <div class="tile-name">${item.name}</div>
      <div class="tile-price">${money(item.price)}</div>
    </div>`).join("");
  container.querySelectorAll(".tile-card").forEach(el => {
    el.addEventListener("click", () => { onToggle(el.dataset.id); });
  });
}

// Dijes: dejamos el espacio circular pensado para la foto real de cada dije;
// por ahora, mientras no tengamos las fotos, mostramos un emoji de referencia.
// pickedIds trae repetidos (uno por unidad elegida) para soportar cantidad.
// Sin seleccionar muestra el precio; al elegirlo aparece el selector de
// cantidad (así no se ve la cantidad hasta que la clienta realmente la toca).
function renderCharmGrid(container, list, pickedIds, onQtyChange) {
  container.innerHTML = list.map(item => {
    const qty = pickedIds.filter(id => id === item.id).length;
    return `
    <div class="chip charm-chip ${qty > 0 ? 'selected' : ''}" data-id="${item.id}">
      <span class="charm-photo">${CHARM_EMOJI[item.id] || "•"}</span>
      <span class="charm-info">
        <span class="charm-name">${item.name}</span>
        ${qty > 0 ? "" : `<span class="chip-price">${money(item.price)}</span>`}
      </span>
      ${qty > 0 ? `<div class="qty-stepper mini" data-charmqty="${item.id}"></div>` : ""}
    </div>`;
  }).join("");
  list.forEach(item => {
    const qty = pickedIds.filter(id => id === item.id).length;
    const chipEl = container.querySelector(`.charm-chip[data-id="${item.id}"]`);
    if (qty === 0) {
      chipEl.addEventListener("click", () => onQtyChange(item.id, 1));
    } else {
      renderQuantityStepper(container.querySelector(`[data-charmqty="${item.id}"]`), qty, (n) => onQtyChange(item.id, n));
    }
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

// Carrusel de fotos de referencia: un placeholder grande navegable (‹ ›) con
// N espacios reservados, mientras no llegan las fotos reales del producto.
// `photos` acepta un número (todo placeholder) o un array de rutas de imagen
// (una entrada puede ser null/undefined si esa foto puntual todavía no llegó).
function renderPhotoCarousel(container, photos, index, hintPrefix, onChange) {
  const images = Array.isArray(photos) ? photos : Array.from({ length: photos }, () => null);
  const count = images.length;
  const i = Math.min(Math.max(index || 0, 0), count - 1);
  const src = images[i];
  const slideMarkup = src
    ? `<img class="photo-carousel-slide" src="${src}" alt="${hintPrefix} — foto ${i + 1}/${count}">`
    : `<div class="photo-carousel-slide photo-slot" data-photo-hint="${hintPrefix} — foto ${i + 1}/${count}"><span>Foto ${i + 1}/${count}</span></div>`;
  container.innerHTML = `
    ${slideMarkup}
    <div class="photo-carousel-nav">
      <button type="button" class="pc-arrow" data-dir="-1" ${count <= 1 ? "disabled" : ""} aria-label="Foto anterior">‹</button>
      <div class="pc-dots">${Array.from({ length: count }, (_, d) => `<span class="pc-dot ${d === i ? "active" : ""}"></span>`).join("")}</div>
      <button type="button" class="pc-arrow" data-dir="1" ${count <= 1 ? "disabled" : ""} aria-label="Foto siguiente">›</button>
    </div>`;
  container.querySelectorAll(".pc-arrow").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const next = (i + Number(btn.dataset.dir) + count) % count;
      onChange(next);
    });
  });
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
