import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import BotonWhatsApp from "../../components/BotonWhatsApp";
import TarjetaProducto from "../../components/TarjetaProducto";
import { abrirWhatsApp, urlImagen } from "../../config";
import { useCatalogo } from "../../datos/CatalogoContext";
import { colores, sombra } from "../../tema";
import { opcionesUnicas } from "../../utils/texto";

const RECIENTES = 4;

const BENEFICIOS = [
  { icono: "car-outline", titulo: "Envíos nacionales", texto: "Enviamos a diferentes departamentos de Guatemala." },
  { icono: "shield-checkmark-outline", titulo: "Entrega segura", texto: "Coordinamos la entrega y te damos seguimiento." },
  { icono: "headset-outline", titulo: "Atención directa", texto: "Consulta medidas, precio y disponibilidad." },
];

export default function Inicio() {
  const { productos } = useCatalogo();

  const recientes = useMemo(() => [...productos].sort((a, b) => b.id - a.id).slice(0, RECIENTES), [productos]);
  const departamentos = useMemo(() => opcionesUnicas(productos.map((p) => p.departamento)), [productos]);
  const destacado = productos.find((p) => p.id === 1) || productos[0];

  return (
    <ScrollView contentContainerStyle={estilos.contenido}>
      {/* Portada */}
      <View style={estilos.portada}>
        <Text style={estilos.etiqueta}>Textiles con identidad guatemalteca</Text>
        <Text style={estilos.titular}>
          Viste la <Text style={{ color: colores.primario }}>tradición</Text> a tu manera.
        </Text>
        <Text style={estilos.parrafo}>
          Descubre trajes típicos llenos de color, diseño y significado. Piezas seleccionadas para conservar la esencia de
          nuestras tradiciones.
        </Text>
        {destacado ? (
          <Image source={{ uri: urlImagen(destacado.imagen) }} style={estilos.fotoPortada} contentFit="cover" transition={200} />
        ) : null}
        <View style={estilos.botones}>
          <Pressable style={({ pressed }) => [estilos.botonPrimario, pressed && { opacity: 0.85 }]} onPress={() => router.push("/catalogo")}>
            <Text style={estilos.textoBotonPrimario}>Ver colección</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </Pressable>
        </View>
      </View>

      {/* Recién agregados */}
      <View style={estilos.seccion}>
        <View style={estilos.encabezadoSeccion}>
          <Text style={estilos.tituloSeccion}>Agregados recientemente</Text>
          <Pressable onPress={() => router.push("/catalogo")} hitSlop={8}>
            <Text style={estilos.verTodo}>Ver todo</Text>
          </Pressable>
        </View>
        <View style={estilos.cuadricula}>
          {recientes.map((p) => (
            <View key={p.id} style={estilos.celda}>
              <TarjetaProducto producto={p} />
            </View>
          ))}
        </View>
      </View>

      {/* Por departamento */}
      <View style={estilos.seccion}>
        <Text style={estilos.tituloSeccion}>Explora por departamento</Text>
        <View style={estilos.chips}>
          {departamentos.map((d) => (
            <Pressable
              key={d.valor}
              style={({ pressed }) => [estilos.chip, pressed && { backgroundColor: colores.azulSuave }]}
              onPress={() => router.push({ pathname: "/catalogo", params: { departamento: d.valor } })}
            >
              <Text style={estilos.textoChip}>{d.texto}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Compra con confianza */}
      <View style={estilos.seccion}>
        <Text style={estilos.tituloSeccion}>Compra con confianza</Text>
        {BENEFICIOS.map((b) => (
          <View key={b.titulo} style={estilos.beneficio}>
            <View style={estilos.iconoBeneficio}>
              <Ionicons name={b.icono} size={24} color={colores.secundario} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={estilos.tituloBeneficio}>{b.titulo}</Text>
              <Text style={estilos.textoBeneficio}>{b.texto}</Text>
            </View>
          </View>
        ))}
        <BotonWhatsApp onPress={() => abrirWhatsApp()} estilo={{ marginTop: 8 }} />
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenido: { paddingBottom: 32 },
  portada: { padding: 20, paddingTop: 24, backgroundColor: colores.fondoSuave },
  etiqueta: {
    alignSelf: "flex-start",
    backgroundColor: colores.azulSuave,
    color: colores.primario,
    fontWeight: "800",
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 12,
  },
  titular: { fontSize: 38, lineHeight: 40, fontWeight: "900", color: colores.texto, letterSpacing: -1.5 },
  parrafo: { fontSize: 15, lineHeight: 22, color: colores.textoSuave, marginTop: 12 },
  fotoPortada: { width: "100%", aspectRatio: 4 / 3, borderRadius: 20, marginTop: 20, backgroundColor: "#fff", ...sombra },
  botones: { flexDirection: "row", marginTop: 20 },
  botonPrimario: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colores.primario,
    paddingVertical: 14,
    borderRadius: 14,
  },
  textoBotonPrimario: { color: "#fff", fontWeight: "800", fontSize: 16 },
  seccion: { paddingHorizontal: 16, paddingTop: 28 },
  encabezadoSeccion: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  tituloSeccion: { fontSize: 22, fontWeight: "800", color: colores.texto, letterSpacing: -0.5, marginBottom: 14 },
  verTodo: { color: colores.secundario, fontWeight: "700", marginBottom: 14 },
  cuadricula: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -6 },
  celda: { width: "50%", padding: 6 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  textoChip: { color: colores.primario, fontWeight: "600" },
  beneficio: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    backgroundColor: colores.superficie,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colores.borde,
    padding: 16,
    marginBottom: 10,
  },
  iconoBeneficio: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#eef0ff",
    alignItems: "center",
    justifyContent: "center",
  },
  tituloBeneficio: { fontWeight: "800", color: colores.texto, fontSize: 15 },
  textoBeneficio: { color: colores.textoSuave, fontSize: 13, marginTop: 2 },
});
