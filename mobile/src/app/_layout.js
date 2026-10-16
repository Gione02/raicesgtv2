import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { CatalogoProvider } from "../datos/CatalogoContext";
import { colores } from "../tema";

function FondoCabecera() {
  return (
    <LinearGradient
      colors={[colores.indigo, colores.indigoMedio, colores.primario]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ flex: 1 }}
    />
  );
}

export default function RootLayout() {
  return (
    <CatalogoProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerBackground: () => <FondoCabecera />,
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "800" },
          contentStyle: { backgroundColor: colores.fondo },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="producto/[id]" options={{ title: "Producto", headerBackTitle: "Volver" }} />
        <Stack.Screen name="nosotros" options={{ title: "Sobre nosotros", headerBackTitle: "Volver" }} />
      </Stack>
    </CatalogoProvider>
  );
}
