// ============================================================================
// Genera supabase/02_productos.sql a partir de frontend/public/js/producto.js
//
//   node supabase/generar-productos-sql.js
//
// El SQL inserta o actualiza (por id) los productos en la tabla `product`.
// Solo se usa para la carga inicial: después, los productos se manejan desde
// el panel admin.html.
// ============================================================================
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const origen = path.join(__dirname, "..", "frontend", "public", "js", "producto.js");
const destino = path.join(__dirname, "02_productos.sql");

const contexto = {};
vm.runInNewContext(`${fs.readFileSync(origen, "utf8")}\nthis.productos = productos;`, contexto);
const productos = contexto.productos;

const texto = (v) => `'${String(v ?? "").replace(/'/g, "''")}'`;

const filas = productos.map((p) =>
  [
    Number(p.id),
    texto(p.nombre),
    texto(p.descripcion),
    texto(p.categoria),
    texto(p.municipio),
    texto(p.departamento),
    texto(p.color),
    Number(p.precio) || 0,
    texto(path.basename(p.imagen)), // "./img/traje-01.jpeg" -> "traje-01.jpeg"
    "true",
  ].join(", ")
);

const sql = `-- ============================================================================
-- RaícesGT — Carga inicial de los ${productos.length} productos
-- Generado con: node supabase/generar-productos-sql.js
-- Ejecutar DESPUÉS de 01_esquema.sql, en Supabase > SQL Editor.
--
-- Inserta o actualiza por id. El producto de ejemplo con id 1
-- ("corte-ejemplo") se reemplaza por el "Traje de Patzún".
-- ============================================================================

insert into public.product
  (id, nombre, descripcion, categoria, municipio, departamento, color, precio, imagen, status)
overriding system value
values
  (${filas.join("),\n  (")})
on conflict (id) do update set
  nombre       = excluded.nombre,
  descripcion  = excluded.descripcion,
  categoria    = excluded.categoria,
  municipio    = excluded.municipio,
  departamento = excluded.departamento,
  color        = excluded.color,
  precio       = excluded.precio,
  imagen       = excluded.imagen,
  status       = excluded.status;

-- Para que los productos nuevos continúen después del id más alto
select setval(pg_get_serial_sequence('public.product', 'id'), (select max(id) from public.product));
`;

fs.writeFileSync(destino, sql);
console.log(`${productos.length} productos -> ${destino}`);
