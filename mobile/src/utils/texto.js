// Minúsculas y sin tildes, para que "solola" encuentre "Sololá"
export function normalizar(texto) {
  return String(texto ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// "Blanco, rojo y negro" -> ["blanco", "rojo", "negro"]
export function coloresDe(producto) {
  return normalizar(producto.color)
    .split(/,|\sy\s/)
    .map((c) => c.trim())
    .filter(Boolean);
}

// Lista de opciones únicas [{ valor, texto }] ordenadas alfabéticamente
export function opcionesUnicas(valores) {
  const mapa = new Map();
  valores.forEach((v) => {
    const clave = normalizar(v);
    if (clave && !mapa.has(clave)) mapa.set(clave, String(v).trim());
  });
  return [...mapa.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], "es"))
    .map(([valor, texto]) => ({ valor, texto }));
}
