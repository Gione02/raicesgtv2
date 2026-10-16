# Guía de publicación — RaícesGT

Cómo poner la web en internet **gratis** con HTTPS, cómo activar la vista previa al compartir (Open Graph) y cómo generar el **APK** de la app.

> Es un proyecto universitario: todo lo de esta guía se puede hacer con **USD 0**. Lo único opcional que cuesta es un dominio propio.

---

## 1. Cuánto cuesta

| Servicio | Para qué | Plan | Costo |
|---|---|---|---|
| **Cloudflare Pages** | Publicar la web con HTTPS | Gratis | **USD 0** |
| **Supabase** | Base de datos, fotos y login | Gratis | **USD 0** |
| **Expo (EAS Build)** | Generar el APK en la nube | Gratis | **USD 0** |
| Dominio propio (`.com`) | Dirección más bonita | *Opcional* | ~USD 10–15 al año |
| Google Play | Publicar en la tienda | No se usará | — |

### Límites de los planes gratuitos (consultados en octubre de 2026)

- **Cloudflare Pages:** 500 publicaciones al mes, hasta 20 000 archivos y 25 MB por archivo. Incluye la dirección `https://<nombre>.pages.dev` con HTTPS. Para este proyecto, el límite no se alcanza.
- **Supabase:** 500 MB de base de datos, 1 GB de fotos, 5 GB de transferencia al mes y 2 proyectos activos.
  ⚠️ **Los proyectos gratuitos se pausan tras 1 semana sin actividad.** Si nadie abre la web ni la app durante una semana, Supabase pausa el proyecto. Se reactiva desde el panel de Supabase (**Restore project**). Mientras está pausado, la web y la app muestran la copia de respaldo con los 42 productos, así que no se ven vacías. **Revisen que esté activo antes de cada presentación.**
- **Expo:** hasta 15 compilaciones de Android en el plan gratuito, en la cola de baja prioridad. En horas pico la espera puede pasar de 90 minutos.

---

## 2. La web publicada: `https://raicesgt.pages.dev`

✅ **Publicada el 16/10/2026** en Cloudflare Pages, gratis y con HTTPS. La cuenta de Cloudflare es la de `brayancubur@gmail.com` y el proyecto se llama `raicesgt`.

- Las páginas se sirven **sin `.html`**: `/productos`, `/producto?id=27`, `/nosotros`… Los enlaces antiguos con `.html` redirigen solos.
- El panel está en `https://raicesgt.pages.dev/admin`.
- El catálogo se lee de Supabase, así que los cambios hechos en el panel **no** requieren volver a publicar.

### Cómo actualizar la web

Solo hace falta cuando se cambia el **código o el diseño**: HTML, CSS, JS o imágenes de `frontend/`.

```bash
cd frontend
npm run publicar
```

Esto compila el CSS, regenera Open Graph y sube los archivos a Cloudflare en 1–2 minutos. Después, sube también el código a GitHub (`git push`).

- La primera vez en otra computadora, pedirá iniciar sesión en Cloudflare: `npx wrangler@4.147.0 login`. Se abre el navegador; pulsa **Allow**.
- El proyecto se publica desde la computadora con Wrangler (*Direct Upload*). Por eso **no** se publica solo con cada `git push`; hay que ejecutar `npm run publicar`.

### (Opcional) Dominio propio

`raicesgt.com` ya está ocupado. Opciones libres al 16/10/2026: `raicesdeguatemala.com`, `tiendaraicesgt.com` y `textilesraicesgt.com` (~USD 10–15 al año). Para usarlo:
1. Cloudflare → **Workers & Pages → raicesgt → Custom domains** → agregar el dominio.
2. Cambiar `"url"` en `frontend/sitio.json` y `servidor` en `mobile/src/config.js`.
3. `npm run publicar`.

---

## 3. Open Graph: vista previa al compartir

✅ **Activo.** Todas las páginas públicas tienen las etiquetas `og:*` con la dirección publicada y la imagen `https://raicesgt.pages.dev/img/compartir.jpg` (1200×630). Al pegar un enlace en WhatsApp, Facebook o Instagram aparece una tarjeta con imagen, título y descripción.

