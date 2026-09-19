/* ============================================================
   PRIORI — catálogo, precios y helpers compartidos
   Fuente única para personalizar.html, coleccion.html,
   reposicion.html y entrega.html.
   ============================================================ */

const WHATSAPP_NUMBER = "549223548446";
const INSTAGRAM_URL = "https://instagram.com/priori.colletion";
const INSTAGRAM_HANDLE = "@priori.colletion";
const CONTACT_EMAIL = "hola.prioricollection@gmail.com";

const money = n => "$" + Math.round(n).toLocaleString("es-AR");

// Tamaños: mismas medidas físicas, precio distinto según el producto
// (colección lista, personalizado desde cero o reposición por cuaderno).
const SIZE_META = [
  { id: "A5", name: "A5", dim: "22 × 14 cm" },
  { id: "A6", name: "A6", dim: "16,5 × 11 cm" },
];
const SIZE_PRICES = {
  preset: { A5: 27000, A6: 20000 }, // coleccion.html — Modelos ya armados
  custom: { A5: 28000, A6: 22000 }, // personalizar.html — Armá tu Priori
  refill: { A5: 8000, A6: 6000 },   // reposicion.html — por cuaderno
};
function sizesFor(flow) { return SIZE_META.map(s => ({ ...s, price: SIZE_PRICES[flow][s.id] })); }

const PONTILHADO_EXTRA = 3000; // por cuaderno, solo en "Armá tu Priori" si la pauta es punteada

const LEATHER_COLORS = [
  { id: "marron", name: "Marrón", hex: "#6B4530" },
  { id: "negro", name: "Negro", hex: "#201C19" },
  { id: "marsala", name: "Marsala", hex: "#6E2436" },
  { id: "azul-marino", name: "Azul marino", hex: "#1B2740" },
  { id: "rojo", name: "Rojo", hex: "#A3272C" },
  { id: "rosa-claro", name: "Rosa claro", hex: "#E3A8B6" },
];

const ELASTIC_COLORS = [
  { id: "azul-bebe", name: "Azul bebé", hex: "#A9C8E8" },
  { id: "azul-marino", name: "Azul marino", hex: "#1B2740" },
  { id: "marron", name: "Marrón", hex: "#6B4530" },
  { id: "negro", name: "Negro", hex: "#201C19" },
  { id: "blanco", name: "Blanco", hex: "#F5F1E8" },
  { id: "rosa-bebe", name: "Rosa bebé", hex: "#F3C9D4" },
  { id: "rojo", name: "Rojo", hex: "#A3272C" },
];

// Color de tapa de cada cuaderno — 3 paletas distintas según el contexto
// (así lo pidió la clienta: cada pantalla tiene su propia gama de colores).
const COVERS_BUILD = [ // "Los 3 cuadernos" del personalizador (Armá tu Priori)
  { id: "azul", name: "Azul", hex: "#3A5A8C" },
  { id: "verde-agua", name: "Verde agua", hex: "#8FC1B5" },
  { id: "azul-claro", name: "Azul claro", hex: "#A9C8E8" },
  { id: "bege", name: "Bege", hex: "#D8C3A5" },
  { id: "amarelo-manteiga", name: "Amarillo manteca", hex: "#E8D08A" },
  { id: "preto", name: "Negro", hex: "#201C19" },
];
const COVERS_REFILL_A5 = [ // Reposición (A5) y "Refil extra" A5 en ambos "Sumá algo más"
  { id: "azul-claro", name: "Azul claro", hex: "#A9C8E8" },
  { id: "bege", name: "Bege", hex: "#D8C3A5" },
  { id: "azul-marino", name: "Azul marino", hex: "#1B2740" },
  { id: "verde-oliva", name: "Verde oliva", hex: "#7C7A4A" },
  { id: "bege-quemado", name: "Bege quemado", hex: "#B79A6B" },
  { id: "negro", name: "Negro", hex: "#201C19" },
];
const COVERS_REFILL_A6 = [ // Reposición (A6) y "Outro refil extra" A6 en ambos "Sumá algo más"
  { id: "verde-oscuro", name: "Verde oscuro", hex: "#2F4A38" },
  { id: "verde-claro", name: "Verde claro", hex: "#9FC48C" },
  { id: "oliva", name: "Oliva", hex: "#7C7A4A" },
  { id: "morado", name: "Morado", hex: "#5B3A6B" },
  { id: "vino", name: "Vino", hex: "#6E2436" },
  { id: "pink", name: "Pink", hex: "#E85D9E" },
  { id: "rosa-bebe", name: "Rosa bebé", hex: "#F3C9D4" },
  { id: "azul-claro", name: "Azul claro", hex: "#A9C8E8" },
  { id: "azul-marino", name: "Azul marino", hex: "#1B2740" },
  { id: "marron", name: "Marrón", hex: "#6B4530" },
];

const PAUTAS = [
  { id: "punteada", name: "Punteada" },
  { id: "lisa", name: "Lisa" },
  { id: "rayada", name: "Rayada" },
];
const PAUTAS_REFILL = PAUTAS.filter(p => p.id !== "punteada"); // Reposición: solo Rayada/Lisa

