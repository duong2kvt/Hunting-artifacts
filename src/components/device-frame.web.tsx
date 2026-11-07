import { type ReactNode } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";

import { ViewportContext } from "./viewport";


const PHONE = { width: 440, height: 956 };
const BEZEL = 12;

/**
 * Web demo: trên màn hình rộng (desktop/tablet ngang) app được đặt trong khung điện thoại
 * căn giữa, để trình diễn như một mobile app thật. Trên điện thoại (web mobile) vẫn full màn hình.
 */
export function DeviceFrame({ children }: { children: ReactNode }) {
  const win = useWindowDimensions();
  const isDesktop = win.width >= 640 && win.width > win.height * 0.75;
  if (!isDesktop) return <>{children}</>;

  const maxH = win.height - 48;
  const scale = Math.min(1, maxH / (PHONE.height + BEZEL * 2));
  const w = Math.round(PHONE.width * scale);
  const h = Math.round(PHONE.height * scale);

  return (
    <View style={styles.stage}>
      <View style={[styles.phone, { width: w + BEZEL * 2, height: h + BEZEL * 2, borderRadius: 56 * scale + BEZEL }]}>
        <View style={[styles.screen, { width: w, height: h, borderRadius: 48 * scale }]}>
          <ViewportContext.Provider value={{ width: w, height: h }}>{children}</ViewportContext.Provider>
          <View pointerEvents="none" style={[styles.island, { width: 120 * scale, height: 34 * scale, borderRadius: 17 * scale, top: 10 * scale }]} />
        </View>
        <View style={[styles.btn, { left: -3, top: 180 * scale, height: 60 * scale }]} />
        <View style={[styles.btn, { left: -3, top: 260 * scale, height: 60 * scale }]} />
        <View style={[styles.btn, { right: -3, top: 220 * scale, height: 96 * scale }]} />
      </View>
      <Text style={styles.caption}>Truy Tìm Cổ Vật · bản demo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#16100B",
    // nền ấm, ăn tông với app
    backgroundImage: "radial-gradient(circle at 50% 35%, #3B2A1D 0%, #16100B 70%)",
  } as object,
  phone: {
    backgroundColor: "#0B0B0C",
    padding: BEZEL,
    shadowColor: "#000",
    shadowOpacity: 0.6,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 20 },
    borderWidth: 1,
    borderColor: "#2A2A2E",
  },
  screen: { overflow: "hidden", backgroundColor: "#1a120c", transform: [{ translateZ: 0 }] } as object,
  island: { position: "absolute", alignSelf: "center", backgroundColor: "#000" },
  btn: { position: "absolute", width: 4, backgroundColor: "#1E1E22", borderRadius: 2 },
  caption: { marginTop: 14, color: "rgba(244,240,237,0.45)", fontFamily: "Inter_500Medium", fontSize: 13 },
});
