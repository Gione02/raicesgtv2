import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { urlImagen } from "../config";
import { colorDepartamento, fotoDepartamento } from "../datos/departamentos";
import { normalizar } from "../utils/texto";

// Tarjeta con la foto del departamento teñida con su color (igual que en la web).
// Al tocarla abre la colección filtrada por ese departamento.
export default function TarjetaDepartamento({ departamento, grande = false, estilo }) {
  const { nombre, piezas, imagenProducto } = departamento;
  const foto = fotoDepartamento(nombre);
  const color = colorDepartamento(nombre);
  return (
    <Pressable
      onPress={() => router.push({ pathname: "/catalogo", params: { departamento: normalizar(nombre), categoria: "" } })}
      style={({ pressed }) => [estilos.tarjeta, { height: grande ? 230 : 160 }, pressed && estilos.presionada, estilo]}
      accessibilityRole="button"
      accessibilityLabel={`Ver textiles de ${nombre}`}
    >
      <Image
        source={foto ? foto.foto : { uri: urlImagen(imagenProducto) }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={200}
        accessibilityLabel={foto ? foto.lugar : nombre}
      />
      <LinearGradient colors={["transparent", `${color}99`, `${color}F2`]} locations={[0.25, 0.6, 1]} style={StyleSheet.absoluteFill} />
      <View style={estilos.texto}>
        <Text style={[estilos.nombre, grande && estilos.nombreGrande]} numberOfLines={1} adjustsFontSizeToFit>
          {nombre}
        </Text>
        <View style={estilos.fila}>
          <Text style={estilos.piezas}>
            {piezas} pieza{piezas === 1 ? "" : "s"}
          </Text>
          <Ionicons name="arrow-forward" size={14} color="#fff" />
        </View>
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tarjeta: { width: "100%", borderRadius: 18, overflow: "hidden", backgroundColor: "#5A3526" },
  presionada: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  texto: { position: "absolute", left: 14, right: 14, bottom: 12 },
  nombre: { color: "#fff", fontSize: 18, fontWeight: "900" },
  nombreGrande: { fontSize: 28 },
  fila: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  piezas: { color: "rgba(255,255,255,0.92)", fontSize: 13, fontWeight: "700" },
});
