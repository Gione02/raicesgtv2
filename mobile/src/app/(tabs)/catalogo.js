import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import SelectorFiltro from "../../components/SelectorFiltro";
import TarjetaProducto from "../../components/TarjetaProducto";
import { useCatalogo } from "../../datos/CatalogoContext";
import { colores } from "../../tema";
import { capitalizar, coloresDe, normalizar, opcionesUnicas } from "../../utils/texto";

const ORDENES = [
  { valor: "relevancia", texto: "Destacados" },
  { valor: "recientes", texto: "Más recientes" },
  { valor: "nombre-asc", texto: "Nombre (A–Z)" },
  { valor: "nombre-desc", texto: "Nombre (Z–A)" },
];

export default function Catalogo() {
  const { productos, actualizando, actualizar } = useCatalogo();
  const parametros = useLocalSearchParams();

  const [busqueda, setBusqueda] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [categoria, setCategoria] = useState("");
  const [color, setColor] = useState("");
  const [orden, setOrden] = useState("relevancia");
  const [vista, setVista] = useState("grid");

  // Filtros que llegan desde otra pantalla, ej. Inicio > "Sololá"
  useEffect(() => {
    if (parametros.departamento !== undefined) setDepartamento(normalizar(parametros.departamento));
    if (parametros.categoria !== undefined) setCategoria(normalizar(parametros.categoria));
  }, [parametros.departamento, parametros.categoria]);

  const opciones = useMemo(
    () => ({
      departamentos: opcionesUnicas(productos.map((p) => p.departamento)),
      categorias: opcionesUnicas(productos.map((p) => p.categoria)),
      colores: opcionesUnicas(productos.flatMap(coloresDe)).map((o) => ({ ...o, texto: capitalizar(o.texto) })),
    }),
    [productos]
  );

  const resultados = useMemo(() => {
    const texto = normalizar(busqueda);
    let lista = productos.filter((p) => {
      if (departamento && normalizar(p.departamento) !== departamento) return false;
      if (categoria && normalizar(p.categoria) !== categoria) return false;
      if (color && !coloresDe(p).includes(color)) return false;
      if (!texto) return true;
      return [p.nombre, p.municipio, p.departamento, p.categoria, p.color, p.descripcion].some((c) =>
        normalizar(c).includes(texto)
      );
    });
    if (orden === "recientes") lista = [...lista].sort((a, b) => b.id - a.id);
    if (orden === "nombre-asc") lista = [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    if (orden === "nombre-desc") lista = [...lista].sort((a, b) => b.nombre.localeCompare(a.nombre, "es"));
    return lista;
  }, [productos, busqueda, departamento, categoria, color, orden]);

  const hayFiltros = Boolean(busqueda || departamento || categoria || color);
  const limpiar = () => {
    setBusqueda("");
    setDepartamento("");
    setCategoria("");
    setColor("");
  };

  const cabecera = (
    <View style={estilos.cabecera}>
      <View style={estilos.buscador}>
        <Ionicons name="search" size={18} color={colores.primario} />
        <TextInput
          value={busqueda}
          onChangeText={setBusqueda}
          placeholder="Ej. Sololá, huipil, rojo..."
          placeholderTextColor={colores.contorno}
          style={estilos.entrada}
          returnKeyType="search"
          clearButtonMode="while-editing"
          accessibilityLabel="Buscar textiles"
        />
        {busqueda ? (
          <Pressable onPress={() => setBusqueda("")} hitSlop={10} accessibilityLabel="Borrar búsqueda">
            <Ionicons name="close-circle" size={18} color={colores.contorno} />
          </Pressable>
        ) : null}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilos.filtros}>
        <SelectorFiltro etiqueta="Departamento" textoTodos="Todos los departamentos" opciones={opciones.departamentos} valor={departamento} onCambiar={setDepartamento} />
        <SelectorFiltro etiqueta="Categoría" textoTodos="Todas las categorías" opciones={opciones.categorias} valor={categoria} onCambiar={setCategoria} />
        <SelectorFiltro etiqueta="Color" textoTodos="Todos los colores" opciones={opciones.colores} valor={color} onCambiar={setColor} />
        <SelectorFiltro etiqueta="Ordenar" opciones={ORDENES} valor={orden} onCambiar={setOrden} />
      </ScrollView>

      <View style={estilos.barra}>
        <View>
          <Text style={estilos.contador}>
            {resultados.length === 1 ? "1 textil encontrado" : `${resultados.length} textiles encontrados`}
          </Text>
          {hayFiltros ? (
            <Pressable onPress={limpiar} hitSlop={8}>
              <Text style={estilos.limpiar}>Limpiar filtros</Text>
            </Pressable>
          ) : null}
        </View>
        <View style={estilos.alternador} accessibilityRole="radiogroup">
          {[
            ["grid", "grid-outline", "Ver en columnas"],
            ["lista", "list-outline", "Ver en lista"],
          ].map(([valor, icono, etiqueta]) => (
            <Pressable
              key={valor}
              onPress={() => setVista(valor)}
              style={[estilos.botonVista, vista === valor && estilos.botonVistaActivo]}
              accessibilityRole="radio"
              accessibilityState={{ selected: vista === valor }}
              accessibilityLabel={etiqueta}
            >
              <Ionicons name={icono} size={18} color={vista === valor ? "#fff" : colores.textoSuave} />
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      key={vista}
      data={resultados}
      keyExtractor={(p) => String(p.id)}
      numColumns={vista === "grid" ? 2 : 1}
      ListHeaderComponent={cabecera}
      contentContainerStyle={estilos.lista}
      columnWrapperStyle={vista === "grid" ? estilos.fila : undefined}
      keyboardShouldPersistTaps="handled"
      refreshControl={<RefreshControl refreshing={actualizando} onRefresh={actualizar} colors={[colores.primario]} />}
      renderItem={({ item }) => (
        <View style={vista === "grid" ? estilos.celda : estilos.celdaLista}>
          <TarjetaProducto producto={item} vista={vista} />
        </View>
      )}
      ListEmptyComponent={
        <View style={estilos.vacio}>
          <Ionicons name="search-outline" size={36} color={colores.contorno} />
          <Text style={estilos.tituloVacio}>No encontramos resultados</Text>
          <Text style={estilos.textoVacio}>Prueba con otra palabra o quita algún filtro.</Text>
          <Pressable onPress={limpiar} style={estilos.botonVacio}>
            <Text style={estilos.textoBotonVacio}>Ver todo el catálogo</Text>
          </Pressable>
        </View>
      }
    />
  );
}

const estilos = StyleSheet.create({
  lista: { paddingHorizontal: 10, paddingBottom: 24 },
  cabecera: { paddingHorizontal: 6, paddingTop: 16 },
  buscador: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colores.superficie,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colores.borde,
    paddingHorizontal: 16,
  },
  entrada: { flex: 1, paddingVertical: 12, fontSize: 15, color: colores.texto },
  filtros: { gap: 8, paddingVertical: 14 },
  barra: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  contador: { fontSize: 13, color: colores.textoSuave },
  limpiar: { fontSize: 13, color: colores.secundario, fontWeight: "700", marginTop: 2 },
  alternador: {
    flexDirection: "row",
    backgroundColor: colores.fondoSuave,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colores.borde,
    padding: 3,
  },
  botonVista: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999 },
  botonVistaActivo: { backgroundColor: colores.primario },
  fila: { gap: 0 },
  celda: { width: "50%", padding: 6 },
  celdaLista: { paddingHorizontal: 6, paddingVertical: 6 },
  vacio: { alignItems: "center", padding: 32, gap: 6 },
  tituloVacio: { fontSize: 18, fontWeight: "800", color: colores.texto, marginTop: 6 },
  textoVacio: { color: colores.textoSuave, textAlign: "center" },
  botonVacio: { marginTop: 12, backgroundColor: colores.primario, paddingHorizontal: 20, paddingVertical: 11, borderRadius: 999 },
  textoBotonVacio: { color: "#fff", fontWeight: "700" },
});
