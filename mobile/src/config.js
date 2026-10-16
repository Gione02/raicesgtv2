// ============================================================================
// CONFIGURACIÓN DE LA APP
// Mismos datos de contacto que la web (frontend/public/js/config.js).
// ============================================================================
import { Linking } from "react-native";

export const SITIO = {
  nombre: "RaícesGT",

  // Base de datos del catálogo (misma que la web). La clave "publishable" es
  // pública por diseño; NUNCA pongas aquí la clave "secret".
  supabase: {
    url: "https://epfyswdzqwkryvyuqycd.supabase.co",
    clave: "sb_publishable_DVkwGB-RdBWQwWBbBD8SLg_SKnUHEUX",
    bucketFotos: "catalogo",
  },

  // Dirección de la web publicada, para compartir enlaces de productos.
  // Cuando tengan dominio, cámbienlo aquí: "https://raicesgt.com"
  servidor: "http://163.192.133.68",

  whatsapp: "50236355457",
  whatsappVisible: "+502 3635 5457",

  redes: {
    facebook: "https://www.facebook.com/profile.php?id=61595374225329",
    instagram: "https://www.instagram.com/raices3gt",
    tiktok: "",
  },
};

// Dirección completa de una foto. Acepta una dirección completa o el nombre del
// archivo en el bucket de Supabase ("traje-01.jpeg" o "img/traje-01.jpeg")
export function urlImagen(imagen) {
  const valor = String(imagen || "").trim();
  if (/^https?:\/\//.test(valor)) return valor;
  const archivo = valor.split("/").pop();
  const { url, bucketFotos } = SITIO.supabase;
  return `${url}/storage/v1/object/public/${bucketFotos}/${encodeURIComponent(archivo)}`;
}

// Dirección de la página web de un producto, para compartir
export function urlProducto(id) {
  return `${SITIO.servidor}/producto.html?id=${id}`;
}

export function abrirWhatsApp(mensaje) {
  const texto = encodeURIComponent(mensaje || "Hola, quisiera más información sobre sus textiles.");
  return Linking.openURL(`https://wa.me/${SITIO.whatsapp}?text=${texto}`);
}

export function consultarProducto(producto) {
  return abrirWhatsApp(
    `Hola, quisiera consultar disponibilidad y precio del producto: ${producto.nombre} (${producto.color}, código ${producto.id}).`
  );
}
