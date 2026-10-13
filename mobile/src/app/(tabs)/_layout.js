import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

import Encabezado from "../../components/Encabezado";
import { colores } from "../../tema";

const PESTANAS = [
  { name: "index", title: "Inicio", icono: "home" },
  { name: "catalogo", title: "Colección", icono: "grid" },
  { name: "contacto", title: "Contacto", icono: "chatbubbles" },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        header: ({ options }) => <Encabezado titulo={options.title === "Inicio" ? "" : options.title} />,
        tabBarActiveTintColor: colores.primario,
        tabBarInactiveTintColor: colores.contorno,
        tabBarLabelStyle: { fontWeight: "700", fontSize: 11 },
        tabBarStyle: { borderTopColor: colores.borde },
        sceneStyle: { backgroundColor: colores.fondo },
      }}
    >
      {PESTANAS.map((p) => (
        <Tabs.Screen
          key={p.name}
          name={p.name}
          options={{
            title: p.title,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? p.icono : `${p.icono}-outline`} size={22} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
