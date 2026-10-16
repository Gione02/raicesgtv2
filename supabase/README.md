# Supabase — Base de datos de RaícesGT

Supabase reemplaza a Oracle y al API en FastAPI. Guarda:

| Qué | Dónde en Supabase |
|---|---|
| Productos del catálogo | Tabla `product` |
| Fotos | Storage → bucket público `catalogo` |
| Quién puede editar | Tabla `administradores` + usuarios en Authentication |

La web (`frontend/`) y la app (`mobile/`) leen **directo** de Supabase con la clave *publishable*. Ya no hace falta un servidor de API.

- **Proyecto:** `https://epfyswdzqwkryvyuqycd.supabase.co`
- La clave `sb_publishable_…` es pública por diseño y ya está en `frontend/public/js/config.js` y `mobile/src/config.js`.
- La clave **secret** (`sb_secret_…`) y la contraseña de la base de datos **nunca** van en el código ni en GitHub.

---

## Configuración inicial (una sola vez)

### 1. Crear las tablas y los permisos

1. Entra a [supabase.com](https://supabase.com) → tu proyecto → **SQL Editor** → **New query**.
2. Copia **todo** el contenido de [`01_esquema.sql`](01_esquema.sql), pégalo y pulsa **Run**.

Qué hace este script:
- Completa la tabla `product` que ya existía. No borra datos ni columnas.
- Crea la tabla `administradores` y la función `es_admin()`.
- Configura los permisos:
  - Los visitantes solo ven los productos visibles y **sin** precio, costo ni stock.
  - Solo los administradores pueden crear, editar o eliminar.
- Deja público el bucket `catalogo` y permite que solo los administradores suban o borren fotos.

Se puede ejecutar más de una vez sin problema.

### 2. Cargar los 42 productos

En una consulta nueva, pega y ejecuta [`02_productos.sql`](02_productos.sql).

> El producto de ejemplo con id 1 (“corte-ejemplo”) se reemplaza por el “Traje de Patzún”.

### 3. Fotos

Las 43 fotos de `frontend/public/img/` **ya están subidas** al bucket `catalogo` con los mismos nombres. No hay que hacer nada.

Las fotos nuevas se suben desde el panel `admin.html`.

### 4. Crear el usuario administrador

1. **Authentication → Users → Add user → Create new user.**
2. Escribe el correo y una contraseña segura, y marca **Auto Confirm User**.
3. En el **SQL Editor**, autoriza ese correo:

   ```sql
   insert into public.administradores (email) values ('correo-del-admin@ejemplo.com')
   on conflict do nothing;
   ```

Repite el paso para cada persona que deba editar el catálogo.

### 5. Desactivar los registros públicos (importante)

**Authentication → Sign In / Providers → desactiva “Allow new users to sign up”.**

Así nadie puede crearse una cuenta por su cuenta. Los usuarios con sesión pueden **leer** el precio y el costo internos (los necesita el panel), así que solo deben existir las cuentas que ustedes creen.

### Si `02_productos.sql` da error

| Mensaje | Qué hacer |
|---|---|
| `column "precio" does not exist` | Vuelve a ejecutar `01_esquema.sql` completo (agrega las columnas que falten) y luego `02_productos.sql`. |
| `no unique or exclusion constraint matching the ON CONFLICT` | Igual: `01_esquema.sql` deja `id` como clave primaria. |
| `relation "public.product" does not exist` | La tabla se renombró o se borró. Revisa en **Table Editor** cómo se llama ahora. |

### 6. Comprobar

- Abre `productos.html`: deben aparecer los 42 productos.
- Abre `admin.html` e inicia sesión con el usuario del paso 4. Prueba editar un producto y verás el cambio en la web y en la app al recargar.

---

## Cómo se usa en el día a día

| Tarea | Cómo |
|---|---|
| Agregar, editar o eliminar un producto | `admin.html` (con sesión iniciada) |
| Ocultar un producto sin borrarlo | En `admin.html`, desmarca **Visible en el catálogo** |
| Agregar un administrador | Pasos 4 del apartado anterior |
| Ver o editar datos “a mano” | Supabase → **Table Editor** → `product` |

Los cambios se ven **al instante**, sin reconstruir Docker ni publicar una versión nueva de la app.

## Respaldo si Supabase no responde

- **Web:** usa la lista de `frontend/public/js/producto.js`.
- **App:** usa la copia incluida en `mobile/src/datos/productos.json`.

Estas copias **no** se actualizan solas. Si cambian mucho el catálogo, conviene actualizarlas de vez en cuando.

## Pendientes para el equipo

- [ ] Ejecutar los pasos 1 a 5 de arriba.
- [ ] Revisar para qué se creó la tabla `admin` que ya existía en el proyecto. Este esquema usa `administradores`; si `admin` ya no se necesita, se puede borrar.
- [ ] En el ejemplo original, `categoria` y `artisano` guardaban un número (`"1"`). Ahora `categoria` guarda el nombre (`Traje`, `Huipil`…). Si quieren tablas de categorías y artesanas, se pueden agregar después.
- [ ] Ventas, facturas y contabilidad (que estaban en el esquema de Oracle) **no** se migraron, porque el equipo decidió vender por WhatsApp. Si se necesitan en el futuro, se crean como tablas nuevas en Supabase.
- [ ] **Apagar el servidor Oracle** (`163.192.133.68`, puerto 1521) y cambiar sus contraseñas. Ya no se usa, y sus contraseñas están en el historial de Git.
