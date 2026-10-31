import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import BotonWhatsApp from "../../components/BotonWhatsApp";
import TarjetaDepartamento from "../../components/TarjetaDepartamento";
import TarjetaProducto from "../../components/TarjetaProducto";
import { abrirWhatsApp, urlImagen } from "../../config";
import { useCatalogo } from "../../datos/CatalogoContext";
import { departamentosConPiezas } from "../../datos/departamentos";
import { colores, sombra } from "../../tema";

const RECIENTES = 4;

// Mismos textos cortos que la web
const BENEFICIOS = [
  { icono: "car-outline", titulo: "Envíos a toda Guatemala" },
  { icono: "shield-checkmark-outline", titulo: "Entrega segura" },
  { icono: "logo-whatsapp", titulo: "Atención directa" },
];

export default function Inicio() {
  const { productos } = useCatalogo();

  const recientes = useMemo(() => [...productos].sort((a, b) => b.id - a.id).slice(0, RECIENTES), [productos]);
  const regiones = useMemo(() => departamentosConPiezas(productos).slice(0, 4), [productos]);
  const destacado = productos.find((p) => p.id === 1) || productos[0];

  return (
    <ScrollView contentContainerStyle={estilos.contenido}>
      {/* Portada */}
      <View style={estilos.portada}>
        <Text style={estilos.etiqueta}>Textiles con identidad guatemalteca</Text>
        <Text style={estilos.titular}>
          Viste la <Text style={{ color: colores.primario }}>tradición</Text> a tu manera.
        </Text>
        <Text style={estilos.parrafo}>Trajes típicos llenos de color y significado.</Text>
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

      {/* Compra por región: foto de cada departamento */}
      <View style={estilos.seccion}>
        <View style={estilos.encabezadoSeccion}>
          <Text style={estilos.tituloSeccion}>¿De dónde lo quieres?</Text>
          <Pressable onPress={() => router.push("/nosotros")} hitSlop={8}>
            <Text style={estilos.verTodo}>Ver todas</Text>
          </Pressable>
        </View>
        <View style={estilos.cuadricula}>
          {regiones.map((d) => (
            <View key={d.nombre} style={estilos.celda}>
              <TarjetaDepartamento departamento={d} />
            </View>
          ))}
        </View>
      </View>

      {/* Compra con confianza */}
      <View style={estilos.seccion}>
        <Text style={estilos.tituloSeccion}>Compra con confianza</Text>
        <View style={estilos.beneficios}>
          {BENEFICIOS.map((b) => (
            <View key={b.titulo} style={estilos.beneficio}>
              <View style={estilos.iconoBeneficio}>
                <Ionicons name={b.icono} size={26} color="#fff" />
              </View>
              <Text style={estilos.tituloBeneficio}>{b.titulo}</Text>
            </View>
          ))}
        </View>
        <Pressable style={({ pressed }) => [estilos.enlaceNosotros, pressed && { opacity: 0.7 }]} onPress={() => router.push("/nosotros")}>
          <Text style={estilos.textoEnlace}>Conoce nuestra historia</Text>
          <Ionicons name="arrow-forward" size={16} color={colores.secundario} />
        </Pressable>
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
  beneficios: { flexDirection: "row", gap: 10 },
  beneficio: {
    flex: 1,
    alignItems: "center",
    gap: 10,
    backgroundColor: colores.superficie,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colores.borde,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  iconoBeneficio: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colores.secundario,
    alignItems: "center",
    justifyContent: "center",
  },
  enlaceNosotros: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 10 },
  textoEnlace: { color: colores.secundario, fontWeight: "700" },
  tituloBeneficio: { fontWeight: "800", color: colores.texto, fontSize: 13, textAlign: "center" },
});
