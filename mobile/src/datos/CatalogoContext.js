// ============================================================================
// CATÁLOGO COMPARTIDO POR TODAS LAS PANTALLAS
// 1. Arranca con la copia incluida en la app (src/datos/productos.json),
//    así funciona aunque no haya internet.
// 2. Luego descarga la versión del servidor (data/productos.json) y la usa
//    si está disponible.
// Cuando el API tenga los productos, solo hay que cambiar URL_CATALOGO.
// ============================================================================
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { SITIO } from "../config";
import copiaLocal from "./productos.json";

const URL_CATALOGO = `${SITIO.servidor}/data/productos.json`;
const TIEMPO_LIMITE_MS = 8000;

const CatalogoContext = createContext(null);

export function CatalogoProvider({ children }) {
  const [productos, setProductos] = useState(copiaLocal.productos);
  const [origen, setOrigen] = useState("local"); // "local" | "servidor"
  const [actualizando, setActualizando] = useState(false);

  const actualizar = useCallback(async () => {
    setActualizando(true);
    const control = new AbortController();
    const temporizador = setTimeout(() => control.abort(), TIEMPO_LIMITE_MS);
    try {
      const respuesta = await fetch(URL_CATALOGO, { signal: control.signal, cache: "no-store" });
      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
      const datos = await respuesta.json();
      if (Array.isArray(datos.productos) && datos.productos.length > 0) {
        setProductos(datos.productos);
        setOrigen("servidor");
      }
    } catch (e) {
      // Sin conexión o el servidor aún no publica el JSON: se queda con la copia local
    } finally {
      clearTimeout(temporizador);
      setActualizando(false);
    }
  }, []);

  useEffect(() => {
    actualizar();
  }, [actualizar]);

  const valor = useMemo(
    () => ({
      productos,
      origen,
      actualizando,
      actualizar,
      buscarPorId: (id) => productos.find((p) => p.id === Number(id)),
    }),
    [productos, origen, actualizando, actualizar]
  );

  return <CatalogoContext.Provider value={valor}>{children}</CatalogoContext.Provider>;
}

export function useCatalogo() {
  const contexto = useContext(CatalogoContext);
  if (!contexto) throw new Error("useCatalogo debe usarse dentro de <CatalogoProvider>");
  return contexto;
}
