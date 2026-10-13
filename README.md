# RaícesGT — Artesanías y Textiles Mayas, S.A.

Sitio web de catálogo de textiles guatemaltecos: trajes típicos, huipiles, blusas y cortes. Los clientes navegan la colección, filtran por departamento, categoría o color, y consultan precio y disponibilidad por WhatsApp.

> **Estado actual:** el sitio funciona como **catálogo con consultas por WhatsApp**. Todavía **no** está conectado a la base de datos ni publicado en internet. Más abajo está todo lo que falta para dejarlo al 100 %.

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

### Variables de entorno (backend y base de datos)

El backend y Oracle usan un archivo `.env` con contraseñas que **no** debe subirse a GitHub. Copia la plantilla y pide los valores al responsable del proyecto:

```bash
cp .env.example .env
```

---

## 2. Estructura del proyecto

```
├── docker-compose.yml        # Servicios de Docker (hoy solo nginx con el frontend)
├── .env.example              # Plantilla de variables de entorno (sin contraseñas)
├── backend/                  # API (el código completo está en la rama "frontend")
├── oracle/                   # Base de datos Oracle
├── mobile/                   # App móvil (pendiente)
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
        ├── admin.html        # Editor del catálogo (ver "Agregar un producto")
        ├── img/              # Fotos de productos y favicon
        └── js/
            ├── config.js     # WhatsApp y redes sociales ← se edita aquí
            ├── producto.js   # CATÁLOGO: lista de todos los productos
            ├── layout.js     # Cabecera, pie de página y botón flotante de WhatsApp
            ├── catalogo.js   # Lógica de productos.html
            ├── detalle.js    # Lógica de producto.html
            ├── inicio.js     # "Agregados recientemente" del inicio
            └── admin.js      # Lógica de admin.html
```

---

## 3. Tareas comunes

### Agregar o editar un producto

**Con el editor (más fácil):**

1. Abre `http://localhost/admin.html`.
2. Pulsa **+ Nuevo producto**, llena los datos y elige la foto.
3. Pulsa **Descargar producto.js**.
4. Reemplaza `frontend/public/js/producto.js` por el archivo descargado.
5. Copia la foto a `frontend/public/img/` **con el nombre exacto** que muestra el editor.
6. Ejecuta `docker compose up -d --build`.

**A mano:** copia un bloque `{ ... }` en `frontend/public/js/producto.js` y cambia los datos. Reglas:

| Campo | Regla | Ejemplo |
|---|---|---|
| `id` | Número único. Los más altos aparecen como “recién agregados” en el inicio. | `43` |
| `categoria` | Una de: `Traje`, `Traje de gala`, `Huipil`, `Blusa`, `Corte` | `"Huipil"` |
| `departamento` | Con tildes, tal como se escribe oficialmente | `"Sololá"` |
| `imagen` | Archivo dentro de `img/`, **sin espacios** | `"./img/traje-40.jpeg"` |
| `descripcion` | Que no repita el nombre: origen, técnica, colores, ocasión | — |

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
- [x] Editor del catálogo (`admin.html`)
- [x] Íconos que mostraban texto (“search”, “arrow_forward”) reemplazados por SVG
- [x] Imágenes renombradas sin espacios (`traje-01.jpeg`…)
- [x] Tailwind compilado en el build en lugar del CDN de desarrollo
- [x] Favicon

---

## 5. Lo que falta para tener el sitio al 100 %

Ordenado por prioridad. Los marcados con 🔴 deben resolverse antes de publicar.

### 🔴 Seguridad

- [ ] **Cambiar las contraseñas de la base de datos.** El archivo `.env` con contraseñas reales quedó guardado en el historial de Git del repositorio original. Aunque se quite ahora, sigue visible en commits anteriores; hay que considerarlas expuestas y cambiarlas.
- [ ] **Dejar de versionar `.env`** (`git rm --cached .env`). Ya existe `.env.example` como plantilla.
- [ ] **Login real en `admin.html`** antes de publicarlo. Hoy no tiene contraseña porque no guarda nada en el servidor; cuando se conecte al API, debe exigir inicio de sesión.

### 🔴 Backend y base de datos

