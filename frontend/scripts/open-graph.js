// ============================================================================
// ETIQUETAS OPEN GRAPH (vista previa al compartir en WhatsApp, Facebook, etc.)
//
//   npm run build:og
//
// Escribe en cada página de public/ las etiquetas og:* y twitter:* usando el
// <title> y la <meta name="description"> que ya tiene la página.
// La configuración está en frontend/sitio.json:
//   - "url": el dominio, cuando lo tengan (ej. "https://raicesgt.com").
//     Con dominio se agregan og:url y el enlace canónico, y la imagen se sirve
//     desde el propio sitio.
//   - Sin dominio, la imagen se toma de Supabase ("imagenSinDominio"); hay que
//     subir img/compartir.jpg al bucket "catalogo".
// Se puede ejecutar las veces que quieran: reemplaza el bloque anterior.
// ============================================================================
const fs = require("fs");
const path = require("path");

const raiz = path.join(__dirname, "..");
const publico = path.join(raiz, "public");
const sitio = JSON.parse(fs.readFileSync(path.join(raiz, "sitio.json"), "utf8"));
const dominio = String(sitio.url || "").replace(/\/+$/, "");

const INICIO = "<!-- open-graph: generado por scripts/open-graph.js -->";
const FIN = "<!-- /open-graph -->";

const escapar = (t) => String(t).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const desescapar = (t) => String(t).replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&lt;/g, "<");

const imagen = dominio ? `${dominio}/${sitio.imagenCompartir}` : sitio.imagenSinDominio;
let total = 0;

for (const archivo of fs.readdirSync(publico).filter((f) => f.endsWith(".html"))) {
  if ((sitio.paginasPrivadas || []).includes(archivo)) continue;

  const ruta = path.join(publico, archivo);
  let html = fs.readFileSync(ruta, "utf8");
  const nl = html.includes("\r\n") ? "\r\n" : "\n";

  const titulo = desescapar((html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || sitio.nombre).trim();
  const descripcion = desescapar(
    (html.match(/<meta\s+name="description"\s+content="([^"]*)"/) ||
      html.match(/<meta\s+content="([^"]*)"\s+name="description"/) ||
      html.match(/<meta[\s\S]*?content="([^"]*)"[\s\S]*?name="description"[\s\S]*?\/>/) ||
      [])[1] || ""
  )
    .replace(/\s+/g, " ")
    .trim();

  // Cloudflare Pages sirve las páginas sin ".html" (/productos en vez de /productos.html)
  const urlPagina = dominio ? `${dominio}/${archivo === "index.html" ? "" : archivo.replace(/\.html$/, "")}` : "";
  const etiquetas = [
    INICIO,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapar(sitio.nombre)}" />`,
    `<meta property="og:locale" content="es_GT" />`,
    `<meta property="og:title" content="${escapar(titulo)}" />`,
    descripcion && `<meta property="og:description" content="${escapar(descripcion)}" />`,
    urlPagina && `<meta property="og:url" content="${escapar(urlPagina)}" />`,
    urlPagina && `<link rel="canonical" href="${escapar(urlPagina)}" />`,
    `<meta property="og:image" content="${escapar(imagen)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escapar(sitio.nombre)}: textiles típicos de Guatemala" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="theme-color" content="#2B1D17" />`,
    FIN,
  ]
    .filter(Boolean)
    .map((l) => "    " + l)
    .join(nl);

  // Quita el bloque anterior (si existe) y lo coloca justo después del <title>
  html = html.replace(new RegExp(`\\s*${INICIO.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?${FIN}`), "");
  html = html.replace(/(<title>[\s\S]*?<\/title>)/, `$1${nl}${etiquetas}`);
  fs.writeFileSync(ruta, html);
  total++;
  console.log(`✓ ${archivo}  →  ${titulo}`);
}

console.log(`\nOpen Graph actualizado en ${total} páginas.`);
console.log(dominio ? `Dominio: ${dominio}` : `Sin dominio: la imagen se toma de Supabase (${imagen}).`);
