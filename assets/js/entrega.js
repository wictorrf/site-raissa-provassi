/* ============================================================
   PRIORI — controller de entrega.html: lee el pedido pendiente
   del sessionStorage, arma el resumen y el link final de WhatsApp.
   ============================================================ */

(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const order = loadPendingOrder();

    if (!order) {
      document.getElementById("emptyState").style.display = "block";
      return;
    }
    document.getElementById("deliveryPage").style.display = "block";

    document.getElementById("deliverySummary").innerHTML = order.lines
      .map(l => `<div class="sum-row"><span class="k">${l.label}</span><span class="v">${l.value}</span></div>`)
      .join("");
    document.getElementById("deliveryTotal").textContent = money(order.total);

    document.getElementById("deliveryBack").addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = FLOW_PAGE[order.flow] || "index.html";
    });

    document.getElementById("deliveryForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.target;
      if (!form.checkValidity()) { form.reportValidity(); return; }

      const formData = {
        name: document.getElementById("fName").value.trim(),
        phone: document.getElementById("fPhone").value.trim(),
        cp: document.getElementById("fCP").value.trim(),
        street: document.getElementById("fStreet").value.trim(),
        number: document.getElementById("fNumber").value.trim(),
        apt: document.getElementById("fApt").value.trim(),
        neighborhood: document.getElementById("fNeighborhood").value.trim(),
        city: document.getElementById("fCity").value.trim(),
        province: document.getElementById("fProvince").value.trim(),
        notes: document.getElementById("fNotes").value.trim(),
      };

      const url = buildWhatsAppUrl(order, formData);
      clearPendingOrder();
      window.open(url, "_blank");
    });
  });
})();
