# RaícesGT — App Android

App móvil del catálogo RaícesGT, hecha con **React Native + Expo** (SDK 57) y **Expo Router**. Tiene las mismas funciones que la web: catálogo con buscador, filtros, vista en columnas o lista, detalle de cada producto, consultas por WhatsApp y redes sociales.

## Cómo probarla en tu celular (lo más rápido)

1. Instala **Expo Go** desde Google Play en tu celular Android.
2. En la computadora, dentro de esta carpeta:

   ```bash
   cd mobile
   npm install        # solo la primera vez
   npx expo start
   ```

3. Escanea con Expo Go el **código QR** que aparece en la terminal.

> El celular y la computadora deben estar en la **misma red Wi-Fi**. Si no conecta, usa `npx expo start --tunnel`.

Cada vez que guardes un archivo, la app se actualiza sola en el celular.

> **¿Error “la ejecución de scripts está deshabilitada” en PowerShell?** Es una protección de Windows. Usa `npx.cmd expo start` o permite los scripts locales una sola vez con:
> `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`

### Probar en la computadora

- **Navegador:** `npx expo start --web` (útil para revisar diseño; no es la versión final).
- **Emulador de Android:** instala Android Studio, crea un emulador y pulsa `a` en la terminal de `npx expo start`.

## De dónde salen los productos

La app usa la **misma base de datos que la web: Supabase** (tabla `product`). Los productos se editan desde el panel `admin.html` de la web y la app los ve al abrirse o al deslizar hacia abajo en Colección.

1. Al abrir, muestra la **copia incluida** en `src/datos/productos.json`, así funciona aunque no haya internet.
2. Luego descarga los productos visibles de Supabase. El precio y el costo no se descargan.
3. Las fotos se cargan del bucket público `catalogo` de Supabase (HTTPS).

Para actualizar la copia incluida, que se genera desde la copia de respaldo de la web, `frontend/public/js/producto.js`:

```bash
npm run sync:catalogo
```

## Configuración

Todo está en **`src/config.js`**:

| Dato | Para qué sirve |
|---|---|
| `supabase` | Dirección del proyecto y clave *publishable* (pública por diseño) |
| `servidor` | Dirección de la web, para los enlaces de “Compartir” (cámbiala cuando tengan dominio; ver `PUBLICAR.md`) |
| `whatsapp` | Número con código de país, sin espacios |
| `redes` | Facebook, Instagram, TikTok (las vacías no se muestran) |

Los colores están en `src/tema.js` y son los mismos de la web.

## Estructura

```
mobile/
├── app.json                 # Nombre, ícono, paquete de Android (com.raicesgt.app), versión
├── eas.json                 # Perfil "apk" para generar el APK con EAS Build
├── assets/                  # Íconos y pantalla de carga
└── src/
    ├── app/                 # Pantallas (cada archivo es una ruta de Expo Router)
    │   ├── _layout.js       # Cabecera, barra de estado y carga del catálogo
    │   ├── (tabs)/          # Pestañas inferiores
    │   │   ├── index.js     # Inicio
    │   │   ├── catalogo.js  # Colección con buscador y filtros
    │   │   └── contacto.js  # WhatsApp, redes y preguntas frecuentes
    │   └── producto/[id].js # Detalle de un producto
    ├── components/          # Tarjeta de producto, cabecera, selector de filtros...
    ├── datos/               # Catálogo (copia local + descarga de Supabase)
    ├── utils/               # Búsqueda sin tildes, colores, etc.
    ├── config.js            # Supabase, WhatsApp y redes
    └── tema.js              # Colores
```

> Agrega librerías siempre con `npx expo install <paquete>`, no con `npm install`, para que la versión sea compatible con la SDK.

## Generar el APK

La app se distribuye como **APK**, sin Google Play. Se compila gratis en la nube con EAS Build, sin necesidad de Android Studio. `eas.json` ya tiene listo el perfil `apk`.

```bash
cd mobile
npx eas-cli@latest login      # cuenta gratuita en expo.dev
npm run build:apk             # = eas build -p android --profile apk
```

- La primera vez pide crear el proyecto en Expo (responde **Y**) y generar la firma de Android (deja que EAS la genere).
- Al terminar aparece un **enlace y un código QR** para descargar el `.apk`. En el plan gratuito puede tardar desde minutos hasta más de una hora en horas pico.
- **Para instalarlo:** abre el enlace en el celular, permite *Instalar apps de fuentes desconocidas* y, si aparece Play Protect, elige **Instalar de todas formas**.
- **Nueva versión:** sube `version` y `versionCode` en `app.json` y vuelve a ejecutar `npm run build:apk`. Los cambios de **productos** no necesitan un APK nuevo: llegan solos desde Supabase.

Guía completa: [`PUBLICAR.md`](../PUBLICAR.md), sección 4.

> En `assets/play/` quedaron un ícono de 512×512 y una imagen destacada, por si algún día deciden publicar en Google Play.

## Pendientes de la app

- [ ] Cuando la web esté publicada en Cloudflare Pages, cambiar `servidor` en `src/config.js` (ej. `https://raicesgt.pages.dev`) para que los enlaces de “Compartir” apunten ahí.
- [ ] Generar el APK e instalarlo en los celulares del equipo.
- [ ] Probar en varios celulares Android, con pantallas pequeñas y grandes.
