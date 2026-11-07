import { Image } from "expo-image";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { LightBeam, LightRays } from "@/components/light-effects";

import { img } from "./assets";

/**
 * "Graphic asset" (Scene 3–4): cột sáng chiếu xuống + tờ giấy cổ vật "Đầu chim phượng"
 * với tia sáng xoay phía sau. Frame gốc 328×623 tại (56, -150).
 */
export function ArtifactReveal() {
  const float = useSharedValue(0);
  useEffect(() => {
    float.value = withRepeat(
      withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [float]);
  const floatStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -6 * float.value },
      { rotate: `${(float.value - 0.5) * 2}deg` },
    ],
  }));

  return (
    <Animated.View
      style={styles.frame}
      entering={FadeIn.duration(450)}
      exiting={FadeOut.duration(250)}
      pointerEvents="none"
    >
      <View style={StyleSheet.absoluteFill}>
        <LightBeam />
      </View>
      <Animated.View
        style={styles.rays}
        entering={FadeIn.delay(250).duration(600)}
      >
        <LightRays />
      </Animated.View>
      <Animated.View
        style={styles.sheet}
        entering={ZoomIn.delay(120).springify().damping(11).stiffness(160)}
      >
        <Animated.View style={[StyleSheet.absoluteFill, floatStyle]}>
          <Image
            source={img.artifactSheet}
            style={StyleSheet.absoluteFill}
            contentFit="contain"
          />
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  frame: { position: "absolute", left: 56, top: -150, width: 328, height: 623 },
  rays: {
    position: "absolute",
    left: 164 - 200,
    top: 470.5 - 200,
    width: 400,
    height: 400,
  },
  sheet: {
    position: "absolute",
    left: 60,
    top: 356,
    width: 211,
    height: 229.7,
  },
});
