/* ============================================================
   PRIORI — nav y footer compartidos (inyectados por JS en cada
   página), scroll/hamburguesa del nav y reveal-on-scroll.
   Requiere que cada página tenga <div id="site-nav"></div> y
   <div id="site-footer"></div>, y <body data-page="...">.
   ============================================================ */

const NAV_LINKS = [
  { page: "index", href: "index.html", label: "Inicio" },
  { page: "personalizar", href: "personalizar.html", label: "Armá el tuyo" },
  { page: "coleccion", href: "coleccion.html", label: "Colección lista" },
  { page: "reposicion", href: "reposicion.html", label: "Reposición" },
];

const WPP_ICON_SVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.13c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.11.11-1.79-.11-.41-.13-.94-.3-1.62-.6-2.84-1.23-4.7-4.1-4.84-4.29-.14-.19-1.16-1.54-1.16-2.94s.73-2.09.99-2.37c.26-.28.56-.35.75-.35h.54c.17 0 .4-.06.63.48.24.56.8 1.94.87 2.08.07.14.12.31.02.5-.1.19-.15.31-.29.48-.14.17-.3.37-.43.5-.14.14-.29.29-.13.57.17.28.75 1.24 1.6 2.01 1.1 1 2.03 1.31 2.31 1.46.28.14.44.12.6-.07.17-.19.72-.84.91-1.13.19-.28.38-.24.63-.14.26.09 1.64.77 1.92.91.28.14.47.21.54.33.07.12.07.68-.17 1.36z"/></svg>`;

const INSTAGRAM_ICON_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"></circle></svg>`;

function renderNav(activePage) {
  const links = NAV_LINKS.map(l =>
    `<a href="${l.href}" class="${l.page === activePage ? "on" : ""}">${l.label}</a>`
  ).join("");
  return `
  <header class="pr-nav" id="prNav">
    <div class="pr-nav-in">
      <a class="pr-logo" href="index.html" aria-label="Priori, ir al inicio">
        <img src="assets/img/logo.png" alt="Priori">
      </a>
      <nav class="pr-links" id="prLinks">${links}</nav>
      <div class="pr-right">
        <a class="pr-wpp-link" href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener" aria-label="Hablanos por WhatsApp">${WPP_ICON_SVG}</a>
        <button type="button" class="pr-burger" id="prBurger" aria-label="Abrir menú" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>`;
}

function renderFooter() {
  return `
  <footer class="pr-foot">
    <div class="pr-foot-in">
      <div class="foot-grid">
        <div class="foot-brand">
          <img class="flogo" src="assets/img/logo.png" alt="Priori">
          <div class="foot-brand-text">
            <p class="foot-brand-name">Priori</p>
            <p class="foot-brand-tag">Hecho a mano, pensado para durar.</p>
          </div>
        </div>
        <div class="foot-cols">
          <div class="foot-col">
            <h5>Explore</h5>
            <a href="sobre.html">Quiénes somos</a>
            <a href="preguntas.html">Preguntas frecuentes</a>
          </div>
          <div class="foot-col">
            <h5>Ayuda</h5>
            <a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener">Contáctanos</a>
            <a href="privacidad.html">Política de privacidad</a>
          </div>
          <div class="foot-col">
            <h5>Síguenos</h5>
            <div class="foot-social">
              <a href="${INSTAGRAM_URL}" target="_blank" rel="noopener" aria-label="Instagram">${INSTAGRAM_ICON_SVG}</a>
              <a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener" aria-label="WhatsApp">${WPP_ICON_SVG}</a>
            </div>
            <a class="foot-email" href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>
          </div>
        </div>
      </div>
      <div class="foot-bottom">
        <span>© 2026 Priori · Hecho a mano en América Latina.</span>
        <span>Por Raíssa Provasi</span>
      </div>
    </div>
  </footer>`;
}

function mountChrome() {
  const navSlot = document.getElementById("site-nav");
  const footSlot = document.getElementById("site-footer");
  const activePage = document.body.dataset.page || "index";
  if (navSlot) navSlot.outerHTML = renderNav(activePage);
  if (footSlot) footSlot.outerHTML = renderFooter();

  const nav = document.getElementById("prNav");
  const burger = document.getElementById("prBurger");
  if (burger) {
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", String(open));
    });
    document.getElementById("prLinks").querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => { nav.classList.remove("menu-open"); burger.setAttribute("aria-expanded", "false"); });
    });
  }
}

function setupReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in-view"); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  mountChrome();
  setupReveal();
});
