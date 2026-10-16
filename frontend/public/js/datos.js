// ============================================================================
// DATOS DEL CATÁLOGO
// Lee los productos de Supabase (tabla `product`). Si no hay conexión o
// Supabase falla, usa la copia de respaldo de js/producto.js.
// Requiere js/config.js (y js/producto.js para el respaldo).
// ============================================================================

// Columnas públicas (el precio y el costo no se publican)
const COLUMNAS_PUBLICAS = "id,nombre,descripcion,categoria,municipio,departamento,color,imagen";

// Dirección completa de una foto: acepta un nombre de archivo del bucket
// ("traje-01.jpeg"), una dirección completa o una ruta local ("./img/...")
function urlImagenProducto(imagen) {
  const valor = String(imagen || "").trim();
  if (!valor) return "";
  if (/^https?:\/\//.test(valor) || valor.startsWith("./") || valor.startsWith("/")) return valor;
  const { url, bucketFotos } = SITIO.supabase;
  return `${url}/storage/v1/object/public/${bucketFotos}/${encodeURIComponent(valor)}`;
}

function normalizarProducto(p) {
  return {
    id: Number(p.id),
    nombre: p.nombre || "",
    descripcion: p.descripcion || "",
    categoria: p.categoria || "",
    municipio: p.municipio || "",
    departamento: p.departamento || "",
    color: p.color || "",
    imagen: urlImagenProducto(p.imagen),
  };
}

let promesaProductos = null;

// Devuelve una promesa con la lista de productos (se descarga una sola vez por página)
function cargarProductos() {
  if (promesaProductos) return promesaProductos;

  promesaProductos = (async () => {
    const { url, clave } = SITIO.supabase;
    const control = new AbortController();
    const temporizador = setTimeout(() => control.abort(), 8000);
    try {
      const respuesta = await fetch(`${url}/rest/v1/product?select=${COLUMNAS_PUBLICAS}&status=is.true&order=id`, {
        headers: { apikey: clave },
        signal: control.signal,
      });
      if (!respuesta.ok) throw new Error(`Supabase respondió ${respuesta.status}`);
      const filas = await respuesta.json();
      if (!Array.isArray(filas) || filas.length === 0) throw new Error("Catálogo vacío en Supabase");
      return filas.map(normalizarProducto);
    } catch (error) {
      console.warn("No se pudo leer el catálogo de Supabase; se usa la copia de respaldo.", error);
      return typeof productos !== "undefined" ? productos.map(normalizarProducto) : [];
    } finally {
      clearTimeout(temporizador);
    }
  })();

  return promesaProductos;
}
