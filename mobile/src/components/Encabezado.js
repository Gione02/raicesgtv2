import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colores } from "../tema";
import FranjaTextil from "./FranjaTextil";

// Cabecera con el degradado de la web: índigo -> azul petróleo
export default function Encabezado({ titulo }) {
  const { top } = useSafeAreaInsets();
  return (
    <View>
      <LinearGradient
        colors={[colores.indigo, colores.indigoMedio, colores.primario]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[estilos.fondo, { paddingTop: top + 10 }]}
      >
        <Text style={estilos.logo}>
          Raíces<Text style={estilos.logoGT}>GT</Text>
        </Text>
        {titulo ? <Text style={estilos.titulo}>{titulo}</Text> : null}
      </LinearGradient>
      <FranjaTextil />
    </View>
  );
}

const estilos = StyleSheet.create({
  fondo: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: { color: "#fff", fontSize: 22, fontWeight: "900", letterSpacing: -0.5 },
  logoGT: { color: colores.celeste },
  titulo: { color: "rgba(255,255,255,0.85)", fontSize: 15, fontWeight: "600" },
});
