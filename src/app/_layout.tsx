import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_500Medium_Italic,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_700Bold_Italic,
} from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { DeviceFrame } from "@/components/device-frame";
import { SkiaReady } from "@/components/skia-ready";
import { ProfileProvider, useProfile } from "@/state/profile";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    "YoungDisplay-Bold": require("@/assets/fonts/YoungDisplay-Bold.otf"),
    Inter_400Regular,
    Inter_500Medium,
    Inter_500Medium_Italic,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_700Bold_Italic,
  });

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DeviceFrame>
        <SkiaReady>
          <ProfileProvider>
            <StatusBar style="light" />
            <Gate />
          </ProfileProvider>
        </SkiaReady>
      </DeviceFrame>
    </GestureHandlerRootView>
  );
}

/** Chờ đọc xong tiến trình đã lưu rồi mới ẩn splash */
function Gate() {
  const { ready } = useProfile();
  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);
  if (!ready) return null;
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        contentStyle: { backgroundColor: "#1a120c" },
      }}
    >
      <Stack.Screen
        name="museum/[id]/index"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="museum/[id]/info"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="museum/[id]/history"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="museum/[id]/artifacts"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="museum/[id]/architecture"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="collection/[id]"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="profile/tickets"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen name="hunt" options={{ animation: "fade_from_bottom" }} />
    </Stack>
  );
}
