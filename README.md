# RaícesGT — Artesanías y Textiles Mayas, S.A.

Sitio web y app Android de catálogo de textiles guatemaltecos: trajes típicos, huipiles, blusas y cortes. Los clientes navegan la colección, filtran por departamento, categoría o color, y consultan precio y disponibilidad por WhatsApp. El personal administra el catálogo y el inventario desde un panel privado.

> Proyecto universitario. Todo funciona con **planes gratuitos** (Supabase, Cloudflare Pages y Expo): costo **USD 0**.

## Enlaces rápidos

| Qué | Dónde |
|---|---|
| 🌐 **Web publicada** | **https://raicesgt.pages.dev** |
| 🔒 Panel de administración | https://raicesgt.pages.dev/admin |
| 📱 **APK de la app** (v1.0.0) | [Descargar](https://expo.dev/artifacts/eas/p_8B2rf4Sp_45U3Ief8TsWwe_Rixu2g2R089LTYYSiY.apk) · [Página del build con QR](https://expo.dev/accounts/gione02/projects/raicesgt/builds/233aed1b-0024-4092-b33c-d59966f089c4) |
| 🗄️ Base de datos | [Supabase](https://supabase.com/dashboard) · proyecto `epfyswdzqwkryvyuqycd` |
| 💻 Código | https://github.com/Gione02/raicesgtv2 |

> **Guarden una copia del `.apk` en Drive.** Los enlaces de descarga de Expo pueden expirar con el tiempo.

## Arquitectura

```
  Web (frontend/)  ──┐                         ┌── Publicada en Cloudflare Pages
                     ├──>  Supabase  ──────────┤
  App (mobile/)    ──┘   (productos,           └── App distribuida como APK (EAS Build)
                          inventario, fotos,
                          login de admins)
```

- No hay servidor de API propio: la web y la app leen **directo de Supabase** por HTTPS.
- Productos, fotos e inventario se administran desde el panel `/admin`. Los cambios aparecen **al instante** en la web y en la app.
- Guías detalladas: [`supabase/README.md`](supabase/README.md) (base de datos) · [`PUBLICAR.md`](PUBLICAR.md) (costos, Cloudflare, Open Graph y APK) · [`mobile/README.md`](mobile/README.md) (app).

---

## Índice

1. [Estado del proyecto](#1-estado-del-proyecto)
2. [Qué falta para el 100 %](#2-qué-falta-para-el-100-)
3. [Cómo abrir el proyecto en tu computadora](#3-cómo-abrir-el-proyecto-en-tu-computadora)
4. [Cómo hacer cambios](#4-cómo-hacer-cambios)
5. [Estructura del proyecto](#5-estructura-del-proyecto)
6. [Panel de administración](#6-panel-de-administración)
7. [Contenido que el equipo debe revisar](#7-contenido-que-el-equipo-debe-revisar)
8. [Decisiones del equipo](#8-decisiones-del-equipo)

---

## 1. Estado del proyecto

**Web** ✅ publicada en https://raicesgt.pages.dev
- Inicio, Colección (buscador sin importar tildes, filtros por departamento, categoría y color, orden, vista columnas/lista), página por producto con **Compartir** y relacionados, Sobre nosotros, Contacto, Privacidad, Términos y Sostenibilidad.
- WhatsApp (+502 3635 5457) en toda la web; Facebook e Instagram.
- **Open Graph** activo: al compartir un enlace aparece una tarjeta con imagen, título y descripción.
- HTTPS, favicon, diseño adaptado al celular.

**Datos y administración** ✅ en Supabase
- 42 productos con descripciones y datos normalizados; fotos en Storage.
- Permisos: el público **no** ve precio, costo ni inventario. Solo los administradores editan. Registros públicos desactivados.
- Panel `/admin` con inicio de sesión: catálogo (tarjetas con foto, visible/oculto, foto arrastrable, vista previa) e **inventario** (stock, costo, margen, aviso de stock bajo, ventas/entradas/ajustes con historial, exportar a Excel).

**App Android** ✅ APK v1.0.0 generado
- Inicio, Colección con filtros y vista columnas/lista, detalle con WhatsApp y Compartir, Contacto, Sobre nosotros.
- Lee de Supabase, con copia incluida para funcionar sin internet.

**Retirado:** Oracle, el API en FastAPI y el servidor de prueba `163.192.133.68`. El código antiguo sigue en la rama `frontend` del repositorio original.

---

## 2. Qué falta para el 100 %

### 🔴 Obligatorio antes de la entrega
- [ ] **Instalar y probar el APK** en al menos dos celulares Android: Colección, filtros, WhatsApp, Compartir y Sobre nosotros. En la pestaña Contacto debe decir “actualizado desde el servidor”.
- [ ] **Probar la vista previa al compartir:** pegar `https://raicesgt.pages.dev` en [opengraph.xyz](https://www.opengraph.xyz) y enviarlo por WhatsApp.
- [ ] **Registrar el stock y el costo reales** de cada producto en `/admin` → Inventario. Hoy todos tienen 1 pieza y no tienen costo.
- [ ] **Revisar el contenido** de la [sección 7](#7-contenido-que-el-equipo-debe-revisar): descripciones, municipios, textos legales e historia.
- [ ] **Antes de cada presentación:** abrir la web o el panel. Supabase gratis **pausa el proyecto tras 1 semana sin uso**; si está pausado, se reactiva en Supabase con **Restore project**.

### 🟡 Recomendado
- [ ] Guardar el `.apk` en Drive y compartir el enlace con el equipo.
- [ ] Tomar capturas de la web, del panel y de la app para el informe o la presentación.
- [ ] Revisar si la tabla `admin` de Supabase todavía se usa; el panel usa `administradores`.
- [ ] Agregar a los demás integrantes como administradores (ver [`supabase/README.md`](supabase/README.md)).

### ⚪ Opcional (mejoras futuras)
- [ ] Vista previa con la **foto de cada producto** al compartirlo (Pages Function de Cloudflare). Ver [`PUBLICAR.md`](PUBLICAR.md), sección 3.
- [ ] `sitemap.xml`, `robots.txt` y Google Search Console.
- [ ] Dominio propio, ~USD 10–15 al año (`raicesdeguatemala.com` estaba libre).
- [ ] Cuenta de TikTok (se agrega en `config.js`).
- [ ] Perfiles de artesanas en “Sobre nosotros”, solo con su permiso.

---

## 3. Cómo abrir el proyecto en tu computadora

**Requisitos:** [Git](https://git-scm.com/), [Node.js](https://nodejs.org/) 18 o superior y [VS Code](https://code.visualstudio.com/).

```bash
git clone https://github.com/Gione02/raicesgtv2.git
cd raicesgtv2
```

> **¿Error “la ejecución de scripts está deshabilitada” en PowerShell?** Ejecuta una sola vez
> `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` y responde **S**.
> O usa `npm.cmd` y `npx.cmd` en lugar de `npm` y `npx`.

### Web

```bash
cd frontend
npm install           # solo la primera vez
npm run watch:css     # genera los estilos y se queda vigilando cambios (deja esta terminal abierta)
```

En **otra** terminal:

```bash
npx serve frontend/public
```

Abre http://localhost:3000. Cada vez que guardes un archivo, recarga el navegador con **Ctrl + F5**.

> Docker es **opcional**: `docker compose up -d --build` sirve la web en http://localhost con nginx. Solo es útil si quieren montarla en un servidor propio.

### App

```bash
cd mobile
npm install           # solo la primera vez
npx expo start
```

Escanea el código QR con la app **Expo Go**, que se descarga de Google Play. El celular y la computadora deben estar en la misma red Wi-Fi; si no conecta, usa `npx expo start --tunnel`. Cada vez que guardes un archivo, la app se actualiza sola en el celular.

---

## 4. Cómo hacer cambios

### ¿Qué quieres cambiar?

| Quiero cambiar… | Cómo | ¿Hay que publicar? |
|---|---|---|
| Productos, fotos, descripciones, visibilidad | Panel `/admin` → **Catálogo** | **No.** Se ve al instante en web y app |
| Stock, ventas, costos | Panel `/admin` → **Inventario** | **No** |
| Textos, diseño o páginas de la **web** | Código en `frontend/` → [4.2](#42-cambios-en-la-web) | Sí: `npm run publicar` |
| Pantallas o diseño de la **app** | Código en `mobile/` → [4.3](#43-cambios-en-la-app) | Sí: generar un **APK nuevo** |
| WhatsApp o redes sociales | `frontend/public/js/config.js` **y** `mobile/src/config.js` | Sí, los dos |
| Estructura de la base de datos | SQL en `supabase/` → [4.4](#44-cambios-en-la-base-de-datos) | Depende |

### 4.1 Antes de empezar: trabajar en equipo con Git

Para no pisar el trabajo de los demás:

```bash
git pull v2 main            # 1. SIEMPRE antes de empezar: baja los cambios del equipo
# ... haces tus cambios y los pruebas ...
git add .
git commit -m "Describe en una frase qué cambiaste"
git push v2 mejoras-catalogo-y-diseno:main   # 3. súbelos
```

- Si clonaste el repositorio desde cero, el remoto se llama `origin` y la rama `main`: usa `git pull` y `git push`.
- Avisen en el grupo antes de cambiar el mismo archivo que otra persona.
- **Nunca** suban contraseñas ni la clave *secret* de Supabase. La clave *publishable* sí puede estar en el código.

### 4.2 Cambios en la web

1. **Abre la web en tu computadora** ([sección 3](#3-cómo-abrir-el-proyecto-en-tu-computadora)).
2. **Edita el archivo que corresponda:**

   | Para cambiar… | Archivo |
   |---|---|
   | Textos del inicio | `frontend/public/index.html` |
   | Página Sobre nosotros | `frontend/public/nosotros.html` (busca los comentarios `<!-- EQUIPO: ... -->`) |
   | Contacto y preguntas frecuentes | `frontend/public/contacto.html` |
   | Privacidad, Términos, Sostenibilidad | `privacidad.html`, `terminos.html`, `sostenibilidad.html` |
   | Menú, pie de página, botón flotante | `frontend/public/js/layout.js` |
   | WhatsApp, redes sociales, Supabase | `frontend/public/js/config.js` |
   | Catálogo: buscador, filtros, tarjetas | `frontend/public/js/catalogo.js` |
   | Página de un producto | `frontend/public/js/detalle.js` |
   | Panel de administración | `frontend/public/admin.html` y `js/admin.js` |
   | Colores y tipografías | `frontend/tailwind.config.js` |
   | Imagen para compartir (Open Graph) | `frontend/public/img/compartir.jpg` (1200×630) |
   | Título o descripción al compartir una página | `<title>` y `<meta name="description">` de esa página |

   - Los estilos usan **Tailwind**: se escriben como clases en el HTML (`class="text-primary font-bold"`). `npm run watch:css` los genera solo.
   - **Página nueva:** copia una existente (por ejemplo `terminos.html`), cambia el `<title>`, la descripción y el contenido, y agrégala al menú en `js/layout.js` (lista `ENLACES` o `LEGALES`).

3. **Pruébala** en el navegador, también en tamaño celular: F12 → ícono de celular.
4. **Publícala:**

   ```bash
   cd frontend
   npm run publicar
   ```

   Compila los estilos, regenera Open Graph y sube la web a Cloudflare. En 1–2 minutos está en línea. La primera vez en otra computadora pedirá iniciar sesión en Cloudflare (`npx wrangler@4.147.0 login` → **Allow**). La cuenta es la de `brayancubur@gmail.com`; pídanle acceso si otra persona va a publicar.
5. **Sube el código** a GitHub ([4.1](#41-antes-de-empezar-trabajar-en-equipo-con-git)).

### 4.3 Cambios en la app

1. **Abre la app** con Expo Go ([sección 3](#3-cómo-abrir-el-proyecto-en-tu-computadora)).
2. **Edita el archivo que corresponda:**

   | Para cambiar… | Archivo |
   |---|---|
   | Pantalla de inicio | `mobile/src/app/(tabs)/index.js` |
   | Colección (buscador, filtros) | `mobile/src/app/(tabs)/catalogo.js` |
   | Contacto y preguntas frecuentes | `mobile/src/app/(tabs)/contacto.js` |
   | Detalle de un producto | `mobile/src/app/producto/[id].js` |
   | Sobre nosotros | `mobile/src/app/nosotros.js` (mismos textos que `nosotros.html`) |
   | Pestañas inferiores | `mobile/src/app/(tabs)/_layout.js` |
   | Tarjeta de producto, cabecera, botones | `mobile/src/components/` |
   | WhatsApp, redes, Supabase, dirección de la web | `mobile/src/config.js` |
   | Colores | `mobile/src/tema.js` |
   | Nombre, ícono, versión | `mobile/app.json` y `mobile/assets/` |

   - **Pantalla nueva:** crea un archivo en `mobile/src/app/` (por ejemplo `envios.js`). Expo Router la convierte en la ruta `/envios`. Para que tenga cabecera con título, regístrala en `mobile/src/app/_layout.js` como las demás.
   - **Librería nueva:** instálala **siempre** con `npx expo install <paquete>`, no con `npm install`. Así se instala la versión compatible con Expo SDK 57; con otra versión puede fallar el build del APK.

3. **Pruébala** en el celular con Expo Go.
4. **Revisa que no haya problemas** antes de generar el APK:

   ```bash
   cd mobile
   npx expo-doctor          # debe decir "21/21 checks passed"
   ```

5. **Sube la versión** en `mobile/app.json`: `"version"` (ej. `1.0.0` → `1.0.1`) y `"versionCode"` (ej. `1` → `2`). Sin esto, el APK nuevo no se instala encima del anterior.
6. **Genera el APK:**

   ```bash
   npx eas-cli@latest login     # solo la primera vez en esta computadora
   npm run build:apk
   ```

   Al terminar aparece el enlace de descarga. El plan gratuito permite **15 builds**: no generes uno por cada cambio pequeño; prueba antes con Expo Go.
7. **Sube el código** a GitHub y **actualiza el enlace del APK** en la tabla de [Enlaces rápidos](#enlaces-rápidos).

> Los cambios de **productos** nunca necesitan un APK nuevo: llegan solos desde Supabase.

### 4.4 Cambios en la base de datos

- **No borren ni renombren** columnas o tablas sin revisar el código: la web, la app y el panel dependen de `product`, `inventario`, `inventario_movimientos` y `administradores`.
- Los cambios de estructura se guardan como un archivo SQL nuevo en `supabase/` (ej. `04_nueva_columna.sql`) y se ejecutan en **Supabase → SQL Editor**. Así queda registro.
- **Columna pública nueva en `product`** (que deba verse en web y app):
  1. Créala: `alter table public.product add column ...`.
  2. Dale permiso al público: `grant select (nueva_columna) on public.product to anon;`.
  3. Agrégala a `COLUMNAS_PUBLICAS` en `frontend/public/js/datos.js` y a `COLUMNAS` en `mobile/src/datos/CatalogoContext.js`.
  4. Si va en el panel, agrégala también en `js/admin.js`.
- **Datos privados** (como el costo): van en `inventario`, que solo ven los administradores.

### 4.5 Mantener las copias de respaldo

Si Supabase no responde, la web usa `frontend/public/js/producto.js` y la app usa `mobile/src/datos/productos.json`. Estas copias **no** se actualizan solas. Si el catálogo cambia mucho, actualícenlas de vez en cuando:
1. Copien los productos actuales a `producto.js`, en el mismo formato.
2. En `mobile/`, ejecuten `npm run sync:catalogo` para regenerar la copia de la app.

---

## 5. Estructura del proyecto

```
├── README.md                 # Este archivo
├── PUBLICAR.md               # Costos, Cloudflare, Open Graph y APK
├── docker-compose.yml        # (Opcional) sirve la web con nginx
├── .env.example              # Referencia de conexión (sin claves secretas)
├── supabase/                 # SQL: esquema y permisos (01), productos (02), inventario (03)
├── mobile/                   # App Android — ver mobile/README.md
│   ├── app.json              # Nombre, ícono, versión, paquete com.raicesgt.app
│   ├── eas.json              # Perfil "apk" para EAS Build
│   ├── assets/               # Íconos, pantalla de carga e imágenes para tienda
│   └── src/
│       ├── app/              # Pantallas (Expo Router)
│       ├── components/       # Tarjeta, cabecera, filtros, botones
│       ├── datos/            # Carga del catálogo + copia incluida
│       ├── config.js         # Supabase, WhatsApp, redes, dirección de la web
│       └── tema.js           # Colores
└── frontend/                 # Web
    ├── package.json          # Scripts: watch:css, build, build:og, publicar
    ├── sitio.json            # Dirección publicada e imagen para compartir
    ├── scripts/open-graph.js # Escribe las etiquetas Open Graph
    ├── tailwind.config.js    # Colores y tipografías
    ├── src/input.css         # Estilos propios
    └── public/               # Lo que se publica
        ├── *.html            # Páginas (index, productos, producto, nosotros, contacto, admin…)
        ├── img/              # Fotos, favicon, imagen para compartir
        └── js/               # config, datos, layout, catalogo, detalle, inicio, admin, vendor/
```

---

## 6. Panel de administración

**https://raicesgt.pages.dev/admin**. Las cuentas se crean en Supabase y su correo debe estar en la tabla `administradores` (ver [`supabase/README.md`](supabase/README.md)).

**Catálogo**
- **+ Agregar producto:** arrastra la foto, elige la categoría, llena los datos y revisa la **vista previa**.
- Interruptor **Visible:** oculta o muestra un producto sin borrarlo.
- Filtros por estado (Todos / Visibles / Ocultos) y por categoría.

**Inventario** (privado)
- Resumen: piezas en stock, valor a precio y a costo, stock bajo y agotados.
- **Venta**, **Entrada** y **Ajustar:** el stock se actualiza solo y queda en el historial. Si una venta deja un producto en 0, ofrece ocultarlo.
- **Descargar Excel (CSV).**

| Campo | Regla | Ejemplo |
|---|---|---|
| Categoría | Una de: `Traje`, `Traje de gala`, `Huipil`, `Blusa`, `Corte` | `Huipil` |
| Departamento | Se elige de la lista (con tildes) | `Sololá` |
| Descripción | Que no repita el nombre: origen, técnica, colores, ocasión | — |
| Precio y costo | Internos: **no** se muestran al público | `3500` |

---

## 7. Contenido que el equipo debe revisar

Estos textos y datos se escribieron o corrigieron con la información disponible. **Alguien que conozca los productos debe confirmarlos.**

- [ ] **Descripciones de los 42 productos** (se editan en `/admin`).
- [ ] **“San Lucas” (#8 y #12)**: están en el departamento *Guatemala*. ¿Es San Lucas Sacatepéquez, San Lucas Tolimán u otro?
- [ ] **“Sacatepéquez” (#26)** y **“San Pedro” (#36)**: el municipio está incompleto.
- [ ] **Precios que parecen inconsistentes** (no se publican, pero se usan en el inventario):
  - #1 “Traje de Patzún” completo a **Q350**, mientras varias blusas cuestan Q3,500.
  - Blusas de Patzún entre **Q1,900 y Q3,500**; las de San Lucas Tolimán a **Q900**.
- [ ] **Privacidad, Términos y Sostenibilidad**: textos base. Confirmar formas de pago, cambios y devoluciones, envíos y el trabajo con artesanas.
- [ ] **Preguntas frecuentes** de la web (`contacto.html`) y de la app (`contacto.js`).
- [ ] **“Nuestra historia” y “Sobre nosotros”**: texto general. Cuenten su historia real en `nosotros.html` **y** `mobile/src/app/nosotros.js`.

---

## 8. Decisiones del equipo

Se evaluaron y **no se van a implementar** (octubre de 2026):

- **No se muestran precios.** Se mantiene “Consulta precio y disponibilidad” por WhatsApp.
- **No hay carrito ni pedidos en línea.** Las ventas se coordinan por WhatsApp y se registran en el inventario.
- **No se comprimen ni convierten las imágenes.**
- **La app no se publica en Google Play.** Se distribuye como APK.
- **Oracle y FastAPI se reemplazaron por Supabase.**
