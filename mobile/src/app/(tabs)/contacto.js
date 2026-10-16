import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import BotonWhatsApp from "../../components/BotonWhatsApp";
import { abrirWhatsApp, SITIO } from "../../config";
import { useCatalogo } from "../../datos/CatalogoContext";
import { colores } from "../../tema";

const ICONOS_REDES = { facebook: "logo-facebook", instagram: "logo-instagram", tiktok: "logo-tiktok" };
const NOMBRES_REDES = { facebook: "Facebook", instagram: "Instagram", tiktok: "TikTok" };

const PREGUNTAS = [
  ["¿Hacen envíos a todo el país?", "Realizamos envíos a diferentes departamentos de Guatemala. El costo depende del destino."],
  ["¿Cómo sé si la talla me queda?", "Escríbenos con tus medidas y te confirmamos antes de realizar el pedido."],
  ["¿Las piezas están disponibles?", "Muchas piezas son únicas. Consulta disponibilidad antes de tu compra."],
];

function Pregunta({ pregunta, respuesta }) {
  const [abierta, setAbierta] = useState(false);
  return (
    <Pressable onPress={() => setAbierta(!abierta)} style={estilos.pregunta} accessibilityRole="button" accessibilityState={{ expanded: abierta }}>
      <View style={estilos.filaPregunta}>
        <Text style={estilos.textoPregunta}>{pregunta}</Text>
        <Ionicons name={abierta ? "chevron-up" : "chevron-down"} size={18} color={colores.textoSuave} />
      </View>
      {abierta ? <Text style={estilos.respuesta}>{respuesta}</Text> : null}
    </Pressable>
  );
}

export default function Contacto() {
  const { origen, productos } = useCatalogo();
  const redes = Object.entries(SITIO.redes).filter(([, url]) => url);

  return (
    <ScrollView contentContainerStyle={estilos.contenido}>
      <Text style={estilos.titulo}>Hablemos de tu próximo textil</Text>
      <Text style={estilos.parrafo}>Consulta precios, medidas, disponibilidad y opciones de envío. Te respondemos por WhatsApp.</Text>

      <Pressable style={({ pressed }) => [estilos.tarjeta, estilos.filaNosotros, pressed && { opacity: 0.85 }]} onPress={() => router.push("/nosotros")}>
        <View style={{ flex: 1 }}>
          <Text style={estilos.tituloTarjeta}>Sobre RaícesGT</Text>
          <Text style={estilos.textoTarjeta}>Conoce nuestra historia y de dónde vienen nuestras piezas.</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colores.primario} />
      </Pressable>

      <View style={estilos.tarjeta}>
        <Text style={estilos.tituloTarjeta}>WhatsApp</Text>
        <Text style={estilos.textoTarjeta}>La forma más rápida de comunicarte con nosotros.</Text>
        <BotonWhatsApp texto={SITIO.whatsappVisible} onPress={() => abrirWhatsApp()} estilo={{ marginTop: 12 }} />
      </View>

      {redes.length ? (
        <View style={estilos.tarjeta}>
          <Text style={estilos.tituloTarjeta}>Redes sociales</Text>
          <Text style={estilos.textoTarjeta}>Síguenos para ver nuevas piezas.</Text>
          <View style={estilos.redes}>
            {redes.map(([red, url]) => (
              <Pressable key={red} style={({ pressed }) => [estilos.red, pressed && { opacity: 0.8 }]} onPress={() => Linking.openURL(url)}>
                <Ionicons name={ICONOS_REDES[red]} size={20} color={colores.primario} />
                <Text style={estilos.textoRed}>{NOMBRES_REDES[red]}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      <View style={estilos.tarjeta}>
        <Text style={[estilos.tituloTarjeta, { marginBottom: 4 }]}>Preguntas frecuentes</Text>
        {PREGUNTAS.map(([p, r]) => (
          <Pregunta key={p} pregunta={p} respuesta={r} />
        ))}
      </View>

      <Text style={estilos.pie}>
        Catálogo: {productos.length} productos · {origen === "servidor" ? "actualizado desde el servidor" : "copia incluida en la app"}
      </Text>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenido: { padding: 16, paddingBottom: 32, gap: 12 },
  titulo: { fontSize: 28, lineHeight: 32, fontWeight: "900", color: colores.texto, letterSpacing: -0.8, marginTop: 8 },
  parrafo: { fontSize: 15, lineHeight: 22, color: colores.textoSuave, marginBottom: 4 },
  filaNosotros: { flexDirection: "row", alignItems: "center", gap: 12 },
  tarjeta: { backgroundColor: colores.superficie, borderRadius: 16, borderWidth: 1, borderColor: colores.borde, padding: 18 },
  tituloTarjeta: { fontSize: 17, fontWeight: "800", color: colores.texto },
  textoTarjeta: { color: colores.textoSuave, marginTop: 4 },
  redes: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  red: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colores.fondoSuave,
  },
  textoRed: { color: colores.primario, fontWeight: "700" },
  pregunta: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colores.borde },
  filaPregunta: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  textoPregunta: { flex: 1, fontWeight: "700", color: colores.texto },
  respuesta: { color: colores.textoSuave, marginTop: 8, lineHeight: 20 },
  pie: { textAlign: "center", fontSize: 12, color: colores.contorno, marginTop: 8 },
});
