import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { urlImagen } from "../config";
import { colores, sombra } from "../tema";

// Tarjeta de producto. vista="grid" (dos columnas) o "lista" (foto a la izquierda)
export default function TarjetaProducto({ producto, vista = "grid", estilo }) {
  const enLista = vista === "lista";
  return (
    <Pressable
      onPress={() => router.push(`/producto/${producto.id}`)}
      style={({ pressed }) => [estilos.tarjeta, enLista && estilos.tarjetaLista, pressed && estilos.presionada, estilo]}
      accessibilityRole="button"
      accessibilityLabel={`Ver ${producto.nombre}`}
    >
      <Image
        source={{ uri: urlImagen(producto.imagen) }}
        style={enLista ? estilos.fotoLista : estilos.foto}
        contentFit="cover"
        transition={200}
        accessibilityIgnoresInvertColors
      />
      <View style={[estilos.cuerpo, enLista && estilos.cuerpoLista]}>
        <Text style={estilos.categoria}>{producto.categoria.toUpperCase()}</Text>
        <Text style={estilos.nombre} numberOfLines={2}>
          {producto.nombre}
        </Text>
        <View style={estilos.ubicacion}>
          <Ionicons name="location-outline" size={13} color={colores.textoSuave} />
          <Text style={estilos.municipio} numberOfLines={1}>
            {producto.municipio}, {producto.departamento}
          </Text>
        </View>
        {enLista ? (
          <Text style={estilos.descripcion} numberOfLines={2}>
            {producto.descripcion}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    flex: 1,
    backgroundColor: colores.superficie,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colores.borde,
    overflow: "hidden",
    ...sombra,
  },
  tarjetaLista: { flexDirection: "row" },
  presionada: { opacity: 0.85, transform: [{ scale: 0.985 }] },
  foto: { width: "100%", aspectRatio: 4 / 5, backgroundColor: colores.fondoSuave },
  fotoLista: { width: 110, minHeight: 130, backgroundColor: colores.fondoSuave },
  cuerpo: { padding: 12, gap: 4 },
  cuerpoLista: { flex: 1, padding: 14, justifyContent: "center" },
  categoria: { fontSize: 11, fontWeight: "700", color: colores.terciario, letterSpacing: 0.5 },
  nombre: { fontSize: 15, fontWeight: "700", color: colores.texto, lineHeight: 19 },
  ubicacion: { flexDirection: "row", alignItems: "center", gap: 3 },
  municipio: { flex: 1, fontSize: 12, color: colores.textoSuave },
  descripcion: { fontSize: 13, color: colores.textoSuave, marginTop: 4, lineHeight: 18 },
});
