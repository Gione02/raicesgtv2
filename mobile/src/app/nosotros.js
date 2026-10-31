import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import BotonWhatsApp from "../components/BotonWhatsApp";
import FranjaTextil from "../components/FranjaTextil";
import TarjetaDepartamento from "../components/TarjetaDepartamento";
import { abrirWhatsApp, urlImagen } from "../config";
import { useCatalogo } from "../datos/CatalogoContext";
import { CREDITOS_FOTOS, departamentosConPiezas } from "../datos/departamentos";
import { colores } from "../tema";

// Mismo contenido que frontend/public/nosotros.html: pocas palabras, muchas
// fotos. Si el equipo cambia la web, conviene cambiarlo también aquí.
const VALORES = [
  { icono: "location", titulo: "Origen claro", color: colores.primario },
  { icono: "heart", titulo: "Hecho por artesanas", color: colores.secundario },
  { icono: "shield-checkmark", titulo: "Piezas auténticas", color: colores.terciario },
  { icono: "logo-whatsapp", titulo: "Atención directa", color: colores.whatsapp },
];

const PASOS = [
  { icono: "search", titulo: "Elige", texto: "tu prenda favorita" },
  { icono: "logo-whatsapp", titulo: "Escríbenos", texto: "por WhatsApp" },
  { icono: "card-outline", titulo: "Paga", texto: "como prefieras" },
  { icono: "car-outline", titulo: "Recíbela", texto: "en tu casa" },
];

// Fotos del mosaico (archivos del catálogo en Supabase)
const MOSAICO = ["traje-23.png", "traje-10.jpeg", "traje-29.jpeg"];

