/* ============================================================
   PRIORI — paso de pedido entre páginas (sin backend) y
   armado del mensaje final de WhatsApp.
   ============================================================ */

const FLOW_PAGE = { custom: "personalizar.html", collection: "coleccion.html", refill: "reposicion.html" };

function saveLiveState(flow, stateObj) {
  try { sessionStorage.setItem(`priori_state_${flow}`, JSON.stringify(stateObj)); } catch (e) { /* sessionStorage puede fallar en modo privado */ }
}
function loadLiveState(flow) {
  try {
    const raw = sessionStorage.getItem(`priori_state_${flow}`);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

// order = { flow: "custom"|"collection"|"refill", lines: [{label, value}], total: number }
function savePendingOrder(order) {
  try { sessionStorage.setItem("priori_pending_order", JSON.stringify(order)); } catch (e) { /* no-op */ }
}
function loadPendingOrder() {
  try {
    const raw = sessionStorage.getItem("priori_pending_order");
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}
function clearPendingOrder() {
  try { sessionStorage.removeItem("priori_pending_order"); } catch (e) { /* no-op */ }
}

function buildWhatsAppMessage(order, formData) {
  const msg = [];
  msg.push("¡Hola! Quiero hacer un pedido en Priori 🤎");
  msg.push("");
  msg.push("*Pedido:*");
  order.lines.forEach(l => msg.push(`• ${l.label}: ${l.value}`));
  msg.push("");
  msg.push(`*Total: ${money(order.total)}*`);
  msg.push("");
  msg.push("*Datos de entrega:*");
  msg.push(`Nombre: ${formData.name}`);
  msg.push(`WhatsApp: ${formData.phone}`);
  msg.push(`Dirección: ${formData.street} ${formData.number}${formData.apt ? ", " + formData.apt : ""}, ${formData.neighborhood}`);
  msg.push(`Ciudad: ${formData.city} (${formData.province}), CP ${formData.cp}`);
  if (formData.notes) msg.push(`Notas: ${formData.notes}`);
  return msg.join("\n");
}

function buildWhatsAppUrl(order, formData) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage(order, formData))}`;
}
