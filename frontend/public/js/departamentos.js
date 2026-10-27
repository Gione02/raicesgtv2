// ============================================================================
// COLOR DE CADA DEPARTAMENTO
// Se usa en el detalle de cada producto (modal del catálogo y página /producto).
//
// No existen colores oficiales por departamento: sus banderas son casi todas
// blancas con escudo. Por eso cada color está INSPIRADO en lo más reconocible
// del departamento (su traje, su paisaje o su artesanía). El equipo puede
// ajustarlos aquí; todos tienen contraste de al menos 4.5:1 con texto blanco.
// ============================================================================
const COLORES_DEPARTAMENTO = {
  "Alta Verapaz":   { color: "#2E6B3A", inspiracion: "Verde de los bosques nubosos y los cardamomales" },
  "Baja Verapaz":   { color: "#1E7A5A", inspiracion: "Verde quetzal: el quetzal está en su bandera" },
  "Chimaltenango":  { color: "#B3261E", inspiracion: "Rojo de los huipiles con anchas franjas rojas (Patzún, Comalapa)" },
  "Chiquimula":     { color: "#A0522D", inspiracion: "Tierra siena del oriente cálido" },
  "El Progreso":    { color: "#956C10", inspiracion: "Amarillo de su bandera departamental" },
  "Escuintla":      { color: "#B65218", inspiracion: "Naranja del sol y la caña de la costa sur" },
  "Guatemala":      { color: "#2C5E8A", inspiracion: "Azul del escudo de su bandera" },
  "Huehuetenango":  { color: "#8E2A2A", inspiracion: "Rojo del rayado rojo y blanco de Todos Santos Cuchumatán" },
  "Izabal":         { color: "#0F7C7A", inspiracion: "Turquesa del Caribe guatemalteco" },
  "Jalapa":         { color: "#3D7A34", inspiracion: "Verde de los bosques de su bandera" },
  "Jutiapa":        { color: "#9A5B13", inspiracion: "Ocre de las tierras del oriente" },
  "Petén":          { color: "#2D5F3A", inspiracion: "Verde de la selva maya" },
  "Quetzaltenango": { color: "#4E4A6B", inspiracion: "Piedra volcánica: el volcán que aparece en su bandera" },
  "Quiché":         { color: "#A3204A", inspiracion: "Rojo intenso de los huipiles de Nebaj y Chichicastenango" },
  "Retalhuleu":     { color: "#C2410C", inspiracion: "Naranja tropical de la boca costa" },
  "Sacatepéquez":   { color: "#2F7D5B", inspiracion: "Jade, la piedra emblemática de La Antigua" },
  "San Marcos":     { color: "#906808", inspiracion: "Dorado de los trajes amarillos de San Pedro" },
  "Santa Rosa":     { color: "#6B4F2A", inspiracion: "Café de sus fincas cafetaleras" },
  "Sololá":         { color: "#1F6E8C", inspiracion: "Azul del lago de Atitlán y de sus cortes azules" },
  "Suchitepéquez":  { color: "#7A4A2A", inspiracion: "Cacao, cultivo histórico de la región" },
  "Totonicapán":    { color: "#9C2F45", inspiracion: "Granate de sus tejidos tradicionales" },
  "Zacapa":         { color: "#AA5F1B", inspiracion: "Ocre del clima seco del oriente" },
};

// Color por defecto (terracota de la marca) si el departamento no está en la lista
const COLOR_DEPARTAMENTO_POR_DEFECTO = { color: "#B4452D", inspiracion: "" };

function normalizarDepartamento(texto) {
  return String(texto ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

// Mezcla un color con blanco: 0 = el color, 1 = blanco. Para fondos suaves.
function aclararColor(hex, cantidad) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return "#" + c.map((v) => Math.round(v + (255 - v) * cantidad).toString(16).padStart(2, "0")).join("");
}

// Devuelve { color, suave, borde, inspiracion } para un departamento
function colorDepartamento(nombre) {
  const clave = normalizarDepartamento(nombre);
  const encontrado = Object.entries(COLORES_DEPARTAMENTO).find(([d]) => normalizarDepartamento(d) === clave);
  const base = encontrado ? encontrado[1] : COLOR_DEPARTAMENTO_POR_DEFECTO;
  return {
    color: base.color,
    suave: aclararColor(base.color, 0.9),
    borde: aclararColor(base.color, 0.7),
    inspiracion: base.inspiracion,
  };
}