// Dijes — el primero que se elige es gratis; desde el segundo se cobra $600 por
// unidad, con la excepción del Cisne que siempre cobra $1.500 (ver calcCharmsTotal).
const CHARMS = [
  { id: "margarita", name: "Margarita", price: 600 },
  { id: "abejita", name: "Abejita", price: 600 },
  { id: "fresa", name: "Fresa", price: 600 },
  { id: "cisne", name: "Cisne", price: 1500 },
  { id: "cereza", name: "Cereza", price: 500 },
  { id: "palta", name: "Palta", price: 600 },
  { id: "flores", name: "Flores", price: 600 },
  { id: "luna", name: "Luna", price: 600 },
  { id: "joaninha", name: "Joaninha", price: 600 },
  { id: "cachorro-salsicha", name: "Cachorro salchicha", price: 600 },
  { id: "nuvem", name: "Nube", price: 600 },
  { id: "profissoes", name: "Profesiones", price: 600 },
];
const CHARM_EMOJI = {
  margarita: "🌼", abejita: "🐝", fresa: "🍓", cisne: "🦢", cereza: "🍒",
  palta: "🥑", flores: "🌸", luna: "🌙", joaninha: "🐞",
  "cachorro-salsicha": "🐕", nuvem: "☁️", profissoes: "💼",
};
// pickedIds = ids elegidos en el orden en que se sumaron (con repetición = cantidad).
function calcCharmsTotal(pickedIds) {
  return pickedIds.reduce((total, id, i) => i === 0 ? total : total + byId(CHARMS, id).price, 0);
}

const ACCESSORIES = [
  { id: "broche", name: "Broche personalizado", price: 3000 },
  { id: "marcador", name: "Marcador de página metálico", price: 2000 },
  { id: "polaroid", name: "Foto Polaroid en la tapa", price: 6000 },
  { id: "portalapices-metal", name: "Portalápices metálico", price: 4000 },
  { id: "portalapices-cuero", name: "Portalápices en cuero", price: 3000 },
  { id: "presilla", name: "Presilla metálica", price: 3000 },
  { id: "lazos", name: "Lazos o rendas", price: 2000 },
];

// Los 4 modelos de la colección lista. El precio NO se guarda acá:
// se deriva de SIZE_PRICES.preset según el tamaño elegido en coleccion.html.
const PRESETS = [
  { id: "origem", name: "Origem", copy: "Inspirado en lo esencial: cálido y atemporal, perfecto para tu primer Priori.", desc: "Cuero marrón · elástico rosa bebé · dije de cisne · 3 cuadernos Priori · pauta lisa", leather: "marron", elastic: "rosa-bebe", photos: ["assets/img/origem-3.jpg", "assets/img/origem-1.jpg", "assets/img/origem-2.jpg"] },
  { id: "serena", name: "Serena", copy: "Delicado y femenino, pensado para acompañar tu corazón y tu creatividad.", desc: "Cuero rosa claro · elástico rosa bebé · dije de cisne · 3 cuadernos Priori · pauta lisa", leather: "rosa-claro", elastic: "rosa-bebe", photos: ["assets/img/serena-1.jpg", "assets/img/serena-2.jpg", "assets/img/serena-3.jpg"] },
  { id: "luna", name: "Luna", copy: "Elegante y sereno, para dejar espacio a nuevas ideas.", desc: "Cuero azul marino · elástico azul claro · dije de cisne · 3 cuadernos Priori · pauta lisa", leather: "azul-marino", elastic: "azul-bebe", photos: ["assets/img/luna-1.jpg", "assets/img/luna-2.jpg", "assets/img/luna-3.jpg"] },
  { id: "aura", name: "Aura", copy: "Intenso y sofisticado, con un toque de personalidad.", desc: "Cuero marsala · elástico rosa bebé · dije de cisne · 3 cuadernos Priori · pauta lisa", leather: "marsala", elastic: "rosa-bebe", photos: ["assets/img/aura-1.jpg", "assets/img/aura-2.jpg", "assets/img/aura-3.jpg"] },
];

// Refil extra: 3 productos con cantidad seleccionable, precio distinto según el
// flujo (colección lista vs. personalizado desde cero) — así lo pidió la clienta.
const REFILL_EXTRAS = {
  preset: [
    { id: "rajado-a5", name: "Soft Living Collection", unitPrice: 7000, size: "A5", colors: COVERS_REFILL_A5, pauta: "rayada", photos: ["assets/img/soft-living-1.jpg", "assets/img/soft-living-2.jpg", "assets/img/soft-living-3.jpg", "assets/img/soft-living-4.jpg", null, null] },
    { id: "liso-a5-dorado", name: "Refil extra · hoja lisa, negro con detalle dorado (A5)", unitPrice: 7000, size: "A5", fixedColorLabel: "Negro con detalle en dorado exclusivo de la marca.", pauta: "lisa", photos: 1 },
    { id: "a6", name: "Refil extra (A6) · lisa o rayada", unitPrice: 6000, size: "A6", colors: COVERS_REFILL_A6, pautaOptions: PAUTAS_REFILL, photos: 4 },
  ],
  custom: [
    { id: "rajado-a5", name: "Soft Living Collection", unitPrice: 7000, size: "A5", colors: COVERS_REFILL_A5, pauta: "rayada", photos: ["assets/img/soft-living-1.jpg", "assets/img/soft-living-2.jpg", "assets/img/soft-living-3.jpg", "assets/img/soft-living-4.jpg", null, null] },
    { id: "liso-a5-dorado", name: "Refil extra · hoja lisa, negro con detalle dorado (A5)", unitPrice: 7000, size: "A5", fixedColorLabel: "Negro con detalle en dorado exclusivo de la marca.", pauta: "lisa", photos: 1 },
    { id: "a6", name: "Refil extra (A6) · lisa o rayada", unitPrice: 6000, size: "A6", colors: COVERS_REFILL_A6, pautaOptions: PAUTAS_REFILL, photos: 4 },
  ],
};

function byId(list, id) { return list.find(x => x.id === id); }
