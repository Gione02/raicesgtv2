import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";

import BotonWhatsApp from "../../components/BotonWhatsApp";
import TarjetaProducto from "../../components/TarjetaProducto";
import { consultarProducto, urlImagen, urlProducto } from "../../config";
import { useCatalogo } from "../../datos/CatalogoContext";
import { colorDepartamento } from "../../datos/departamentos";
import { colores } from "../../tema";
import { normalizar } from "../../utils/texto";

export default function DetalleProducto() {
  const { id } = useLocalSearchParams();
  const { productos, buscarPorId } = useCatalogo();
  const producto = buscarPorId(id);

  // Primero los del mismo departamento, luego los de la misma categoría
  const relacionados = useMemo(() => {
    if (!producto) return [];
    const puntaje = (p) => (p.departamento === producto.departamento ? 2 : 0) + (p.categoria === producto.categoria ? 1 : 0);
    return productos
      .filter((p) => p.id !== producto.id && puntaje(p) > 0)
      .sort((a, b) => puntaje(b) - puntaje(a) || b.id - a.id)
      .slice(0, 4);
  }, [productos, producto]);

  if (!producto) {
    return (
      <View style={estilos.noEncontrado}>
        <Stack.Screen options={{ title: "No encontrado" }} />
        <Ionicons name="alert-circle-outline" size={40} color={colores.contorno} />
        <Text style={estilos.tituloNoEncontrado}>No encontramos este producto</Text>
        <Text style={estilos.textoSuave}>Puede que ya no esté disponible.</Text>
        <Pressable style={estilos.botonSecundario} onPress={() => router.replace("/catalogo")}>
          <Text style={estilos.textoBotonSecundario}>Ver la colección</Text>
        </Pressable>
      </View>
    );
  }

  // Color del departamento (igual que en la web): franja bajo la foto y etiqueta
  const colorDepto = colorDepartamento(producto.departamento);

  const compartir = () =>
    Share.share({
      message: `${producto.nombre} - RaícesGT\n${urlProducto(producto.id)}`,
      title: producto.nombre,
    });

  const DATOS = [
    ["Origen", `${producto.municipio}, ${producto.departamento}`],
    ["Color", producto.color],
    ["Código", `#${producto.id}`],
    ["Precio", "Consulta precio y disponibilidad"],
  ];

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
      <Stack.Screen options={{ title: producto.categoria }} />
      <Image source={{ uri: urlImagen(producto.imagen) }} style={estilos.foto} contentFit="cover" transition={200} />
      <View style={[estilos.franjaDepto, { backgroundColor: colorDepto }]} />

      <View style={estilos.cuerpo}>
        <View style={estilos.etiquetas}>
          <Pressable
            style={[estilos.etiqueta, { backgroundColor: colores.terciarioFondo }]}
            onPress={() => router.push({ pathname: "/catalogo", params: { categoria: normalizar(producto.categoria), departamento: "" } })}
          >
            <Text style={[estilos.textoEtiqueta, { color: colores.terciario }]}>{producto.categoria.toUpperCase()}</Text>
          </Pressable>
          <Pressable
            style={[estilos.etiqueta, { backgroundColor: colorDepto }]}
            onPress={() => router.push({ pathname: "/catalogo", params: { departamento: normalizar(producto.departamento), categoria: "" } })}
          >
            <Text style={[estilos.textoEtiqueta, { color: "#fff" }]}>{producto.departamento}</Text>
          </Pressable>
        </View>

        <Text style={estilos.nombre}>{producto.nombre}</Text>
        <Text style={estilos.descripcion}>{producto.descripcion}</Text>

        <View style={estilos.tabla}>
          {DATOS.map(([etiqueta, valor]) => (
            <View key={etiqueta} style={estilos.filaTabla}>
              <Text style={estilos.etiquetaTabla}>{etiqueta}</Text>
              <Text style={estilos.valorTabla}>{valor}</Text>
            </View>
          ))}
        </View>

        <BotonWhatsApp texto="Consultar por WhatsApp" onPress={() => consultarProducto(producto)} />
        <Pressable style={({ pressed }) => [estilos.botonCompartir, pressed && { opacity: 0.8 }]} onPress={compartir}>
          <Ionicons name="share-social-outline" size={20} color={colores.texto} />
          <Text style={estilos.textoCompartir}>Compartir</Text>
        </Pressable>
      </View>

      {relacionados.length ? (
        <View style={estilos.seccion}>
          <Text style={estilos.tituloSeccion}>También te puede gustar</Text>
          <View style={estilos.cuadricula}>
            {relacionados.map((p) => (
              <View key={p.id} style={estilos.celda}>
                <TarjetaProducto producto={p} />
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  foto: { width: "100%", aspectRatio: 4 / 5, backgroundColor: colores.fondoSuave },
  franjaDepto: { height: 6 },
  cuerpo: { padding: 20 },
  etiquetas: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  etiqueta: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  textoEtiqueta: { fontSize: 12, fontWeight: "700" },
  nombre: { fontSize: 28, lineHeight: 32, fontWeight: "900", color: colores.texto, letterSpacing: -0.8 },
  descripcion: { fontSize: 16, lineHeight: 24, color: colores.textoSuave, marginTop: 10 },
  tabla: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: colores.borde, paddingVertical: 12, marginVertical: 20, gap: 10 },
  filaTabla: { flexDirection: "row", gap: 16 },
  etiquetaTabla: { width: 64, fontWeight: "700", color: colores.texto },
  valorTabla: { flex: 1, color: colores.textoSuave },
  botonCompartir: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
    paddingVertical: 13,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: colores.superficie,
  },
  textoCompartir: { fontWeight: "700", fontSize: 15, color: colores.texto },
  seccion: { paddingHorizontal: 16, paddingTop: 12 },
  tituloSeccion: { fontSize: 20, fontWeight: "800", color: colores.texto, marginBottom: 12 },
  cuadricula: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -6 },
  celda: { width: "50%", padding: 6 },
  noEncontrado: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 6 },
  tituloNoEncontrado: { fontSize: 18, fontWeight: "800", color: colores.texto, marginTop: 6 },
  textoSuave: { color: colores.textoSuave },
  botonSecundario: { marginTop: 14, backgroundColor: colores.primario, paddingHorizontal: 20, paddingVertical: 11, borderRadius: 999 },
  textoBotonSecundario: { color: "#fff", fontWeight: "700" },
});
