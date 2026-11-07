import * as Haptics from "expo-haptics";
import { Image, type ImageSource } from "expo-image";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { type as typeStyles } from "@/theme/tokens";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  label?: string;
  /** ảnh nền giấy xuất từ Figma (đã gồm viền + bóng đổ) */
  source: ImageSource | number;
  /** kích thước khung nút trong Figma */
  width: number;
  height: number;
  /** kích thước ảnh nền (render bounds, có bóng) */
  imageWidth: number;
  imageHeight: number;
  disabled?: boolean;
  onPress?: () => void;
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
};

/** Nút giấy vàng: nhún xuống khi chạm (spring) + haptic nhẹ */
export function PaperButton({
  label,
  source,
  width,
  height,
  imageWidth,
  imageHeight,
  disabled,
  onPress,
  textStyle,
  style,
}: Props) {
  const pressed = useSharedValue(0);
  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: 1 - pressed.value * 0.06 },
      { translateY: pressed.value * 2 },
    ],
    opacity: withTiming(disabled ? 0.5 : 1, { duration: 180 }),
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPressIn={() => {
        pressed.value = withSpring(1, { damping: 20, stiffness: 400 });
      }}
      onPressOut={() => {
        pressed.value = withSpring(0, { damping: 9, stiffness: 260 });
      }}
      onPress={() => {
        if (Platform.OS !== "web")
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.();
      }}
      style={[
        { width, height, alignItems: "center", justifyContent: "center" },
        style,
        animStyle,
      ]}
    >
      <Image
        source={source}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: imageWidth,
          height: imageHeight,
        }}
        contentFit="fill"
      />
      {label ? (
        <Text style={[typeStyles.button, styles.label, textStyle]}>
          {label}
        </Text>
      ) : null}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  label: { textAlign: "center", includeFontPadding: false },
});
