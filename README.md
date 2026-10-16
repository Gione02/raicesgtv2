# RaícesGT — Artesanías y Textiles Mayas, S.A.

Sitio web y app Android de catálogo de textiles guatemaltecos: trajes típicos, huipiles, blusas y cortes. Los clientes navegan la colección, filtran por departamento, categoría o color, y consultan precio y disponibilidad por WhatsApp.

**Arquitectura:**

```
  Web (frontend/) ──┐
                    ├──>  Supabase  (tabla product + fotos en Storage + login de administradores)
  App (mobile/)  ───┘
```

- No hay servidor de API propio: la web y la app leen directo de **Supabase**.
- Los productos se administran desde `admin.html`.
- Guía de Supabase: [`supabase/README.md`](supabase/README.md).

> **Estado actual:** la web y la app ya leen de Supabase. Falta que el equipo ejecute la configuración inicial ([`supabase/README.md`](supabase/README.md)) y publicar el sitio con dominio. Más abajo está todo lo que falta para dejarlo al 100 %.

---

## Índice

1. [Cómo abrir el proyecto](#1-cómo-abrir-el-proyecto)
2. [Estructura del proyecto](#2-estructura-del-proyecto)
3. [Tareas comunes](#3-tareas-comunes)
4. [Lo que ya está hecho](#4-lo-que-ya-está-hecho)
5. [Lo que falta para tener el sitio al 100 %](#5-lo-que-falta-para-tener-el-sitio-al-100-)
6. [Contenido que el equipo debe revisar](#6-contenido-que-el-equipo-debe-revisar)
7. [Pasos para publicarlo en internet](#7-pasos-para-publicarlo-en-internet)

---

## 1. Cómo abrir el proyecto

### Opción A — Con Docker (recomendada)

Requisitos: [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y **abierto**.

```bash
git clone <url-del-repositorio>
cd <carpeta-del-repositorio>
docker compose up -d --build
```

Luego abre **http://localhost** en el navegador.

Cada vez que cambies algo dentro de `frontend/` (productos, imágenes, páginas), vuelve a ejecutar:

```bash
docker compose up -d --build
```

y recarga el navegador con **Ctrl + F5**.

> ¿No ves los cambios? Casi siempre es porque no se reconstruyó la imagen. Docker copia los archivos **al construir**, no los lee en vivo.

### Opción B — Sin Docker (para editar el diseño)

Requisitos: [Node.js](https://nodejs.org/) 18 o superior.

```bash
cd frontend
npm install          # solo la primera vez
npm run watch:css    # genera public/css/styles.css y se queda vigilando cambios
```

En otra terminal, sirve la carpeta `frontend/public`. Por ejemplo:

```bash
npx serve frontend/public
```

o abre `frontend/public/index.html` con la extensión **Live Server** de VS Code.

> **Importante:** si abres los HTML sin haber ejecutado `npm run build:css` o `npm run watch:css`, la página se verá **sin estilos**. El archivo `styles.css` se genera; no se sube a GitHub.

### App Android

Instala **Expo Go** en tu celular y ejecuta:

```bash
cd mobile
npm install
npx expo start
```

Escanea el código QR con Expo Go. Más detalles en [`mobile/README.md`](mobile/README.md).

### Base de datos (Supabase)

La web y la app **no necesitan** un archivo `.env`: la dirección de Supabase y la clave *publishable* (pública por diseño) están en `frontend/public/js/config.js` y `mobile/src/config.js`.

La configuración inicial de las tablas, los permisos y el usuario administrador está en [`supabase/README.md`](supabase/README.md).

> La clave **secret** de Supabase nunca va en el código ni en GitHub.

---

## 2. Estructura del proyecto

```
├── docker-compose.yml        # Sirve la web con nginx
├── .env.example              # Referencia de los datos de conexión (sin claves secretas)
├── supabase/                 # SQL de tablas y permisos + carga inicial — ver supabase/README.md
├── mobile/                   # App Android (React Native + Expo) — ver mobile/README.md
└── frontend/
    ├── Dockerfile            # Compila Tailwind y sirve el sitio con nginx
    ├── package.json          # Scripts build:css y watch:css
    ├── tailwind.config.js    # Colores, tipografías y tamaños del diseño
    ├── src/input.css         # Estilos propios (franja textil, páginas de texto)
    └── public/               # Lo que se publica
        ├── index.html        # Inicio
        ├── productos.html    # Catálogo con buscador, filtros y vista columnas/lista
        ├── producto.html     # Página de un producto: producto.html?id=12
        ├── contacto.html     # Formulario que abre WhatsApp + preguntas frecuentes
        ├── privacidad.html   # Política de privacidad (texto base)
        ├── terminos.html     # Términos de servicio (texto base)
        ├── sostenibilidad.html
        ├── admin.html        # Panel para administrar el catálogo (con inicio de sesión)
        ├── img/              # Copia local de las fotos y favicon
        └── js/
            ├── config.js     # Supabase, WhatsApp y redes sociales ← se edita aquí
            ├── datos.js      # Lee los productos de Supabase
            ├── producto.js   # Copia de respaldo del catálogo (si Supabase no responde)
            ├── vendor/       # Librería supabase-js (para el panel)
            ├── layout.js     # Cabecera, pie de página y botón flotante de WhatsApp
            ├── catalogo.js   # Lógica de productos.html
            ├── detalle.js    # Lógica de producto.html
            ├── inicio.js     # "Agregados recientemente" del inicio
            └── admin.js      # Lógica de admin.html
```

---

## 3. Tareas comunes

### Panel de administración (`admin.html`)

Abre `admin.html` en el sitio publicado o en `http://localhost/admin.html` e inicia sesión con tu cuenta de administrador. Las cuentas se crean en Supabase; ver [`supabase/README.md`](supabase/README.md). La primera vez aparece una guía corta.

**Pestaña Catálogo**
- **+ Agregar producto**: arrastra la foto, elige la categoría con un botón, llena los datos y mira la **vista previa** de cómo se verá en la web.
- Interruptor **Visible** en cada tarjeta: oculta o muestra un producto con un clic, sin borrarlo.
- Filtros por estado (Todos / Visibles / Ocultos) y por categoría.

**Pestaña Inventario** (privada)
- Resumen: piezas en stock, valor a precio de venta y a costo, stock bajo y agotados.
- Botones **Venta**, **Entrada** y **Ajustar** en cada producto: el stock se actualiza solo y queda en el historial. Si una venta deja el producto en 0, ofrece ocultarlo del catálogo.
- **Descargar Excel (CSV)** con todo el inventario.

Todo aparece **al instante** en la web y en la app, sin reconstruir Docker. Los productos con id más alto aparecen como “recién agregados” en el inicio.

Reglas para los datos:

| Campo | Regla | Ejemplo |
|---|---|---|
| Categoría | Una de: `Traje`, `Traje de gala`, `Huipil`, `Blusa`, `Corte` | `Huipil` |
| Departamento | Se elige de la lista (con tildes) | `Sololá` |
| Descripción | Que no repita el nombre: origen, técnica, colores, ocasión | — |
| Precio | Interno: **no** se muestra al público | `3500` |

### Cambiar el número de WhatsApp o las redes sociales

Edita `frontend/public/js/config.js`. Las redes que queden vacías (`""`) no se muestran.

### Cambiar colores del diseño

Edita `frontend/tailwind.config.js` (sección `colors`) y reconstruye.

---

## 4. Lo que ya está hecho

- [x] Cabecera con color y franja textil, menú para celular y pie de página iguales en todas las páginas
- [x] Botón de WhatsApp (+502 3635 5457) en la cabecera, flotante, en el inicio, en cada producto y en contacto
- [x] Enlaces a Facebook e Instagram
- [x] Catálogo con buscador sin importar tildes, filtros por departamento, categoría y color, y orden
- [x] Vista en **columnas** o **lista**; el navegador recuerda la elegida
- [x] Los filtros quedan en la URL para compartirlos (ej. `productos.html?departamento=solola`)
- [x] Página propia por producto, con botón **Compartir** y productos relacionados
- [x] “Agregados recientemente” del inicio se genera solo con los últimos productos
- [x] Descripciones nuevas para los 42 productos y datos normalizados (tildes, categorías, nombres)
- [x] Páginas de Contacto, Privacidad, Términos y Sostenibilidad
- [x] Catálogo en **Supabase**: la web y la app leen la misma base de datos
- [x] Panel `admin.html` pensado para el personal del negocio: tarjetas con foto, interruptor Visible, foto arrastrable, vista previa, guía de bienvenida, cómodo en el celular
- [x] **Inventario** privado: stock, costo, margen, aviso de stock bajo, ventas/entradas/ajustes con historial y exportación a Excel
- [x] El precio y el costo no se publican (permisos por columna en Supabase)
- [x] Se retiraron Oracle y el API en FastAPI (el código sigue en la rama `frontend` del repositorio original)
- [x] Íconos que mostraban texto (“search”, “arrow_forward”) reemplazados por SVG
- [x] Imágenes renombradas sin espacios (`traje-01.jpeg`…)
- [x] Tailwind compilado en el build en lugar del CDN de desarrollo
- [x] Favicon
- [x] App Android inicial (React Native + Expo): Inicio, Colección con filtros y vista columnas/lista, detalle, contacto

---

## 5. Lo que falta para tener el sitio al 100 %

Ordenado por prioridad. Los marcados con 🔴 deben resolverse antes de publicar.

### 🔴 Seguridad

- [x] Servidor Oracle (`163.192.133.68`): el puerto 1521 ya no responde (comprobado el 16/10/2026). Si se vuelve a encender, cambiar antes sus contraseñas: están en el historial de Git. `.env` ya no se versiona.
- [x] Registros públicos desactivados en Supabase (comprobado el 16/10/2026).
- [x] Login real en `admin.html` (Supabase Auth + lista de administradores).

### 🔴 Configuración de Supabase (una sola vez)

Pasos detallados en [`supabase/README.md`](supabase/README.md):

- [ ] Ejecutar `supabase/01_esquema.sql` **completo**, incluida la parte de Storage (tablas, permisos y fotos).
- [ ] Ejecutar `supabase/02_productos.sql` (los 42 productos).
- [ ] Ejecutar `supabase/03_inventario.sql` (inventario e historial).
- [ ] Crear el usuario administrador y agregar su correo a `administradores`.
- [ ] Registrar el stock real y el costo de cada producto desde el panel.
- [x] Fotos en el bucket `catalogo` (ya estaban las 43).

Mientras `product` esté vacía, la web y la app muestran la copia de respaldo con los 42 productos.

### ✅ Decisiones del equipo (octubre 2026)

Estos puntos se evaluaron y **no se van a implementar**:

- **No se muestran precios.** El sitio sigue con “Consulta precio y disponibilidad” por WhatsApp. El campo `precio` se mantiene en los datos solo para uso interno.
- **No habrá carrito ni pedidos en línea.** Las ventas se coordinan por WhatsApp.
- **No se comprimen ni convierten las imágenes.** Se conservan las fotos originales.

### 🟡 SEO y redes sociales

- [ ] Etiquetas **Open Graph** para que al compartir un enlace en WhatsApp o Facebook aparezca foto y título.
- [ ] `sitemap.xml` y `robots.txt`.
- [ ] Registrar el sitio en **Google Search Console** cuando tenga dominio.
- [ ] Generar las páginas de producto en el servidor, para que Google lea su contenido sin ejecutar JavaScript.

### 🟡 Otros

- [ ] Página **“Sobre nosotros”**: quiénes son y con qué artesanas o comunidades trabajan.
- [ ] Cuenta de **TikTok** (opcional). Se agrega en `config.js`.
- [ ] **App Android** (`mobile/`): versión inicial lista con React Native + Expo (Inicio, Colección con filtros, detalle y contacto). Ya lee de Supabase. Pendientes en [`mobile/README.md`](mobile/README.md): pruebas en varios celulares y publicación en Google Play.
- [ ] Estadísticas de visitas (Google Analytics o similar).

---

## 6. Contenido que el equipo debe revisar

Estos textos y datos se escribieron o corrigieron con la información disponible. **Alguien que conozca los productos debe confirmarlos.**

- [ ] **Descripciones de los 42 productos** (se editan en `admin.html`): confirmar que la información de cada pieza sea correcta.
- [ ] **“San Lucas” (productos #8 y #12)**: están en el departamento *Guatemala*. ¿Es San Lucas Sacatepéquez, San Lucas Tolimán u otro?
- [ ] **“Sacatepéquez” (#26)** y **“San Pedro” (#36)**: el municipio está incompleto.
- [ ] **Precios que parecen inconsistentes** (no se muestran en el sitio, pero se usan al responder consultas):
  - #1 “Traje de Patzún” completo a **Q350**, mientras varias blusas cuestan Q3,500.
  - Blusas de Patzún entre **Q1,900 y Q3,500**; las de San Lucas Tolimán cuestan **Q900**.
- [ ] **Privacidad, Términos y Sostenibilidad**: son textos base. Confirmar, entre otras cosas:
  - formas de pago aceptadas,
  - política de cambios y devoluciones,
  - tiempos y costos de envío,
  - qué se dice sobre el trabajo con artesanas.
- [ ] **Preguntas frecuentes** de `contacto.html`.
- [ ] **Sección “Nuestra historia”** del inicio: hoy es un texto general.

---

## 7. Pasos para publicarlo en internet

Hoy el sitio corre en `http://localhost` o en el servidor de prueba del equipo, sin dominio ni HTTPS. Para que el público lo vea:

1. **Resolver los puntos 🔴** de la sección 5 (servidor Oracle y configuración de Supabase).
2. **Comprar un dominio**, por ejemplo `raicesgt.com` o `raicesgt.com.gt`.
3. **Elegir dónde alojarlo:**
   - *Recomendado:* hosting estático gratuito (Netlify, Vercel, Cloudflare Pages o GitHub Pages). La base de datos ya está en Supabase, así que no hace falta un servidor propio. Comando de build: `npm install && npm run build:css` dentro de `frontend/`; carpeta a publicar: `frontend/public`.
   - *Alternativa:* un servidor VPS que ejecute `docker compose up -d --build`.
4. **Apuntar el dominio** al hosting, con registros DNS en el proveedor del dominio.
5. **Activar HTTPS** (el candado). Los hostings estáticos lo hacen solos; en un VPS se configura gratis con Let’s Encrypt.
6. **Probar en celular y computadora**: catálogo, filtros, página de producto, botones de WhatsApp y enlaces del pie de página.
7. **Registrar el sitio en Google Search Console** y compartir el enlace en Facebook e Instagram.
