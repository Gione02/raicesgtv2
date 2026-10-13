import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text } from "react-native";

import { colores } from "../tema";

export default function BotonWhatsApp({ texto = "Escríbenos por WhatsApp", onPress, estilo }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [estilos.boton, pressed && { opacity: 0.85 }, estilo]}
      accessibilityRole="button"
    >
      <Ionicons name="logo-whatsapp" size={20} color="#fff" />
      <Text style={estilos.texto}>{texto}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  boton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colores.whatsapp,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  texto: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
