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
| `servidor` | Dirección de la web, para los enlaces de “Compartir” |
| `whatsapp` | Número con código de país, sin espacios |
| `redes` | Facebook, Instagram, TikTok (las vacías no se muestran) |

Los colores están en `src/tema.js` y son los mismos de la web.

## Estructura

```
mobile/
├── app.json                 # Nombre, ícono, paquete de Android (com.raicesgt.app), permisos
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

## Generar el APK y publicar en Google Play

Se usa **EAS Build**, que compila en la nube; no hace falta Android Studio.

```bash
npm install -g eas-cli      # o usa: npx eas-cli@latest <comando>
eas login                   # cuenta gratuita en expo.dev
eas build:configure         # crea eas.json (solo la primera vez)

# APK para instalar directo en celulares del equipo
eas build -p android --profile preview

# AAB para subir a Google Play
eas build -p android --profile production
```

Para el APK de prueba, en `eas.json` el perfil `preview` debe tener `"android": { "buildType": "apk" }`.

Publicar en Google Play requiere una **cuenta de desarrollador**, con un pago único de USD 25.

## Pendientes de la app

- [ ] Cuando la web tenga dominio, cambiar `servidor` en `src/config.js` para que los enlaces de “Compartir” apunten ahí.
- [ ] Probar en varios celulares Android, con pantallas pequeñas y grandes.
- [ ] Crear la cuenta de Google Play y preparar la ficha de la tienda: capturas, descripción y política de privacidad (se puede usar `privacidad.html` de la web).