export default function Nosotros() {
  const { productos } = useCatalogo();

  const regiones = useMemo(() => departamentosConPiezas(productos), [productos]);
  const municipios = useMemo(() => new Set(productos.map((p) => p.municipio).filter(Boolean)).size, [productos]);

  const CIFRAS = [
    { valor: productos.length, texto: "piezas", color: colores.primario },
    { valor: municipios, texto: "municipios", color: colores.secundario },
    { valor: regiones.length, texto: "departamentos", color: colores.terciario },
  ];

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Portada */}
      <LinearGradient colors={[colores.cacaoOscuro, colores.cacao]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={estilos.portada}>
        <Text style={estilos.etiquetaPortada}>SOBRE NOSOTROS</Text>
        <Text style={estilos.tituloPortada}>
          Tejemos puentes entre la <Text style={{ color: colores.maiz }}>tradición</Text> y quienes la llevan puesta.
        </Text>
        <Text style={estilos.textoPortada}>Textiles guatemaltecos, con su historia.</Text>
        <View style={estilos.collage}>
          <Image source={{ uri: urlImagen("traje-24.png") }} style={estilos.collageGrande} contentFit="cover" transition={200} />
          <View style={estilos.collageColumna}>
            <Image source={{ uri: urlImagen("santiago.jpeg") }} style={estilos.collagePequena} contentFit="cover" transition={200} />
            <Image source={{ uri: urlImagen("patzun.png") }} style={[estilos.collagePequena, { backgroundColor: "#fff" }]} contentFit="cover" transition={200} />
          </View>
        </View>
      </LinearGradient>
      <FranjaTextil />

      {/* Cifras */}
      <View style={estilos.cifras}>
        {CIFRAS.map((c) => (
          <View key={c.texto} style={estilos.cifra}>
            <Text style={[estilos.valorCifra, { color: c.color }]}>{c.valor}</Text>
            <Text style={estilos.textoCifra} numberOfLines={1} adjustsFontSizeToFit>
              {c.texto}
            </Text>
          </View>
        ))}
      </View>

      {/* Nuestra historia: foto con una frase + mosaico */}
      <View style={estilos.seccion}>
        <View style={estilos.historia}>
          <Image source={{ uri: urlImagen("traje-17.jpeg") }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
          <LinearGradient colors={["transparent", "rgba(43,29,23,0.35)", "rgba(43,29,23,0.92)"]} style={StyleSheet.absoluteFill} />
          <View style={estilos.textoHistoria}>
            <Text style={estilos.etiquetaHistoria}>NUESTRA HISTORIA</Text>
            <Text style={estilos.fraseHistoria}>Cada traje cuenta la historia de su pueblo.</Text>
          </View>
        </View>
        <View style={estilos.mosaico}>
          {MOSAICO.map((archivo) => (
            <Image key={archivo} source={{ uri: urlImagen(archivo) }} style={estilos.fotoMosaico} contentFit="cover" transition={200} />
          ))}
        </View>
      </View>

      {/* Valores: solo ícono y título */}
      <View style={estilos.seccion}>
        <Text style={estilos.titulo}>Lo que nos mueve</Text>
        <View style={estilos.cuadricula}>
          {VALORES.map((v) => (
            <View key={v.titulo} style={estilos.valor}>
              <View style={[estilos.circulo, { backgroundColor: v.color }]}>
                <Ionicons name={v.icono} size={28} color="#fff" />
              </View>
              <Text style={estilos.tituloValor}>{v.titulo}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* De dónde vienen: foto de cada departamento */}
      <View style={estilos.seccion}>
        <Text style={estilos.titulo}>Textiles de todo Guatemala</Text>
        <View style={estilos.departamentos}>
          {regiones.map((d, i) => (
            <View key={d.nombre} style={i < 2 ? estilos.celdaCompleta : estilos.celda}>
              <TarjetaDepartamento departamento={d} grande={i < 2} />
            </View>
          ))}
        </View>
      </View>

      {/* Cómo comprar */}
      <View style={estilos.seccion}>
        <Text style={estilos.titulo}>Comprar es así de fácil</Text>
        <View style={estilos.cuadricula}>
          {PASOS.map((p, i) => (
            <View key={p.titulo} style={estilos.paso}>
              <View style={estilos.iconoPaso}>
                <Ionicons name={p.icono} size={26} color={colores.primario} />
                <Text style={estilos.numeroPaso}>{i + 1}</Text>
              </View>
              <Text style={estilos.tituloValor}>{p.titulo}</Text>
              <Text style={estilos.textoPaso}>{p.texto}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Cierre con foto de fondo */}
      <View style={estilos.seccion}>
        <View style={estilos.cierre}>
          <Image source={{ uri: urlImagen("traje-12.jpeg") }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
          <LinearGradient colors={["rgba(43,29,23,0.95)", "rgba(43,29,23,0.55)"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
          <Text style={estilos.tituloCierre}>Hecho a mano, con historia.</Text>
          <Pressable style={({ pressed }) => [estilos.botonCierre, pressed && { opacity: 0.85 }]} onPress={() => router.push("/catalogo")}>
            <Text style={estilos.textoBotonCierre}>Ver la colección</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </Pressable>
          <BotonWhatsApp onPress={() => abrirWhatsApp()} estilo={{ marginTop: 10 }} />
        </View>
        {/* Créditos de las fotos de paisajes (obligatorio por su licencia) */}
        <Text style={estilos.creditos}>{CREDITOS_FOTOS}</Text>
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  portada: { padding: 22, paddingTop: 28 },
  etiquetaPortada: { color: "#fff", fontWeight: "900", fontSize: 12, opacity: 0.8, marginBottom: 10 },
  tituloPortada: { color: "#fff", fontSize: 32, lineHeight: 36, fontWeight: "900", letterSpacing: -1 },
  textoPortada: { color: "rgba(255,255,255,0.8)", fontSize: 17, marginTop: 10 },
  collage: { flexDirection: "row", gap: 10, height: 260, marginTop: 20 },
  collageGrande: { flex: 2, borderRadius: 18 },
  collageColumna: { flex: 1, gap: 10 },
  collagePequena: { flex: 1, borderRadius: 18 },
  cifras: { flexDirection: "row", gap: 10, paddingHorizontal: 16, paddingTop: 22 },
  cifra: { flex: 1, alignItems: "center", backgroundColor: colores.superficie, borderRadius: 16, borderWidth: 1, borderColor: colores.borde, paddingVertical: 16, paddingHorizontal: 6 },
  valorCifra: { fontSize: 34, fontWeight: "900" },
  textoCifra: { fontSize: 12, fontWeight: "700", color: colores.textoSuave },
  seccion: { paddingHorizontal: 16, paddingTop: 26 },
  titulo: { fontSize: 22, fontWeight: "800", color: colores.texto, letterSpacing: -0.5, marginBottom: 14 },
  historia: { height: 260, borderRadius: 22, overflow: "hidden", justifyContent: "flex-end" },
  textoHistoria: { padding: 20 },
  etiquetaHistoria: { color: "#fff", fontWeight: "900", fontSize: 11, opacity: 0.85, marginBottom: 6 },
  fraseHistoria: { color: "#fff", fontSize: 26, lineHeight: 30, fontWeight: "900", letterSpacing: -0.5 },
  mosaico: { flexDirection: "row", gap: 10, marginTop: 10 },
  fotoMosaico: { flex: 1, height: 110, borderRadius: 16, backgroundColor: colores.fondoSuave },
  cuadricula: { flexDirection: "row", flexWrap: "wrap", rowGap: 18 },
  valor: { width: "50%", alignItems: "center", gap: 8 },
  circulo: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center" },
  tituloValor: { fontWeight: "800", color: colores.texto, fontSize: 15, textAlign: "center" },
  departamentos: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -5 },
  celdaCompleta: { width: "100%", padding: 5 },
  celda: { width: "50%", padding: 5 },
  paso: { width: "50%", alignItems: "center", gap: 4 },
  iconoPaso: { width: 60, height: 60, borderRadius: 18, backgroundColor: colores.durazno, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  numeroPaso: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colores.primario,
    color: "#fff",
    fontWeight: "900",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 24,
    overflow: "hidden",
  },
  textoPaso: { fontSize: 13, color: colores.textoSuave },
  cierre: { borderRadius: 22, overflow: "hidden", padding: 22, paddingTop: 70 },
  tituloCierre: { color: "#fff", fontSize: 30, lineHeight: 34, fontWeight: "900", letterSpacing: -0.5, marginBottom: 18 },
  botonCierre: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colores.primario,
    paddingVertical: 14,
    borderRadius: 999,
  },
  textoBotonCierre: { color: "#fff", fontWeight: "800", fontSize: 16 },
  creditos: { fontSize: 11, lineHeight: 16, color: colores.contorno, marginTop: 16 },
});
