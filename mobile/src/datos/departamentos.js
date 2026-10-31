// ============================================================================
// COLOR Y FOTO DE CADA DEPARTAMENTO
// Copia de frontend/public/js/departamentos.js: si el equipo cambia un color o
// una foto en la web, conviene cambiarlo también aquí.
//
// Los colores están INSPIRADOS en el traje o el paisaje de cada departamento
// (no hay colores oficiales). Las fotos son de Wikimedia Commons con licencia
// libre: su autor y licencia deben mostrarse (se hace en Sobre nosotros).
// Para agregar una foto: guárdenla en assets/departamentos/ y agreguen su línea.
// ============================================================================
import { normalizar } from "../utils/texto";

const COLORES = {
  "Alta Verapaz": "#2E6B3A",
  "Baja Verapaz": "#1E7A5A",
  Chimaltenango: "#B3261E",
  Chiquimula: "#A0522D",
  "El Progreso": "#956C10",
  Escuintla: "#B65218",
  Guatemala: "#2C5E8A",
  Huehuetenango: "#8E2A2A",
  Izabal: "#0F7C7A",
  Jalapa: "#3D7A34",
  Jutiapa: "#9A5B13",
  Petén: "#2D5F3A",
  Quetzaltenango: "#4E4A6B",
  Quiché: "#A3204A",
  Retalhuleu: "#C2410C",
  Sacatepéquez: "#2F7D5B",
  "San Marcos": "#906808",
  "Santa Rosa": "#6B4F2A",
  Sololá: "#1F6E8C",
  Suchitepéquez: "#7A4A2A",
  Totonicapán: "#9C2F45",
  Zacapa: "#AA5F1B",
};

// Terracota de la marca si el departamento no está en la lista
const COLOR_POR_DEFECTO = "#B4452D";

const FOTOS = {
  "Alta Verapaz": { foto: require("../../assets/departamentos/alta-verapaz.jpg"), lugar: "Semuc Champey", autor: "Christopher Crouzet", licencia: "CC BY-SA 3.0" },
  Chimaltenango: { foto: require("../../assets/departamentos/chimaltenango.jpg"), lugar: "Iximché", autor: "Simon Burchell", licencia: "CC BY-SA 4.0" },
  Escuintla: { foto: require("../../assets/departamentos/escuintla.jpg"), lugar: "Volcán de Pacaya", autor: "Christopher Crouzet", licencia: "CC BY-SA 4.0" },
  Guatemala: { foto: require("../../assets/departamentos/guatemala.jpg"), lugar: "Palacio Nacional de la Cultura", autor: "K21edgo", licencia: "CC BY-SA 3.0" },
  Huehuetenango: { foto: require("../../assets/departamentos/huehuetenango.jpg"), lugar: "Sierra de los Cuchumatanes", autor: "Maricela Argueta", licencia: "CC BY-SA 4.0" },
  Quiché: { foto: require("../../assets/departamentos/quiche.jpg"), lugar: "Iglesia de Santo Tomás, Chichicastenango", autor: "chensiyuan", licencia: "CC BY-SA 4.0" },
  Sacatepéquez: { foto: require("../../assets/departamentos/sacatepequez.jpg"), lugar: "Arco de Santa Catalina, Antigua", autor: "Erik Cleves Kristensen", licencia: "CC BY 2.0" },
  "San Marcos": { foto: require("../../assets/departamentos/san-marcos.jpg"), lugar: "Volcán Tajumulco", autor: "JoePhoto", licencia: "CC BY 2.0" },
  Sololá: { foto: require("../../assets/departamentos/solola.jpg"), lugar: "Lago de Atitlán", autor: "chensiyuan", licencia: "CC BY-SA 4.0" },
  Totonicapán: { foto: require("../../assets/departamentos/totonicapan.jpg"), lugar: "Parque central de Totonicapán", autor: "Rodrigobaaz", licencia: "CC BY-SA 4.0" },
};

function buscar(tabla, nombre) {
  const clave = normalizar(nombre);
  const encontrado = Object.entries(tabla).find(([d]) => normalizar(d) === clave);
  return encontrado ? encontrado[1] : null;
}

export function colorDepartamento(nombre) {
  return buscar(COLORES, nombre) || COLOR_POR_DEFECTO;
}

// { foto, lugar, autor, licencia } o null si el departamento no tiene foto
export function fotoDepartamento(nombre) {
  return buscar(FOTOS, nombre);
}

// Texto de créditos de las fotos (lo pide su licencia)
export const CREDITOS_FOTOS =
  "Fotos de paisajes: Wikimedia Commons. " +
  Object.entries(FOTOS)
    .map(([d, f]) => `${f.lugar} (${d}): ${f.autor}, ${f.licencia}`)
    .join(" · ");

// Departamentos con su número de piezas, de más a menos
export function departamentosConPiezas(productos) {
  const mapa = new Map();
  productos.forEach((p) => {
    if (!p.departamento) return;
    const d = mapa.get(p.departamento) || { nombre: p.departamento, piezas: 0, imagenProducto: p.imagen };
    d.piezas++;
    mapa.set(p.departamento, d);
  });
  return [...mapa.values()].sort((a, b) => b.piezas - a.piezas);
}
