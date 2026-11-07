import { Image } from "expo-image";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { DesignCanvas } from "@/components/design-canvas";
import { ui } from "@/ui/assets";
import { Header, Img } from "@/ui/kit";
import { colors } from "@/theme/tokens";

/** "Scanning": ảnh vừa chụp + tia quét chạy dọc + lời nhắn của Giáo sư Zũ */
export function ScanningScreen({
  uri,
  fallback,
  onBack,
}: {
  uri: string | null;
  fallback: "far" | "close";
  onBack?: () => void;
}) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withRepeat(
      withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [p]);
  const beam = useAnimatedStyle(() => ({
    transform: [{ translateY: p.value * 500 }],
  }));

  const src = uri
    ? { uri }
    : fallback === "close"
      ? ui.scanning.src
      : ui.photoFar.src;

  return (
    <DesignCanvas
      background={
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: colors.neutral100 },
          ]}
        />
      }
    >
      <Header title="Scan cổ vật" x={24} y={64} width={392} onBack={onBack} />
      <Animated.View entering={FadeIn.duration(300)} style={styles.photo}>
        <Image
          source={src}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
        <Animated.View style={[styles.beam, beam]} />
      </Animated.View>
      <Animated.View
        entering={FadeInUp.delay(250).springify().damping(14)}
        style={{
          position: "absolute",
          left: 45,
          top: 712,
          width: 351,
          height: 165,
        }}
      >
        <Img a={ui.guideChat} />
        <Text style={[styles.title]}>Ồ, góc chụp đẹp đấy!</Text>
        <Text style={styles.body}>
          Đang scan và phân tích cổ vật… Chờ ta chút xíu!
        </Text>
        <Img a={ui.guideAvatarBig} x={252} y={13} />
      </Animated.View>
    </DesignCanvas>
  );
}

const styles = StyleSheet.create({
  photo: {
    position: "absolute",
    left: 24,
    top: 144,
    width: 392,
    height: 528,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  beam: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 28,
    backgroundColor: "rgba(245,213,88,0.35)",
    borderBottomWidth: 2,
    borderColor: "#F5D558",
    shadowColor: "#F5D558",
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    position: "absolute",
    left: 20,
    top: 18,
    fontFamily: "Inter_700Bold_Italic",
    fontSize: 16,
    lineHeight: 24,
    color: colors.chatText,
  },
  body: {
    position: "absolute",
    left: 20,
    top: 46,
    width: 222,
    fontFamily: "Inter_500Medium_Italic",
    fontSize: 16,
    lineHeight: 24,
    color: colors.chatText,
  },
});
