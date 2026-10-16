// ============================================================================
// CATÁLOGO COMPARTIDO POR TODAS LAS PANTALLAS
// 1. Arranca con la copia incluida en la app (src/datos/productos.json),
//    así funciona aunque no haya internet.
// 2. Luego descarga los productos de Supabase (tabla `product`), la misma
//    base de datos que usa la web y que se edita desde admin.html.
// ============================================================================
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { SITIO } from "../config";
import copiaLocal from "./productos.json";

// Columnas públicas (el precio y el costo no se publican)
const COLUMNAS = "id,nombre,descripcion,categoria,municipio,departamento,color,imagen";
const URL_CATALOGO = `${SITIO.supabase.url}/rest/v1/product?select=${COLUMNAS}&status=is.true&order=id`;
const TIEMPO_LIMITE_MS = 8000;

const CatalogoContext = createContext(null);

function normalizar(p) {
  return {
    id: Number(p.id),
    nombre: p.nombre || "",
    descripcion: p.descripcion || "",
    categoria: p.categoria || "",
    municipio: p.municipio || "",
    departamento: p.departamento || "",
    color: p.color || "",
    imagen: p.imagen || "",
  };
}

export function CatalogoProvider({ children }) {
  const [productos, setProductos] = useState(() => copiaLocal.productos.map(normalizar));
  const [origen, setOrigen] = useState("local"); // "local" | "servidor"
  const [actualizando, setActualizando] = useState(false);

  const actualizar = useCallback(async () => {
    setActualizando(true);
    const control = new AbortController();
    const temporizador = setTimeout(() => control.abort(), TIEMPO_LIMITE_MS);
    try {
      const respuesta = await fetch(URL_CATALOGO, {
        headers: { apikey: SITIO.supabase.clave },
        signal: control.signal,
      });
      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
      const filas = await respuesta.json();
      if (Array.isArray(filas) && filas.length > 0) {
        setProductos(filas.map(normalizar));
        setOrigen("servidor");
      }
    } catch (e) {
      // Sin conexión o Supabase no responde: se queda con la copia local
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
