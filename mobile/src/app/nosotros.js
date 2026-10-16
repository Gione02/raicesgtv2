import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import BotonWhatsApp from "../components/BotonWhatsApp";
import FranjaTextil from "../components/FranjaTextil";
import { abrirWhatsApp, urlImagen } from "../config";
import { useCatalogo } from "../datos/CatalogoContext";
import { colores } from "../tema";
import { normalizar } from "../utils/texto";

// Mismos textos que frontend/public/nosotros.html. Si el equipo cambia la
// historia en la web, conviene actualizarla también aquí.
const VALORES = [
  { icono: "location-outline", titulo: "Origen claro", texto: "Cada pieza muestra su municipio y departamento, para reconocer a las comunidades detrás de ella." },
  { icono: "heart-outline", titulo: "Trabajo artesanal valorado", texto: "Un bordado a mano puede llevar semanas de trabajo. Lo presentamos con el respeto que merece." },
  { icono: "shield-checkmark-outline", titulo: "Piezas seleccionadas", texto: "Elegimos cada traje por su calidad, sus detalles y su autenticidad." },
  { icono: "chatbubbles-outline", titulo: "Atención cercana", texto: "Te asesoramos por WhatsApp con medidas, disponibilidad y envíos antes de tu compra." },
];

const PASOS = [
  ["Explora", "Busca en la colección por región, tipo de prenda o color."],
  ["Consulta", "Escríbenos por WhatsApp y te confirmamos precio, medidas y disponibilidad."],
  ["Confirma", "Acordamos la forma de pago y los detalles de tu pedido."],
  ["Recibe", "Enviamos a diferentes departamentos de Guatemala y te damos seguimiento."],
];

export default function Nosotros() {
  const { productos } = useCatalogo();

  // Departamentos de origen calculados con el catálogo real
  const origen = useMemo(() => {
    const mapa = new Map();
    productos.forEach((p) => {
      if (!p.departamento) return;
      const d = mapa.get(p.departamento) || { piezas: 0 };
      d.piezas++;
      mapa.set(p.departamento, d);
    });
    const municipios = new Set(productos.map((p) => p.municipio).filter(Boolean));
    return { lista: [...mapa.entries()].sort((a, b) => b[1].piezas - a[1].piezas), municipios: municipios.size };
  }, [productos]);

  const foto = productos.find((p) => p.id === 27) || productos[0];

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
      <LinearGradient colors={[colores.indigo, colores.indigoMedio, colores.primario]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={estilos.portada}>
        <Text style={estilos.etiquetaPortada}>SOBRE NOSOTROS</Text>
        <Text style={estilos.tituloPortada}>
          Tejemos puentes entre la <Text style={{ color: colores.celeste }}>tradición</Text> y quienes la llevan puesta.
        </Text>
        <Text style={estilos.textoPortada}>
          En RaícesGT acercamos los textiles tradicionales guatemaltecos a nuevas generaciones, resaltando sus colores, sus
          diseños y el trabajo que hay detrás de cada pieza.
        </Text>
        {foto ? <Image source={{ uri: urlImagen(foto.imagen) }} style={estilos.fotoPortada} contentFit="cover" transition={200} /> : null}
      </LinearGradient>
      <FranjaTextil />

      <View style={estilos.seccion}>
        <Text style={estilos.titulo}>Más que una prenda, una historia que continúa</Text>
        <Text style={estilos.parrafo}>
          Cada traje guatemalteco guarda conocimientos que pasan de generación en generación: técnicas, símbolos y colores que
          identifican a cada pueblo. Queremos que ese conocimiento siga vivo y que más personas puedan conocerlo y llevarlo con
          orgullo.
        </Text>
      </View>

      <View style={estilos.seccion}>
        <Text style={estilos.titulo}>Lo que nos mueve</Text>
        {VALORES.map((v) => (
          <View key={v.titulo} style={estilos.tarjeta}>
            <View style={estilos.icono}>
              <Ionicons name={v.icono} size={22} color={colores.primario} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={estilos.tituloTarjeta}>{v.titulo}</Text>
              <Text style={estilos.textoTarjeta}>{v.texto}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={estilos.seccion}>
        <Text style={estilos.titulo}>Textiles de todo Guatemala</Text>
        <Text style={[estilos.parrafo, { marginBottom: 12 }]}>
          Nuestra colección reúne piezas de {origen.municipios} municipios en {origen.lista.length} departamentos del país.
        </Text>
        <View style={estilos.chips}>
          {origen.lista.map(([nombre, d]) => (
            <Pressable
              key={nombre}
              style={({ pressed }) => [estilos.chip, pressed && { backgroundColor: colores.azulSuave }]}
              onPress={() => router.push({ pathname: "/catalogo", params: { departamento: normalizar(nombre), categoria: "" } })}
            >
              <Text style={estilos.textoChip}>{nombre}</Text>
              <Text style={estilos.conteoChip}>{d.piezas}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={estilos.seccion}>
        <Text style={estilos.titulo}>Así es comprar con nosotros</Text>
        {PASOS.map(([titulo, texto], i) => (
          <View key={titulo} style={estilos.paso}>
            <Text style={estilos.numero}>{String(i + 1).padStart(2, "0")}</Text>
            <View style={{ flex: 1 }}>
              <Text style={estilos.tituloTarjeta}>{titulo}</Text>
              <Text style={estilos.textoTarjeta}>{texto}</Text>
            </View>
          </View>
        ))}
        <BotonWhatsApp onPress={() => abrirWhatsApp()} estilo={{ marginTop: 12 }} />
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  portada: { padding: 22, paddingTop: 28 },
  etiquetaPortada: { color: "#fff", fontWeight: "900", fontSize: 12, opacity: 0.8, marginBottom: 10 },
  tituloPortada: { color: "#fff", fontSize: 32, lineHeight: 36, fontWeight: "900", letterSpacing: -1 },
  textoPortada: { color: "rgba(255,255,255,0.85)", fontSize: 15, lineHeight: 22, marginTop: 12 },
  fotoPortada: { width: "100%", aspectRatio: 4 / 3, borderRadius: 18, marginTop: 20 },
  seccion: { paddingHorizontal: 16, paddingTop: 26 },
  titulo: { fontSize: 22, fontWeight: "800", color: colores.texto, letterSpacing: -0.5, marginBottom: 10 },
  parrafo: { fontSize: 15, lineHeight: 23, color: colores.textoSuave },
  tarjeta: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    backgroundColor: colores.superficie,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colores.borde,
    padding: 14,
    marginBottom: 10,
  },
  icono: { width: 44, height: 44, borderRadius: 12, backgroundColor: colores.azulSuave, alignItems: "center", justifyContent: "center" },
  tituloTarjeta: { fontWeight: "800", color: colores.texto, fontSize: 15 },
  textoTarjeta: { color: colores.textoSuave, fontSize: 13, marginTop: 2, lineHeight: 19 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  textoChip: { color: colores.primario, fontWeight: "700" },
  conteoChip: { color: colores.textoSuave, fontSize: 12 },
  paso: { flexDirection: "row", gap: 14, alignItems: "flex-start", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colores.borde },
  numero: { fontSize: 26, fontWeight: "900", color: "rgba(0,100,124,0.3)", width: 40 },
});
