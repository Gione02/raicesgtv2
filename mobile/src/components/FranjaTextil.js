import { StyleSheet, View } from "react-native";

import { franjaTextil } from "../tema";

// Franja de colores que acompaña a la cabecera, igual que en la web
export default function FranjaTextil({ alto = 4 }) {
  return (
    <View style={[estilos.fila, { height: alto }]}>
      {franjaTextil.map((color, i) => (
        <View key={i} style={[estilos.segmento, { backgroundColor: color }]} />
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: { flexDirection: "row" },
  segmento: { flex: 1 },
});
