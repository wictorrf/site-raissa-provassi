/* ============================================================
   PRIORI — catálogo, precios y helpers compartidos
   Fuente única para personalizar.html, coleccion.html,
   reposicion.html y entrega.html.
   ============================================================ */

const WHATSAPP_NUMBER = "5492236358794";

const money = n => "$" + Math.round(n).toLocaleString("es-AR");

const SIZES = [
  { id: "A5", name: "A5", dim: "22 × 14 cm", price: 52000 },
  { id: "A6", name: "A6", dim: "16,5 × 11 cm", price: 38000 },
];

const PRINTED_PAUTA_PRICE = 2000; // por cuaderno, si no es "lisa"

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

const NOTEBOOK_COVERS = [
  { id: "azul", name: "Azul", hex: "#3A5A8C" },
  { id: "rosa", name: "Rosa liso", hex: "#E7B7C0" },
  { id: "negro", name: "Negro liso", hex: "#232019" },
];

const PAUTAS = [
  { id: "punteada", name: "Punteada" },
  { id: "lisa", name: "Lisa" },
  { id: "rayada", name: "Rayada" },
];

const CHARMS = [
  { id: "margarita", name: "Margarita", price: 3000 },
  { id: "abejita", name: "Abejita", price: 3500 },
  { id: "fresa", name: "Fresa", price: 3000 },
  { id: "cisne", name: "Cisne", price: 4500 },
  { id: "cereza", name: "Cereza", price: 3000 },
  { id: "palta", name: "Palta", price: 3500 },
  { id: "flores", name: "Flores", price: 3000 },
  { id: "luna", name: "Luna", price: 4000 },
  { id: "animalitos", name: "Animalitos", price: 3500 },
];
const CHARM_EMOJI = {
  margarita: "🌼", abejita: "🐝", fresa: "🍓", cisne: "🦢", cereza: "🍒",
  palta: "🥑", flores: "🌸", luna: "🌙", animalitos: "🐾",
};

const ACCESSORIES = [
  { id: "broche", name: "Broche metálico", price: 3500 },
  { id: "marcador", name: "Marcador de página metálico", price: 2500 },
  { id: "polaroid", name: "Foto Polaroid en la tapa", price: 4000 },
  { id: "portalapices", name: "Portalápices de cuero", price: 6000 },
  { id: "encaje", name: "Detalle de encaje", price: 3000 },
  { id: "lazos", name: "Lazos", price: 2000 },
];

// Los 4 modelos de la colección lista. El precio NO se guarda acá:
// se deriva de SIZES según el tamaño elegido en coleccion.html
// (antes estaba hardcodeado en $52.000 = precio del A5, sin opción de A6).
const PRESETS = [
  { id: "clasico", name: "Clásico", copy: "Atemporal y versátil: el punto de partida perfecto para tu primer Priori.", desc: "Cuero marrón · elástico marrón", leather: "marron", elastic: "marron" },
  { id: "romance", name: "Romance", copy: "Delicado y femenino, para quien escribe con el corazón.", desc: "Cuero rosa claro · elástico rosa bebé", leather: "rosa-claro", elastic: "rosa-bebe" },
  { id: "marino", name: "Marino", copy: "Elegante y sereno, inspirado en la calma de las ideas claras.", desc: "Cuero azul marino · elástico azul marino", leather: "azul-marino", elastic: "azul-marino" },
  { id: "vino", name: "Vino", copy: "Profundo y romántico, con un contraste que enamora.", desc: "Cuero marsala · elástico rosa bebé", leather: "marsala", elastic: "rosa-bebe" },
];

const ADDONS = {
  refill: { name: "Refill extra · 3 cuadernos", desc: "Un juego extra de 3 cuadernos para cuando termines el que tenés. La tapa es para toda la vida.", original: 18000, price: 13500 },
};
const GIFT_DISCOUNT = 0.35; // 35% off en el segundo journal (mismo tamaño y pauta)

// Reposición: comprar solo un juego de 3 cuadernos (sin tapa), en color sólido.
// Mismo precio del refill que ya existía dentro del personalizador — fuente única.
const REFILL_SETS = {
  simple: { name: "Juego de 3 cuadernos · color sólido", original: ADDONS.refill.original, price: ADDONS.refill.price },
};

function byId(list, id) { return list.find(x => x.id === id); }