- [ ] **Unir el backend al proyecto principal.** El API (FastAPI) y el esquema de Oracle (`db.sql`) están en la rama `frontend` del repositorio original, no en `main`. En `main`, `docker-compose.yml` solo levanta nginx.
- [ ] **Corregir `backend/requirements.txt`**: instala `pymongo` (MongoDB), pero el proyecto usa Oracle (`oracledb`).
- [ ] **Ampliar la tabla `products`**: hoy no tiene los campos que usa la página: `municipio`, `departamento`, `color`, `imagen`, `descripcion`.
- [ ] **Conectar el catálogo al API** (`GET /products`) en lugar de `js/producto.js`. Así los productos se manejan desde el panel sin tocar código ni reconstruir Docker.
- [ ] **Guardar desde `admin.html` directo en la base de datos**, incluyendo la subida de fotos.

### 🟠 Decisiones del equipo

- [ ] **Mostrar precios o no.** Opciones: precio exacto, “desde Q…” por categoría, o seguir con “Consulta precio”. Si se muestran, se puede agregar un filtro por rango de precio.
- [ ] **Carrito y pedidos en línea.** El backend ya tiene `POST /sales-orders` y facturas, pero falta la pantalla. Alternativa sencilla: un carrito que arme un solo mensaje de WhatsApp con varios productos.
- [ ] **Convertir imágenes a WebP.** Hoy son ~8.8 MB y algunas pasan de 1 MB.
  - Ventajas: 5–10 veces más livianas, carga más rápida en celular, mejor posición en Google.
  - Desventajas: hay que convertir cada foto nueva (se puede automatizar en el build) y se pierde calidad si se comprime de más.

### 🟡 SEO y redes sociales

- [ ] Etiquetas **Open Graph** para que al compartir un enlace en WhatsApp o Facebook aparezca foto y título.
- [ ] `sitemap.xml` y `robots.txt`.
- [ ] Registrar el sitio en **Google Search Console** cuando tenga dominio.
- [ ] Generar las páginas de producto en el servidor, para que Google lea su contenido sin ejecutar JavaScript.

### 🟡 Otros

- [ ] Página **“Sobre nosotros”**: quiénes son y con qué artesanas o comunidades trabajan.
- [ ] Cuenta de **TikTok** (opcional). Se agrega en `config.js`.
- [ ] App móvil (`mobile/`): sin empezar.
- [ ] Estadísticas de visitas (Google Analytics o similar).

---

## 6. Contenido que el equipo debe revisar

Estos textos y datos se escribieron o corrigieron con la información disponible. **Alguien que conozca los productos debe confirmarlos.**

- [ ] **Descripciones de los 42 productos** (`js/producto.js`): confirmar que la información de cada pieza sea correcta.
- [ ] **“San Lucas” (productos #8 y #12)**: están en el departamento *Guatemala*. ¿Es San Lucas Sacatepéquez, San Lucas Tolimán u otro?
- [ ] **“Sacatepéquez” (#26)** y **“San Pedro” (#36)**: el municipio está incompleto.
- [ ] **Precios que parecen inconsistentes**:
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

Hoy el sitio solo corre en la computadora de quien ejecuta Docker (`http://localhost`). Para que el público lo vea:

1. **Resolver los puntos 🔴** de la sección 5 (contraseñas, `.env`, login del panel).
2. **Comprar un dominio**, por ejemplo `raicesgt.com` o `raicesgt.com.gt`.
3. **Elegir dónde alojarlo:**
   - *Solo catálogo (sin backend):* hosting estático gratuito o barato (Netlify, Vercel, Cloudflare Pages, GitHub Pages). Comando de build: `npm run build:css` dentro de `frontend/`; carpeta a publicar: `frontend/public`.
   - *Con backend y base de datos:* un servidor VPS (DigitalOcean, Linode, AWS Lightsail, etc.) que ejecute `docker compose up -d --build`.
4. **Apuntar el dominio** al hosting, con registros DNS en el proveedor del dominio.
5. **Activar HTTPS** (el candado). Los hostings estáticos lo hacen solos; en un VPS se configura gratis con Let’s Encrypt.
6. **Probar en celular y computadora**: catálogo, filtros, página de producto, botones de WhatsApp y enlaces del pie de página.
7. **Registrar el sitio en Google Search Console** y compartir el enlace en Facebook e Instagram.
