// ============================================================================
// CONFIGURACIÓN GENERAL DEL SITIO
// Cambia aquí los datos de contacto y se actualizan en todas las páginas.
// ============================================================================
const SITIO = {
  nombre: "RaícesGT",

  // Base de datos del catálogo. La clave "publishable" es pública por diseño:
  // solo permite lo que autorizan los permisos (RLS) de supabase/01_esquema.sql.
  // NUNCA pongas aquí la clave "secret" ni la contraseña de la base de datos.
  supabase: {
    url: "https://epfyswdzqwkryvyuqycd.supabase.co",
    clave: "sb_publishable_DVkwGB-RdBWQwWBbBD8SLg_SKnUHEUX",
    bucketFotos: "catalogo",
  },

  // Número de WhatsApp con código de país (502 = Guatemala), sin espacios ni "+"
  whatsapp: "50236355457",
  whatsappVisible: "+502 3635 5457",

  // Redes sociales: pega el enlace completo. Las que queden vacías no se muestran.
  redes: {
    facebook: "https://www.facebook.com/profile.php?id=61595374225329",
    instagram: "https://www.instagram.com/raices3gt",
    tiktok: "",
  },
};

// Abre WhatsApp con un mensaje ya escrito
function abrirWhatsApp(mensaje) {
  const texto = encodeURIComponent(mensaje || "Hola, quisiera más información sobre sus textiles.");
  window.open(`https://wa.me/${SITIO.whatsapp}?text=${texto}`, "_blank", "noopener");
}

// Consulta sobre un producto específico
function consultar(producto) {
  abrirWhatsApp(`Hola, quisiera consultar disponibilidad y precio del producto: ${producto}.`);
}
