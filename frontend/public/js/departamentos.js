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

// ============================================================================
// FOTO DE CADA DEPARTAMENTO (paisaje o lugar emblemático)
// Archivos en img/departamentos/. Son fotos de Wikimedia Commons con licencia
// libre: su autor y licencia DEBEN mostrarse (se hace en nosotros.html).
// Para agregar un departamento: guarden la foto como img/departamentos/<nombre>.jpg
// (sin tildes, con guiones) y agreguen su línea aquí. Si un departamento no
// tiene foto, se usa la foto de uno de sus productos.
// ============================================================================
const FOTOS_DEPARTAMENTO = {
  "Alta Verapaz":  { lugar: "Semuc Champey", autor: "Christopher Crouzet", licencia: "CC BY-SA 3.0", fuente: "https://commons.wikimedia.org/wiki/File:Semuc_Champey,_Guatemala.jpg" },
  "Chimaltenango": { lugar: "Iximché", autor: "Simon Burchell", licencia: "CC BY-SA 4.0", fuente: "https://commons.wikimedia.org/wiki/File:Iximche_03.jpg" },
  "Escuintla":     { lugar: "Volcán de Pacaya", autor: "Christopher Crouzet", licencia: "CC BY-SA 4.0", fuente: "https://commons.wikimedia.org/wiki/File:View_from_Volcano_Pacaya,_Guatemala.jpg" },
  "Guatemala":     { lugar: "Palacio Nacional de la Cultura", autor: "K21edgo", licencia: "CC BY-SA 3.0", fuente: "https://commons.wikimedia.org/wiki/File:Palacio_Nacional_de_la_Cultura.jpg" },
  "Huehuetenango": { lugar: "Sierra de los Cuchumatanes", autor: "Maricela Argueta", licencia: "CC BY-SA 4.0", fuente: "https://commons.wikimedia.org/wiki/File:Sierra_de_los_Cuchumatanes.jpg" },
  "Quiché":        { lugar: "Iglesia de Santo Tomás, Chichicastenango", autor: "chensiyuan", licencia: "CC BY-SA 4.0", fuente: "https://commons.wikimedia.org/wiki/File:Iglesia_de_Santo_Tom%C3%A1s_2009.JPG" },
  "Sacatepéquez":  { lugar: "Arco de Santa Catalina, Antigua", autor: "Erik Cleves Kristensen", licencia: "CC BY 2.0", fuente: "https://commons.wikimedia.org/wiki/File:The_morning_after_-_Santa_Catalina_Arch,_Antigua_Guatemala,_New_Year_2024.jpg" },
  "San Marcos":    { lugar: "Volcán Tajumulco", autor: "JoePhoto", licencia: "CC BY 2.0", fuente: "https://commons.wikimedia.org/wiki/File:Tajumulco_volcano_01.jpg" },
  "Sololá":        { lugar: "Lago de Atitlán", autor: "chensiyuan", licencia: "CC BY-SA 4.0", fuente: "https://commons.wikimedia.org/wiki/File:Lago_de_Atitl%C3%A1n_2009.JPG" },
  "Totonicapán":   { lugar: "Parque central de Totonicapán", autor: "Rodrigobaaz", licencia: "CC BY-SA 4.0", fuente: "https://commons.wikimedia.org/wiki/File:Parque_Central_Totonicap%C3%A1n.jpg" },
};

// Devuelve { src, lugar, autor, licencia, fuente } o null si no hay foto
function fotoDepartamento(nombre) {
  const clave = normalizarDepartamento(nombre);
  const encontrado = Object.entries(FOTOS_DEPARTAMENTO).find(([d]) => normalizarDepartamento(d) === clave);
  if (!encontrado) return null;
  return { src: `./img/departamentos/${clave.replace(/\s+/g, "-")}.jpg`, ...encontrado[1] };
}

// Tarjetas con foto para "Compra por región" (inicio) y "De dónde vienen" (nosotros).
// `destacar` = true hace más grandes las dos primeras tarjetas (las de más piezas).
function tarjetasDepartamentos(productos, { limite = Infinity, destacar = false } = {}) {
  const escapar = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const grupos = new Map();
  productos.forEach((p) => {
    if (!p.departamento) return;
    const g = grupos.get(p.departamento) || { piezas: 0, imagenProducto: p.imagen };
    g.piezas++;
    grupos.set(p.departamento, g);
  });
  return [...grupos.entries()]
    .sort((a, b) => b[1].piezas - a[1].piezas)
    .slice(0, limite)
    .map(([nombre, g], i) => {
      const foto = fotoDepartamento(nombre);
      const { color } = colorDepartamento(nombre);
      const grande = destacar && i < 2;
      return `
        <a href="./productos.html?departamento=${encodeURIComponent(nombre)}"
           class="group relative overflow-hidden rounded-2xl shadow-[0_10px_30px_rgba(60,35,20,0.12)] ${grande ? "col-span-2 row-span-2" : ""}">
          <img src="${escapar(foto ? foto.src : g.imagenProducto)}" alt="${escapar(foto ? foto.lugar : nombre)}" loading="lazy"
               class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div class="absolute inset-0" style="background: linear-gradient(to top, ${color}F2 0%, ${color}99 35%, transparent 75%)"></div>
          <div class="absolute inset-x-0 bottom-0 p-4 md:p-5 text-white">
            <p class="font-extrabold leading-tight ${grande ? "text-3xl md:text-4xl" : "text-lg sm:text-xl md:text-2xl"} break-words">${escapar(nombre)}</p>
            <p class="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-white/90">
              ${g.piezas} pieza${g.piezas === 1 ? "" : "s"}
              <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </p>
          </div>
        </a>`;
    })
    .join("");
}

// Créditos de las fotos de departamentos (lo pide la licencia)
function creditosFotosDepartamentos() {
  return Object.entries(FOTOS_DEPARTAMENTO)
    .map(([d, f]) => `<a href="${f.fuente}" target="_blank" rel="noopener" class="hover:text-primary underline-offset-2 hover:underline">${f.lugar} (${d}): ${f.autor}, ${f.licencia}</a>`)
    .join(" · ");
}

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
