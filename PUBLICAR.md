# Guía de publicación — RaícesGT

Cómo poner la web en internet con dominio propio y HTTPS, cómo funcionan las vistas previas al compartir (Open Graph) y cómo publicar la app en Google Play.

> Esto es para **más adelante**. Antes hay que terminar la configuración de Supabase ([`supabase/README.md`](supabase/README.md)).

---

## 1. Dominio

### Recomendación

| Opción | Disponible* | Comentario |
|---|---|---|
| `raicesgt.com` | ❌ ya registrado por otra persona | — |
| **`raicesdeguatemala.com`** | ✅ | Claro, fácil de dictar por teléfono, coincide con el título de la web. **Recomendado.** |
| `tiendaraicesgt.com` | ✅ | Mantiene la marca “RaícesGT”. |
| `textilesraicesgt.com` | ✅ | Deja claro qué venden. |
| `raicesgt.shop` / `raicesgt.store` | ✅ | Más cortos, pero las terminaciones nuevas generan menos confianza que `.com`. |
| `raicesgt.com.gt` | ? | Opcional para proteger la marca en Guatemala. Se registra en el Registro .GT (UVG) y suele costar más que un `.com`. |

\* Consultado el 16/10/2026 en los registros públicos (RDAP). La disponibilidad puede cambiar: confírmenla al comprar.

**Dónde comprarlo:** en **Cloudflare Registrar**, que vende al precio de costo, sin recargos al renovar y con privacidad WHOIS incluida. Encaja con el hosting recomendado abajo. Namecheap o Porkbun también son buenas opciones.

> Un `.com` cuesta alrededor de USD 10–15 al año. Activen la **renovación automática**: si el dominio vence, cualquiera puede comprarlo.

## 2. Hosting y HTTPS

### Recomendación: Cloudflare Pages (gratis)

La web es estática y la base de datos ya está en Supabase, así que **no hace falta un servidor propio**.

- **Gratis**, rápido en Guatemala y en todo el mundo (CDN).
- **HTTPS automático**: el certificado se crea y se renueva solo.
- **Se publica solo** cada vez que suben cambios a GitHub.

**Pasos:**

1. Cuenta gratis en [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages → Create → Pages → Connect to Git** → elijan el repositorio.
2. Configuración de build:

   | Campo | Valor |
   |---|---|
   | Framework preset | None |
   | Build command | `cd frontend && npm ci && npm run build` |
   | Build output directory | `frontend/public` |

3. **Custom domains → Set up a domain**: escriban su dominio. Si lo compraron en Cloudflare, los DNS se configuran solos.
4. En **SSL/TLS** del dominio: modo **Full (strict)** y activen **Always Use HTTPS**.

> **Alternativas:** Netlify o Vercel funcionan igual (gratis, HTTPS automático). Si prefieren el servidor del equipo con Docker, necesitan configurar el certificado con Let’s Encrypt (por ejemplo con Caddy o Certbot). Es más trabajo y más mantenimiento.

### Después de tener dominio, cambiar en 3 lugares

| Archivo | Qué cambiar |
|---|---|
| `frontend/sitio.json` | `"url": "https://su-dominio.com"` y luego `npm run build:og` |
| `mobile/src/config.js` | `servidor: "https://su-dominio.com"` (enlaces de “Compartir” de la app) |
| Supabase → Authentication → URL Configuration | **Site URL**: `https://su-dominio.com` |

## 3. Vista previa al compartir (Open Graph)

Ya está implementado. Cada página tiene las etiquetas `og:*`, así que al pegar un enlace en WhatsApp, Facebook o Instagram aparece una tarjeta con **imagen, título y descripción**.

- La imagen es [`frontend/public/img/compartir.jpg`](frontend/public/img/compartir.jpg) (1200×630).
- Las etiquetas se generan con `npm run build:og` dentro de `frontend/`, a partir del `<title>` y la descripción de cada página. La configuración está en `frontend/sitio.json`.

**Mientras no haya dominio:** la imagen se toma de Supabase. **Suban `compartir.jpg` una vez** al bucket `catalogo`:
Supabase → **Storage → catalogo → Upload file** → `frontend/public/img/compartir.jpg`.

**Probar la vista previa** (cuando el sitio esté publicado):
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/): pega el enlace y pulsa “Scrape again” si cambiaron algo.
- WhatsApp guarda la vista previa un tiempo: para probar cambios, agreguen `?v=2` al final del enlace.

**Siguiente mejora (opcional):** que cada producto muestre **su propia foto** al compartirlo. WhatsApp y Facebook no ejecutan JavaScript, así que hay que agregar las etiquetas en el servidor. Con Cloudflare Pages se hace con una *Pages Function* que lee el producto de Supabase e inserta sus etiquetas en `producto.html`.

