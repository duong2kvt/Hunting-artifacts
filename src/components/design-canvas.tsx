import { createContext, useContext, type ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { useViewport } from "./viewport";

import { DESIGN } from "@/theme/tokens";

const ScaleContext = createContext(1);
/** Hệ số scale từ đơn vị Figma (440pt) sang màn hình thật */
export const useDesignScale = () => useContext(ScaleContext);

type Props = {
  /** Lớp nền full-bleed (ảnh cover toàn màn hình, không bị letterbox) */
  background?: ReactNode;
  children: ReactNode;
};

/**
 * Đặt nội dung trong một khung 440×956 giống hệt Figma rồi scale vừa màn hình
 * (contain + căn giữa). Nền được render riêng để phủ kín mọi tỉ lệ màn hình.
 */
export function DesignCanvas({
  background,
  children,
  transparent,
}: Props & { transparent?: boolean }) {
  const { width, height } = useViewport();
  const scale = Math.min(width / DESIGN.width, height / DESIGN.height);
  const left = (width - DESIGN.width * scale) / 2;
  const top = (height - DESIGN.height * scale) / 2;

  return (
    <View
      style={[styles.root, transparent && { backgroundColor: "transparent" }]}
      pointerEvents="box-none"
    >
      {background}
      <ScaleContext.Provider value={scale}>
        <View
          style={[
            styles.canvas,
            {
              left,
              top,
              transform: [
                { translateX: (-DESIGN.width * (1 - scale)) / 2 },
                { translateY: (-DESIGN.height * (1 - scale)) / 2 },
                { scale },
              ],
            },
          ]}
        >
          {children}
        </View>
      </ScaleContext.Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#1a120c", overflow: "hidden" },
  canvas: { position: "absolute", width: DESIGN.width, height: DESIGN.height },
});
