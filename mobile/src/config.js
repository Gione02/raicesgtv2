// ============================================================================
// CONFIGURACIÓN DE LA APP
// Mismos datos de contacto que la web (frontend/public/js/config.js).
// ============================================================================
import { Linking } from "react-native";

export const SITIO = {
  nombre: "RaícesGT",

  // Servidor donde está publicada la web. De ahí se leen el catálogo
  // (data/productos.json) y las fotos (img/...).
  // Cuando tengan dominio con HTTPS, cámbienlo aquí: "https://raicesgt.com"
  servidor: "http://163.192.133.68",

  whatsapp: "50236355457",
  whatsappVisible: "+502 3635 5457",

  redes: {
    facebook: "https://www.facebook.com/profile.php?id=61595374225329",
    instagram: "https://www.instagram.com/raices3gt",
    tiktok: "",
  },
};

// Dirección completa de una foto del catálogo ("img/traje-01.jpeg")
export function urlImagen(imagen) {
  return encodeURI(`${SITIO.servidor}/${String(imagen).replace(/^\.?\//, "")}`);
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
