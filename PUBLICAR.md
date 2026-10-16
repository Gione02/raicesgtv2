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

## 2. Publicar la web en Cloudflare Pages (gratis, con HTTPS)

1. Crea una cuenta gratis en [dash.cloudflare.com](https://dash.cloudflare.com).
2. **Workers & Pages → Create → Pages → Connect to Git** y autoriza GitHub. Elige el repositorio **raicesgtv2**.
3. **Nombre del proyecto:** `raicesgt`. Será la dirección `https://raicesgt.pages.dev`; el 16/10/2026 estaba libre.
4. Configuración de build:

   | Campo | Valor |
   |---|---|
   | Production branch | `main` |
   | Framework preset | None |
   | Build command | `cd frontend && npm ci && npm run build` |
   | Build output directory | `frontend/public` |

5. **Save and Deploy**. En 1–2 minutos la web queda en `https://raicesgt.pages.dev`, **con HTTPS automático**.

Desde entonces, **cada vez que suban cambios a `main` en GitHub, Cloudflare publica la nueva versión sola**.

> Docker ya no es necesario para publicar. Sigue en el proyecto, como opción, para verla en la computadora o montarla en un servidor propio.

### Después de publicar, actualizar la dirección en la app

En `mobile/src/config.js` cambien:

```js
servidor: "https://raicesgt.pages.dev",
```

Así, el botón **Compartir** de la app envía enlaces a la web publicada.

### (Opcional) Dominio propio

Si algún día quieren uno, `raicesgt.com` ya está ocupado. Opciones libres al 16/10/2026: `raicesdeguatemala.com`, `tiendaraicesgt.com` y `textilesraicesgt.com`. Se compra en Cloudflare Registrar, se agrega en **Custom domains** del proyecto, y Cloudflare configura los DNS y el HTTPS solo. Luego hay que repetir los pasos de Open Graph con la nueva dirección.

---

## 3. Open Graph: vista previa al compartir, paso a paso

**Qué es:** cuando alguien pega el enlace de la web en WhatsApp, Facebook o Instagram, en lugar de un enlace suelto aparece una **tarjeta con imagen, título y descripción**.

**Lo que ya está hecho:**
- Todas las páginas públicas tienen las etiquetas `og:*`.
- La imagen [`frontend/public/img/compartir.jpg`](frontend/public/img/compartir.jpg) (1200×630) ya existe.
- El script `npm run build:og` genera las etiquetas a partir de `frontend/sitio.json`.
- Cloudflare ejecuta ese script en cada publicación, porque está dentro de `npm run build`.

**Lo que falta: decirle al sitio cuál es su dirección.** WhatsApp y Facebook necesitan direcciones completas (`https://…`).

### Paso 1. Publicar la web
Sigue la sección 2 hasta tener `https://raicesgt.pages.dev` funcionando.

### Paso 2. Poner la dirección en `frontend/sitio.json`
Abre el archivo y llena `"url"`:

```json
{
  "nombre": "RaícesGT",
  "url": "https://raicesgt.pages.dev",
  ...
}
```

Con la dirección puesta, la imagen se sirve desde la propia web. **Ya no hace falta subirla a Supabase.**

### Paso 3. Generar las etiquetas y subir el cambio
En la terminal:

```bash
cd frontend
npm run build:og
cd ..
git add frontend
git commit -m "Open Graph con la dirección publicada"
git push v2 mejoras-catalogo-y-diseno:main
```

`npm run build:og` actualiza las 8 páginas: agrega `og:url`, el enlace canónico y la imagen con la dirección completa. Cloudflare publica el cambio en 1–2 minutos.

### Paso 4. Probar
1. Abre [opengraph.xyz](https://www.opengraph.xyz) o el [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) y pega `https://raicesgt.pages.dev`. Debe aparecer la tarjeta con la imagen.
2. En **WhatsApp**, envíate el enlace en un chat. WhatsApp guarda las vistas previas un tiempo: si probaste antes del cambio, agrega `?v=2` al final del enlace.
3. Prueba también `https://raicesgt.pages.dev/productos.html` y `/nosotros.html`. Cada una muestra su propio título y descripción.

### Siguiente mejora (opcional)
Que al compartir **un producto** aparezca **su propia foto**. WhatsApp no ejecuta JavaScript, así que se necesita una *Pages Function* de Cloudflare (también gratis) que lea el producto de Supabase y escriba sus etiquetas en `producto.html`.

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

## 5. Orden recomendado

1. ✅ Configurar Supabase (SQL, administrador). **Hecho.**
2. Registrar el stock y el costo reales desde `admin.html`.
3. Publicar la web en Cloudflare Pages (sección 2).
4. Activar Open Graph con la dirección publicada (sección 3).
5. Cambiar `servidor` en `mobile/src/config.js` y generar el APK (sección 4).
6. Antes de la presentación: abrir la web una vez para confirmar que Supabase no está pausado.
