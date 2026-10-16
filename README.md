# RaícesGT — Artesanías y Textiles Mayas, S.A.

Sitio web y app Android de catálogo de textiles guatemaltecos: trajes típicos, huipiles, blusas y cortes. Los clientes navegan la colección, filtran por departamento, categoría o color, y consultan precio y disponibilidad por WhatsApp. El personal administra el catálogo y el inventario desde un panel privado.

> Proyecto universitario. Todo funciona con **planes gratuitos**: Supabase, Cloudflare Pages y Expo. Ver costos en [`PUBLICAR.md`](PUBLICAR.md).

**Arquitectura:**

```
  Web (frontend/) ──┐
                    ├──>  Supabase  (productos, inventario, fotos y login de administradores)
  App (mobile/)  ───┘
```

- No hay servidor de API propio: la web y la app leen **directo de Supabase** por HTTPS.
- Productos e inventario se administran desde `admin.html`.
- Guías: [`supabase/README.md`](supabase/README.md) (base de datos) · [`PUBLICAR.md`](PUBLICAR.md) (publicar web, Open Graph y APK) · [`mobile/README.md`](mobile/README.md) (app).

> **Estado actual:** Supabase ya está configurado: 42 productos, inventario y permisos. Falta publicar la web en Cloudflare Pages, activar Open Graph con esa dirección y generar el APK. Más abajo está todo lo que falta.

---

## Índice

