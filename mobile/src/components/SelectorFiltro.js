import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colores } from "../tema";

// Botón que abre una lista de opciones desde abajo (departamento, categoría, color, orden)
export default function SelectorFiltro({ etiqueta, opciones, valor, onCambiar, textoTodos }) {
  const [abierto, setAbierto] = useState(false);
  const { bottom } = useSafeAreaInsets();
  const seleccionada = opciones.find((o) => o.valor === valor);
  const activo = Boolean(valor) && Boolean(textoTodos);
  const lista = textoTodos ? [{ valor: "", texto: textoTodos }, ...opciones] : opciones;

  return (
    <>
      <Pressable
        onPress={() => setAbierto(true)}
        style={[estilos.boton, activo && estilos.botonActivo]}
        accessibilityRole="button"
        accessibilityLabel={`${etiqueta}: ${seleccionada ? seleccionada.texto : textoTodos}`}
      >
        <Text style={[estilos.textoBoton, activo && estilos.textoActivo]} numberOfLines={1}>
          {seleccionada && (activo || !textoTodos) ? seleccionada.texto : etiqueta}
        </Text>
        <Ionicons name="chevron-down" size={14} color={activo ? "#fff" : colores.textoSuave} />
      </Pressable>

      <Modal visible={abierto} transparent animationType="slide" onRequestClose={() => setAbierto(false)}>
        <Pressable style={estilos.fondo} onPress={() => setAbierto(false)} accessibilityLabel="Cerrar" />
        <View style={[estilos.hoja, { paddingBottom: bottom + 12 }]}>
          <View style={estilos.asa} />
          <Text style={estilos.tituloHoja}>{etiqueta}</Text>
          <FlatList
            data={lista}
            keyExtractor={(o) => o.valor || "todos"}
            renderItem={({ item }) => {
              const elegido = item.valor === (valor || "");
              return (
                <Pressable
                  style={({ pressed }) => [estilos.opcion, pressed && { backgroundColor: colores.fondoSuave }]}
                  onPress={() => {
                    onCambiar(item.valor);
                    setAbierto(false);
                  }}
                >
                  <Text style={[estilos.textoOpcion, elegido && estilos.textoElegido]}>{item.texto}</Text>
                  {elegido ? <Ionicons name="checkmark" size={20} color={colores.primario} /> : null}
                </Pressable>
              );
            }}
          />
        </View>
      </Modal>
    </>
  );
}

const estilos = StyleSheet.create({
  boton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: colores.superficie,
    maxWidth: 200,
  },
  botonActivo: { backgroundColor: colores.primario, borderColor: colores.primario },
  textoBoton: { fontSize: 13, fontWeight: "600", color: colores.texto, flexShrink: 1 },
  textoActivo: { color: "#fff" },
  fondo: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },
  hoja: {
    backgroundColor: colores.superficie,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 8,
    maxHeight: "70%",
  },
  asa: { alignSelf: "center", width: 40, height: 5, borderRadius: 3, backgroundColor: colores.borde, marginTop: 10 },
  tituloHoja: { fontSize: 17, fontWeight: "800", color: colores.texto, padding: 14 },
  opcion: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 10,
  },
  textoOpcion: { fontSize: 16, color: colores.texto },
  textoElegido: { fontWeight: "700", color: colores.primario },
});