## 4. Google Play

### 4.1 Cuenta de desarrollador

- Pago único de **USD 25** en [play.google.com/console](https://play.google.com/console).
- **Tipo de cuenta:**
  - **Organización (recomendada para una S.A.):** pide un **número D-U-N-S** de la empresa (gratis, tarda unos días). Publican directamente.
  - **Personal:** Google exige una **prueba cerrada con al menos 12 personas durante 14 días seguidos** antes de publicar al público. Así era la regla para cuentas personales nuevas en 2025; confírmenla al registrarse.
- Google verifica la identidad: tengan a mano DPI o pasaporte, o los documentos de la empresa.

### 4.2 Lo que pide la ficha de la tienda

| Requisito | Estado |
|---|---|
| Ícono 512×512 | ✅ [`mobile/assets/play/icono-google-play.png`](mobile/assets/play/icono-google-play.png) |
| Imagen destacada 1024×500 | ✅ [`mobile/assets/play/destacada-google-play.png`](mobile/assets/play/destacada-google-play.png) |
| Capturas de pantalla del celular (mínimo 2, ideal 4–8) | ⬜ Tómenlas desde la app: Inicio, Colección, Detalle, Nosotros |
| Descripción corta (máx. 80 caracteres) | Borrador abajo |
| Descripción completa (máx. 4000) | Borrador abajo |
| **URL de política de privacidad** | ⬜ Necesita el dominio: `https://su-dominio.com/privacidad.html` |
| Formulario **Seguridad de los datos** | ⬜ Ver respuestas sugeridas abajo |
| Clasificación de contenido (cuestionario) | ⬜ Responder: sin violencia, sin contenido sensible |
| Público objetivo | ⬜ Mayores de 18 o 13+ (no es una app para niños) |
| Anuncios | No contiene anuncios |
| Categoría | Compras |

**Descripción corta (borrador):**
> Trajes típicos, huipiles y cortes de Guatemala. Consulta por WhatsApp.

**Descripción completa (borrador):**
> Descubre la riqueza textil de Guatemala en tu celular. En RaícesGT encontrarás trajes típicos, huipiles, blusas bordadas y cortes de diferentes municipios y departamentos del país.
>
> • Explora la colección por departamento, categoría o color.
> • Mira cada pieza en detalle: origen, colores y descripción.
> • Consulta precio, medidas y disponibilidad directamente por WhatsApp.
> • Comparte tus piezas favoritas con familia y amigos.
>
> Cada textil guarda técnicas, símbolos y colores que pasan de generación en generación. Nuestra misión es acercar esa tradición a nuevas generaciones y valorar el trabajo artesanal que hay detrás de cada pieza.

**Seguridad de los datos (respuestas sugeridas, verifíquenlas):**
- ¿La app recopila datos de los usuarios? **No.** La app solo muestra el catálogo; las consultas se hacen en WhatsApp, que es otra app.
- ¿Comparte datos con terceros? **No.**
- ¿Los datos se cifran en tránsito? **Sí** (HTTPS con Supabase).

### 4.3 Generar y subir la app

```bash
cd mobile
npx eas-cli@latest login
npx eas-cli@latest build:configure                       # crea eas.json (solo la primera vez)
npx eas-cli@latest build -p android --profile production # genera el .aab para Google Play
```

1. En Play Console → **Crear app** → nombre “RaícesGT”, idioma español, app gratuita.
2. Suban el `.aab` primero a **Prueba interna**, pruébenlo y luego pásenlo a **Producción**. Si la cuenta es personal, antes va la prueba cerrada de 14 días.
3. Activen **Firma de apps de Google Play** (opción por defecto).

> El nombre del paquete **`com.raicesgt.app`** (en `mobile/app.json`) **no se puede cambiar** después de publicar. Si quieren otro, cámbienlo antes de la primera subida.

Para cada actualización: suban `"version"` en `mobile/app.json` (ej. `1.0.1`) y vuelvan a ejecutar el build. EAS maneja el número interno de versión.

## 5. Orden recomendado

1. Terminar Supabase (SQL, administrador, stock y costo reales).
2. Subir `compartir.jpg` al bucket `catalogo`.
3. Comprar el dominio y publicar la web en Cloudflare Pages.
4. Cambiar el dominio en los 3 lugares de la sección 2 y ejecutar `npm run build:og`.
5. Probar las vistas previas con el Facebook Sharing Debugger.
6. Crear la cuenta de Google Play, preparar la ficha (la URL de privacidad ya existe) y subir la app.
7. Más adelante: `sitemap.xml`, `robots.txt` y Google Search Console.
