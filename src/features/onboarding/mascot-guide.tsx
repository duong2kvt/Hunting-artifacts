import { Image } from "expo-image";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { TypewriterText } from "@/components/typewriter-text";
import { motion } from "@/theme/tokens";

import { img, mascot, type MascotPose } from "./assets";

type Props = {
  pose: MascotPose;
  text: string;
  /** đổi key → reset typewriter (cùng câu nhưng phát lại) */
  lineKey: number;
  instant: boolean;
  onTyped: () => void;
};

/**
 * "Mascot Guide" (371×419, đặt cách đáy 40pt): Giáo sư Zũ + khung hội thoại giấy.
 * - Vào màn: trượt lên từ đáy với spring.
 * - Đổi biểu cảm: crossfade + nảy nhẹ.
 * - Idle: thở / bập bềnh nhẹ để nhân vật không bị "chết".
 */
export function MascotGuide({ pose, text, lineKey, instant, onTyped }: Props) {
  const bob = useSharedValue(0);
  const pop = useSharedValue(1);

  useEffect(() => {
    bob.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [bob]);

  // mỗi câu mới → nhân vật "nảy" như đang nói
  useEffect(() => {
    pop.value = withSequence(
      withTiming(1.04, { duration: 120 }),
      withSpring(1, motion.spring),
    );
  }, [lineKey, pop]);

  const mascotStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -4 * bob.value }, { scale: pop.value }],
  }));

  return (
    <Animated.View
      style={styles.guide}
      pointerEvents="none"
      entering={SlideInDown.springify().damping(16).stiffness(140)}
      exiting={SlideOutDown.duration(320)}
    >
      <Animated.View style={[styles.mascot, mascotStyle]}>
        <Animated.View
          key={pose}
          entering={FadeIn.duration(220)}
          exiting={FadeOut.duration(160)}
          style={StyleSheet.absoluteFill}
        >
          <Image
            source={mascot[pose]}
            style={StyleSheet.absoluteFill}
            contentFit="contain"
          />
        </Animated.View>
      </Animated.View>

      <View style={styles.panel}>
        <Image
          source={img.chatPanel}
          style={StyleSheet.absoluteFill}
          contentFit="fill"
        />
        <View style={styles.textBox}>
          <TypewriterText
            key={lineKey}
            text={text}
            instant={instant}
            startDelay={260}
            onDone={onTyped}
          />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  guide: {
    position: "absolute",
    left: 34.5,
    top: 497,
    width: 371,
    height: 419,
  },
  mascot: {
    position: "absolute",
    left: -49,
    top: 0,
    width: 355.3,
    height: 348.7,
  },
  panel: {
    position: "absolute",
    left: 0,
    top: 225,
    width: 373.3,
    height: 200.3,
  },
  textBox: { position: "absolute", left: 22, top: 60, width: 318 },
});
