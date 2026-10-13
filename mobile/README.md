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

La app **no tiene un catálogo propio**: usa el mismo de la web (`frontend/public/js/producto.js`).

1. Al abrir, muestra la **copia incluida** en `src/datos/productos.json`, así funciona aunque no haya internet.
2. Luego descarga la versión del servidor: `http://<servidor>/data/productos.json`. Ese archivo lo genera Docker al construir la web.
3. Las fotos se cargan desde `http://<servidor>/img/...`.

Para actualizar la copia incluida después de cambiar `producto.js`:

```bash
npm run sync:catalogo
```

Cuando el API tenga los productos, solo hay que cambiar `URL_CATALOGO` en `src/datos/CatalogoContext.js`.

## Configuración

Todo está en **`src/config.js`**:

| Dato | Para qué sirve |
|---|---|
| `servidor` | Dirección de la web publicada (catálogo y fotos). Hoy: `http://163.192.133.68` |
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
    ├── datos/               # Catálogo (copia local + descarga del servidor)
    ├── utils/               # Búsqueda sin tildes, colores, etc.
    ├── config.js            # Servidor, WhatsApp y redes
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

- [ ] **HTTPS:** la app permite tráfico `http://` (`usesCleartextTraffic` en `app.json`) porque el servidor aún no tiene certificado. Cuando haya dominio con HTTPS, cambiar `servidor` en `src/config.js` y quitar ese permiso.
- [ ] **Publicar `data/productos.json` en el servidor:** reconstruir la web con el `Dockerfile` actualizado. Mientras tanto, la app usa la copia incluida.
- [ ] Conectar al API cuando la base de datos tenga los productos.
- [ ] Probar en varios celulares Android, con pantallas pequeñas y grandes.
- [ ] Crear la cuenta de Google Play y preparar la ficha de la tienda: capturas, descripción y política de privacidad (se puede usar `privacidad.html` de la web).
