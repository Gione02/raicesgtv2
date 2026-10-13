// ============================================================================
// Convierte public/js/producto.js en un archivo JSON que puede leer la app móvil.
//
//   node scripts/exportar-catalogo.js                 -> public/data/productos.json
//   node scripts/exportar-catalogo.js <salida.json>   -> en la ruta indicada
//
// Así la web y la app usan el mismo catálogo: solo se edita producto.js.
// ============================================================================
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const origen = path.join(__dirname, "..", "public", "js", "producto.js");
const destino = path.resolve(process.argv[2] || path.join(__dirname, "..", "public", "data", "productos.json"));

// producto.js declara `const productos = [...]`; lo ejecutamos aislado y lo leemos
const contexto = {};
vm.runInNewContext(`${fs.readFileSync(origen, "utf8")}\nthis.productos = productos;`, contexto, { filename: origen });

const productos = contexto.productos;
if (!Array.isArray(productos) || productos.length === 0) {
  console.error("No se encontraron productos en", origen);
  process.exit(1);
}

const ids = new Set();
for (const p of productos) {
  if (ids.has(p.id)) {
    console.error(`El id ${p.id} está repetido en producto.js`);
    process.exit(1);
  }
  ids.add(p.id);
}

const datos = {
  actualizado: new Date().toISOString(),
  productos: productos.map((p) => ({
    ...p,
    // Ruta relativa al sitio, sin "./": la app le antepone la dirección del servidor
    imagen: String(p.imagen).replace(/^\.\//, ""),
  })),
};

fs.mkdirSync(path.dirname(destino), { recursive: true });
fs.writeFileSync(destino, JSON.stringify(datos, null, 2) + "\n");
console.log(`${productos.length} productos exportados a ${destino}`);
