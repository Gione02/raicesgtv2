# Supabase — Base de datos de RaícesGT

Supabase reemplaza a Oracle y al API en FastAPI. Guarda:

| Qué | Dónde en Supabase | ¿Público? |
|---|---|---|
| Productos del catálogo | Tabla `product` | Sí (sin precio) |
| Fotos | Storage → bucket `catalogo` | Sí |
| Inventario: stock, costo, aviso, artesana | Tabla `inventario` | No, solo administradores |
| Historial de ventas, entradas y ajustes | Tabla `inventario_movimientos` | No, solo administradores |
| Quién puede administrar | Tabla `administradores` + usuarios en Authentication | No |

La web (`frontend/`) y la app (`mobile/`) leen **directo** de Supabase con la clave *publishable*. Ya no hace falta un servidor de API.

- **Proyecto:** `https://epfyswdzqwkryvyuqycd.supabase.co`
- La clave `sb_publishable_…` es pública por diseño y ya está en `frontend/public/js/config.js` y `mobile/src/config.js`.
- La clave **secret** (`sb_secret_…`) y la contraseña de la base de datos **nunca** van en el código ni en GitHub.

---

## Configuración inicial (una sola vez)

En [supabase.com](https://supabase.com) → tu proyecto → **SQL Editor** → **New query**, ejecuta **en este orden**. Copia y pega **todo** el contenido de cada archivo y pulsa **Run**:

| Paso | Archivo | Qué hace |
|---|---|---|
| 1 | [`01_esquema.sql`](01_esquema.sql) | Completa la tabla `product`, crea `administradores`, configura los permisos y el bucket de fotos |
| 2 | [`02_productos.sql`](02_productos.sql) | Carga los 42 productos |
| 3 | [`03_inventario.sql`](03_inventario.sql) | Convierte la tabla antigua `productos` en `inventario` y crea el historial de movimientos |

Los tres se pueden ejecutar más de una vez sin problema.

> **Importante:** ejecuta `01_esquema.sql` **completo**, incluida la parte final de *Storage*. Sin ella, el panel no puede subir fotos.

### Qué hace `01_esquema.sql`
- Completa la tabla `product` (agrega `precio`, `status`, etc. si faltan) y deja `id` como clave primaria.
- Crea la tabla `administradores` y la función `es_admin()`.
- Configura los permisos:
  - Los visitantes solo ven los productos visibles y **sin** precio.
  - Solo los administradores crean, editan o eliminan.
- Deja público el bucket `catalogo` y permite que solo los administradores suban o borren fotos.

### Qué hace `03_inventario.sql`
- **Reutiliza la tabla antigua `productos`**: la renombra a `inventario` y la deja con una fila por producto del catálogo (`producto_id`).
  - Conserva `stock` y `costo`.
  - Renombra `reorder_level` → `punto_reorden`, `unit_of_measure` → `unidad` y `artisano` → `artesana`.
  - Quita las columnas que ya están en `product` y la fila de ejemplo.
- Cada producto empieza con **1 pieza**. Los productos nuevos reciben su fila de inventario automáticamente.
- Crea `inventario_movimientos`. Al registrar una **venta**, **entrada** o **ajuste**, el stock se actualiza solo y queda el historial: quién, cuándo, antes → después y una nota. No permite vender más piezas de las que hay.
- Todo queda **privado**: solo los administradores lo ven. Esto también corrige que hoy cualquiera puede leer el costo de la tabla `productos`.

### Fotos

Las 43 fotos de `frontend/public/img/` **ya están subidas** al bucket `catalogo` con los mismos nombres. Las fotos nuevas se suben desde el panel.

### Crear el usuario administrador

1. **Authentication → Users → Add user → Create new user.**
2. Escribe el correo y una contraseña segura, y marca **Auto Confirm User**.
3. En el **SQL Editor**, autoriza ese correo:

   ```sql
   insert into public.administradores (email) values ('correo-del-admin@ejemplo.com')
   on conflict do nothing;
   ```

Repite el paso para cada persona que deba administrar.

### Registros públicos

Ya están **desactivados**: lo comprobamos el 16/10/2026 (`disable_signup = true`). Si alguna vez hay que revisarlo: **Authentication → Sign In / Providers → “Allow new users to sign up”** debe estar apagado. Así solo existen las cuentas que ustedes crean.

### Si algo da error

| Mensaje | Qué hacer |
|---|---|
| `column "precio" does not exist` | Vuelve a ejecutar `01_esquema.sql` completo y luego `02_productos.sql`. |
| `no unique or exclusion constraint matching the ON CONFLICT` | Igual: `01_esquema.sql` deja `id` como clave primaria. |
| `relation "public.product" does not exist` | La tabla se renombró o se borró. Revisa en **Table Editor** cómo se llama ahora. |
| `violates foreign key constraint "inventario_producto_fk"` | Hay filas de inventario de productos que no existen. Ejecuta antes `02_productos.sql`. |
| El panel dice “El inventario aún no está activado” | Falta ejecutar `03_inventario.sql`. |

### Comprobar

- Abre `productos.html`: deben aparecer los 42 productos.
- Abre `admin.html`, inicia sesión y prueba:
  - Editar un producto: el cambio se ve en la web y en la app al recargar.
  - Apagar el interruptor **Visible** de un producto: desaparece de la web.
  - En **Inventario**, registrar una **Venta**: el stock baja y aparece en “Últimos movimientos”.

---

## Cómo se usa en el día a día

Todo desde **`admin.html`**:

| Tarea | Dónde |
|---|---|
| Agregar, editar o eliminar un producto | Pestaña **Catálogo** |
| Ocultar un producto sin borrarlo | Interruptor **Visible** de la tarjeta |
| Registrar una venta | **Inventario** → **Venta**. Si queda en 0, ofrece ocultarlo |
| Registrar mercadería que llegó | **Inventario** → **Entrada** |
| Corregir el stock después de contar | **Inventario** → **Ajustar** |
| Ver qué se está acabando | **Inventario** → filtros **Stock bajo** / **Agotados** |
| Llevar el inventario a Excel | **Inventario** → **Descargar Excel (CSV)** |
| Agregar un administrador | Supabase (ver “Crear el usuario administrador”) |

Los cambios se ven **al instante**, sin reconstruir Docker ni publicar una versión nueva de la app.

## Respaldo si Supabase no responde

- **Web:** usa la lista de `frontend/public/js/producto.js`.
- **App:** usa la copia incluida en `mobile/src/datos/productos.json`.

Estas copias **no** se actualizan solas. Si cambian mucho el catálogo, conviene actualizarlas de vez en cuando.

## Pendientes para el equipo

- [ ] Ejecutar `01_esquema.sql` (completo), `02_productos.sql` y `03_inventario.sql`.
- [ ] Crear el usuario administrador y agregar su correo a `administradores`.
- [ ] Registrar el **stock real** y el **costo** de cada producto: Inventario → **Ajustar**, y **Editar** para el costo.
- [ ] Revisar para qué se creó la tabla `admin`. Este esquema usa `administradores`; si `admin` ya no se necesita, se puede borrar.
- [ ] Ventas, facturas y contabilidad del esquema de Oracle **no** se migraron: el equipo vende por WhatsApp y el historial de ventas queda en `inventario_movimientos`.
- [ ] Si se vuelve a encender el servidor Oracle (`163.192.133.68`), cambiar antes sus contraseñas; están en el historial de Git.