1. [Cómo abrir el proyecto](#1-cómo-abrir-el-proyecto)
2. [Estructura del proyecto](#2-estructura-del-proyecto)
3. [Tareas comunes](#3-tareas-comunes)
4. [Lo que ya está hecho](#4-lo-que-ya-está-hecho)
5. [Lo que falta para tener el proyecto al 100 %](#5-lo-que-falta-para-tener-el-proyecto-al-100-)
6. [Contenido que el equipo debe revisar](#6-contenido-que-el-equipo-debe-revisar)
7. [Publicar](#7-publicar)

---

## 1. Cómo abrir el proyecto

```bash
git clone https://github.com/Gione02/raicesgtv2.git
cd raicesgtv2
```

### Web — Opción A: sin Docker (la más simple)

Requisitos: [Node.js](https://nodejs.org/) 18 o superior.

```bash
cd frontend
npm install          # solo la primera vez
npm run watch:css    # genera public/css/styles.css y se queda vigilando cambios
```

En **otra** terminal:

```bash
npx serve frontend/public
```

Abre la dirección que muestra la terminal (normalmente http://localhost:3000). También puedes usar la extensión **Live Server** de VS Code sobre `frontend/public/index.html`.

> **Importante:** si abres los HTML sin haber ejecutado `npm run build:css` o `npm run watch:css`, la página se verá **sin estilos**. `styles.css` se genera; no se sube a GitHub.

### Web — Opción B: con Docker (opcional)

Docker **ya no es necesario**. Hoy solo hace una cosa: compila el CSS y sirve la carpeta `frontend/public` con **nginx** en http://localhost, igual que en un servidor real. Sirve para probar la versión final o para montarla en un servidor propio.

```bash
docker compose up -d --build     # requiere Docker Desktop abierto
```

Después de cada cambio en `frontend/`, vuelve a ejecutar el comando y recarga con **Ctrl + F5**.

### App Android

Instala **Expo Go** en tu celular y ejecuta:

```bash
cd mobile
npm install
npx expo start
```

Escanea el código QR con Expo Go. Más detalles, y cómo generar el **APK**, en [`mobile/README.md`](mobile/README.md).

> **¿Error “la ejecución de scripts está deshabilitada” en PowerShell?** Usa `npx.cmd` en lugar de `npx`, o ejecuta una vez:
> `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`

### Base de datos (Supabase)

La web y la app **no necesitan** un archivo `.env`: la dirección de Supabase y la clave *publishable* (pública por diseño) están en `frontend/public/js/config.js` y `mobile/src/config.js`. Las tablas, los permisos y los administradores se explican en [`supabase/README.md`](supabase/README.md).

> La clave **secret** de Supabase nunca va en el código ni en GitHub.

---

## 2. Estructura del proyecto

```
├── PUBLICAR.md               # Costos, publicar en Cloudflare, Open Graph y APK
├── docker-compose.yml        # (Opcional) sirve la web con nginx
├── .env.example              # Referencia de los datos de conexión (sin claves secretas)
├── supabase/                 # SQL de tablas, permisos, productos e inventario — ver supabase/README.md
├── mobile/                   # App Android (React Native + Expo) — ver mobile/README.md
└── frontend/
    ├── Dockerfile            # (Opcional) compila Tailwind y sirve el sitio con nginx
    ├── package.json          # Scripts: build, build:css, watch:css, build:og
    ├── sitio.json            # Dirección de la web e imagen para compartir (Open Graph)
    ├── scripts/open-graph.js # Escribe las etiquetas Open Graph en cada página
    ├── tailwind.config.js    # Colores, tipografías y tamaños del diseño
    ├── src/input.css         # Estilos propios (franja textil, páginas de texto)
    └── public/               # Lo que se publica
        ├── index.html        # Inicio
        ├── productos.html    # Catálogo con buscador, filtros y vista columnas/lista
        ├── producto.html     # Página de un producto: producto.html?id=12
        ├── nosotros.html     # Sobre nosotros
        ├── contacto.html     # Formulario que abre WhatsApp + preguntas frecuentes
        ├── privacidad.html   # Política de privacidad (texto base)
        ├── terminos.html     # Términos de servicio (texto base)
        ├── sostenibilidad.html
        ├── admin.html        # Panel privado: catálogo e inventario
        ├── img/              # Copia local de las fotos, favicon e imagen para compartir
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

Abre `admin.html` en el sitio publicado o en local e inicia sesión con tu cuenta de administrador. Las cuentas se crean en Supabase; ver [`supabase/README.md`](supabase/README.md). La primera vez aparece una guía corta.

**Pestaña Catálogo**
- **+ Agregar producto**: arrastra la foto, elige la categoría con un botón, llena los datos y mira la **vista previa** de cómo se verá en la web.
- Interruptor **Visible** en cada tarjeta: oculta o muestra un producto con un clic, sin borrarlo.
- Filtros por estado (Todos / Visibles / Ocultos) y por categoría.

**Pestaña Inventario** (privada)
- Resumen: piezas en stock, valor a precio de venta y a costo, stock bajo y agotados.
- Botones **Venta**, **Entrada** y **Ajustar** en cada producto: el stock se actualiza solo y queda en el historial. Si una venta deja el producto en 0, ofrece ocultarlo del catálogo.
- **Descargar Excel (CSV)** con todo el inventario.

Todo aparece **al instante** en la web y en la app, sin publicar de nuevo ni generar otro APK. Los productos con id más alto aparecen como “recién agregados” en el inicio.

| Campo | Regla | Ejemplo |
|---|---|---|
| Categoría | Una de: `Traje`, `Traje de gala`, `Huipil`, `Blusa`, `Corte` | `Huipil` |
| Departamento | Se elige de la lista (con tildes) | `Sololá` |
| Descripción | Que no repita el nombre: origen, técnica, colores, ocasión | — |
| Precio y costo | Internos: **no** se muestran al público | `3500` |

### Cambiar el número de WhatsApp o las redes sociales

Edita `frontend/public/js/config.js` (web) y `mobile/src/config.js` (app). Las redes vacías (`""`) no se muestran.

### Cambiar colores del diseño

Edita `frontend/tailwind.config.js` (web) y `mobile/src/tema.js` (app).

---

## 4. Lo que ya está hecho

**Web**
- [x] Cabecera con color y franja textil, menú para celular y pie de página iguales en todas las páginas
- [x] WhatsApp (+502 3635 5457) en la cabecera, flotante, en el inicio, en cada producto y en contacto; Facebook e Instagram
- [x] Catálogo con buscador sin importar tildes, filtros por departamento, categoría y color, orden y vista **columnas / lista**
- [x] Filtros en la URL para compartirlos (ej. `productos.html?departamento=solola`)
- [x] Página propia por producto, con **Compartir** y productos relacionados
- [x] “Agregados recientemente” automático en el inicio
- [x] Páginas de Contacto, **Sobre nosotros**, Privacidad, Términos y Sostenibilidad
- [x] **Open Graph** en todas las páginas públicas e imagen para compartir de 1200×630
- [x] Íconos SVG, imágenes sin espacios en el nombre, Tailwind compilado y favicon

**Datos y administración**
- [x] Catálogo en **Supabase**: 42 productos con descripciones nuevas y datos normalizados
- [x] Permisos: el público no ve precio, costo ni inventario; solo los administradores editan
- [x] Panel `admin.html` para el personal del negocio, con inicio de sesión, tarjetas con foto, interruptor Visible, foto arrastrable y vista previa
- [x] **Inventario** privado: stock, costo, margen, aviso de stock bajo, ventas/entradas/ajustes con historial y exportación a Excel
- [x] Registros públicos desactivados; Oracle y FastAPI retirados

**App Android**
- [x] React Native + Expo: Inicio, Colección con filtros y vista columnas/lista, detalle, Contacto y Sobre nosotros
- [x] Conectada a Supabase (comprobado: recibe los 42 productos), con copia incluida para funcionar sin internet
- [x] Ícono y pantalla de carga; perfil listo para generar el **APK** (`npm run build:apk`)

---

## 5. Lo que falta para tener el proyecto al 100 %

### 🔴 Para la entrega
- [ ] **Publicar la web** en Cloudflare Pages, gratis y con HTTPS. → [`PUBLICAR.md`](PUBLICAR.md), sección 2
- [ ] **Activar Open Graph** con la dirección publicada (`frontend/sitio.json`). → [`PUBLICAR.md`](PUBLICAR.md), sección 3
- [ ] Cambiar `servidor` en `mobile/src/config.js` por la dirección publicada y **generar el APK**. → [`PUBLICAR.md`](PUBLICAR.md), sección 4
- [ ] Registrar el **stock real y el costo** de cada producto desde el panel (hoy todos tienen 1 pieza y no tienen costo).
- [ ] Antes de cada presentación, abrir la web para confirmar que **Supabase no esté pausado**: el plan gratuito lo pausa tras 1 semana sin uso.

### 🟡 Mejoras opcionales
- [ ] Vista previa con la **foto de cada producto** al compartirlo (Pages Function de Cloudflare). → [`PUBLICAR.md`](PUBLICAR.md), sección 3
- [ ] `sitemap.xml`, `robots.txt` y Google Search Console.
- [ ] Dominio propio, ~USD 10–15 al año. No es necesario: `*.pages.dev` funciona con HTTPS.
- [ ] Cuenta de **TikTok** (se agrega en `config.js`).
- [ ] Revisar si la tabla `admin` de Supabase todavía se usa; el panel usa `administradores`.

### ✅ Decisiones del equipo (octubre 2026)

Se evaluaron y **no se van a implementar**:

- **No se muestran precios.** Se mantiene “Consulta precio y disponibilidad” por WhatsApp; el precio queda solo para uso interno.
- **No habrá carrito ni pedidos en línea.** Las ventas se coordinan por WhatsApp y se registran en el inventario.
- **No se comprimen ni convierten las imágenes.**
- **La app no se publica en Google Play.** Se distribuye como APK.

---

## 6. Contenido que el equipo debe revisar

Estos textos y datos se escribieron o corrigieron con la información disponible. **Alguien que conozca los productos debe confirmarlos.**

- [ ] **Descripciones de los 42 productos** (se editan en `admin.html`).
- [ ] **“San Lucas” (#8 y #12)**: están en el departamento *Guatemala*. ¿Es San Lucas Sacatepéquez, San Lucas Tolimán u otro?
- [ ] **“Sacatepéquez” (#26)** y **“San Pedro” (#36)**: el municipio está incompleto.
- [ ] **Precios que parecen inconsistentes** (no se publican, pero se usan al responder consultas y en el inventario):
  - #1 “Traje de Patzún” completo a **Q350**, mientras varias blusas cuestan Q3,500.
  - Blusas de Patzún entre **Q1,900 y Q3,500**; las de San Lucas Tolimán cuestan **Q900**.
- [ ] **Privacidad, Términos y Sostenibilidad**: textos base. Confirmar formas de pago, cambios y devoluciones, envíos y el trabajo con artesanas.
- [ ] **Preguntas frecuentes** de `contacto.html` (y de la pantalla Contacto de la app).
- [ ] **“Nuestra historia” y “Sobre nosotros”**: hoy tienen un texto general. Busquen los comentarios `<!-- EQUIPO: ... -->` en `nosotros.html`. Si cambian el texto, actualicen también `mobile/src/app/nosotros.js`. Los perfiles de artesanas, solo con su permiso.

---

## 7. Publicar

Todo, paso a paso y gratis, en **[`PUBLICAR.md`](PUBLICAR.md)**:

1. **Costos y límites** de los planes gratuitos.
2. **Web en Cloudflare Pages**: `https://raicesgt.pages.dev`, con HTTPS automático y publicación sola en cada `git push`.
3. **Open Graph**: poner la dirección en `frontend/sitio.json`, ejecutar `npm run build:og` y probar la vista previa.
4. **APK**: generarlo con EAS (gratis) e instalarlo en los celulares.