**Cómo funciona:** `frontend/sitio.json` guarda la dirección (`"url": "https://raicesgt.pages.dev"`). `npm run build:og`, que también corre dentro de `npm run publicar`, escribe las etiquetas en cada página usando su `<title>` y su descripción. Si cambian un título o una descripción, solo vuelvan a publicar.

### Probar la vista previa
1. Abre [opengraph.xyz](https://www.opengraph.xyz) y pega `https://raicesgt.pages.dev`. Debe aparecer la tarjeta con la imagen.
2. También sirve el [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/), que pide iniciar sesión en Facebook. Pulsa **Scrape Again** si cambiaron algo.
3. En **WhatsApp**, envíate el enlace en un chat. WhatsApp guarda las vistas previas un tiempo; para ver un cambio reciente, agrega `?v=2` al final.
4. Prueba también `/productos` y `/nosotros`: cada una muestra su propio título y descripción.

### Siguiente mejora (opcional)
Que al compartir **un producto** aparezca **su propia foto**. WhatsApp no ejecuta JavaScript, así que se necesita una *Pages Function* de Cloudflare (también gratis) que lea el producto de Supabase y escriba sus etiquetas en `/producto`.

---

## 4. App Android: solo APK (sin Google Play)

### ¿La app se conecta sola?
**Sí, ya está conectada.** La app lee los productos y las fotos **directo de Supabase** por HTTPS, igual que la web. Lo comprobamos el 16/10/2026: recibe los 42 productos.
- Funciona con datos móviles o Wi-Fi, desde cualquier lugar. No necesita que la web ni ningún servidor estén encendidos.
- Lo que se cambie en `admin.html` aparece en la app al abrirla o al **deslizar hacia abajo** en Colección.
- Sin internet, muestra la copia incluida de los 42 productos.
- Para comprobarlo: en la pestaña **Contacto**, al final, debe decir **“actualizado desde el servidor”**.

### Generar el APK (gratis)
1. Crea una cuenta gratis en [expo.dev](https://expo.dev/signup).
2. En la terminal:

   ```bash
   cd mobile
   npx eas-cli@latest login
   npm run build:apk
   ```

   La primera vez pregunta si quieres crear el proyecto en Expo: responde **Y**. Si pregunta por la *keystore* (la firma de Android), deja que **EAS la genere**.
3. Espera a que termine. En el plan gratuito puede tardar desde unos minutos hasta más de una hora en horas pico. Al final verás un **enlace y un código QR** para descargar el `.apk`.

### Instalar el APK en un celular
1. Abre el enlace o escanea el QR desde el celular Android y descarga el archivo.
2. Ábrelo. Android pedirá permitir **“Instalar apps de fuentes desconocidas”** para el navegador o el administrador de archivos; actívalo solo para esa instalación.
3. Si aparece una advertencia de **Play Protect** (“App no verificada”), elige **Más detalles → Instalar de todas formas**. Es normal en apps que no vienen de Google Play.

Para compartirla con el equipo o en la presentación, basta con enviar el enlace de descarga o el archivo `.apk` por WhatsApp o Drive.

### Nueva versión del APK
Cuando cambien algo **en el código de la app**:
1. En `mobile/app.json` suban `"version"` (ej. `1.0.1`) y `"versionCode"` (ej. `2`).
2. Ejecuten de nuevo `npm run build:apk` e instalen el APK nuevo encima del anterior.

> Los cambios de **productos** no necesitan un APK nuevo: llegan solos desde Supabase.

---

## 5. Estado y siguientes pasos

1. ✅ Supabase configurado: 42 productos, inventario y permisos.
2. ✅ Web publicada en `https://raicesgt.pages.dev` con HTTPS.
3. ✅ Open Graph activo con la dirección publicada.
4. ✅ La app apunta a la web publicada para el botón **Compartir**.
5. ⬜ Probar la vista previa en WhatsApp u opengraph.xyz (sección 3).
6. ⬜ Generar el APK e instalarlo en los celulares (sección 4).
7. ⬜ Registrar el stock y el costo reales desde `/admin`.
8. ⬜ Antes de cada presentación, abrir la web para confirmar que Supabase no esté pausado.
