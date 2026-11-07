import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeIn,
  ZoomIn,
  ZoomOut,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { PaperButton } from "@/components/paper-button";
import { colors, type as typeStyles } from "@/theme/tokens";

import { avatars, img } from "./assets";

type Props = {
  name: string;
  selected: number | null;
  onSelect: (i: number) => void;
  onDone: () => void;
};

/** Popup "Chọn avatar nào" (416×770): tem lớn xem trước + lưới 3×3 tem nhỏ */
export function AvatarPicker({ name, selected, onSelect, onDone }: Props) {
  const preview = selected ?? 0;
  return (
    <Animated.View
      style={styles.popup}
      entering={ZoomIn.springify().damping(15).stiffness(160)}
      exiting={ZoomOut.duration(200)}
    >
      <Image
        source={img.popupAvatarOuter}
        style={styles.outer}
        contentFit="fill"
      />
      <Image
        source={img.popupAvatarInner}
        style={styles.inner}
        contentFit="fill"
      />
      <Image
        source={img.ribbonAvatar}
        style={styles.ribbon}
        contentFit="fill"
      />

      <View style={styles.content}>
        {/* Tem lớn – đổi avatar thì "dập tem" lại */}
        <View style={styles.big}>
          <Image
            source={img.avatarBigFrame}
            style={styles.bigFrame}
            contentFit="fill"
          />
          <Image
            source={img.avatarBigInner}
            style={styles.bigInner}
            contentFit="fill"
          />
          <Animated.View
            key={preview}
            entering={ZoomIn.springify().damping(10).stiffness(220)}
            style={styles.bigImage}
          >
            <Image
              source={avatars[preview]}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />
          </Animated.View>
        </View>

        <View style={styles.nameTag}>
          <Text style={[typeStyles.input, styles.nameText]} numberOfLines={1}>
            {name}
          </Text>
        </View>

        <View style={styles.grid}>
          {avatars.map((src, i) => (
            <AvatarTile
              key={i}
              source={src}
              selected={selected === i}
              onPress={() => onSelect(i)}
              index={i}
            />
          ))}
        </View>

        <PaperButton
          label="Tiếp theo"
          source={img.btnPrimary}
          width={150}
          height={56}
          imageWidth={154}
          imageHeight={60.3}
          disabled={selected === null}
          onPress={onDone}
        />
      </View>
    </Animated.View>
  );
}

function AvatarTile({
  source,
  selected,
  onPress,
  index,
}: {
  source: number;
  selected: boolean;
  onPress: () => void;
  index: number;
}) {
  const s = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <Animated.View entering={FadeIn.delay(80 + index * 40).duration(260)}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected }}
        accessibilityLabel={`Avatar ${index + 1}`}
        onPressIn={() =>
          (s.value = withSpring(0.92, { damping: 20, stiffness: 400 }))
        }
        onPressOut={() =>
          (s.value = withSpring(1, { damping: 8, stiffness: 260 }))
        }
        onPress={() => {
          if (Platform.OS !== "web") Haptics.selectionAsync();
          s.value = withSequence(
            withTiming(1.08, { duration: 90 }),
            withSpring(1, { damping: 8 }),
          );
          onPress();
        }}
      >
        <Animated.View style={[styles.tile, style]}>
          <Image
            source={selected ? img.avatarFrameSelected : img.avatarFrame}
            style={selected ? styles.tileFrameSel : styles.tileFrame}
            contentFit="fill"
          />
          <Image
            source={img.avatarFrameInner}
            style={styles.tileInner}
            contentFit="fill"
          />
          <Image source={source} style={styles.tileImage} contentFit="cover" />
          {selected ? (
            <Animated.View
              style={styles.check}
              entering={ZoomIn.springify().damping(9).stiffness(260)}
            >
              <Image source={img.avatarCheck} style={StyleSheet.absoluteFill} />
            </Animated.View>
          ) : null}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  popup: { position: "absolute", left: 12, top: 93, width: 416, height: 770 },
  outer: { position: "absolute", left: 0, top: 38, width: 421, height: 735 },
  inner: { position: "absolute", left: 12, top: 65, width: 392, height: 695 },
  ribbon: {
    position: "absolute",
    left: (416 - 257) / 2,
    top: 1,
    width: 257,
    height: 52,
  },
  content: {
    position: "absolute",
    left: 12,
    top: 65,
    width: 392,
    height: 695,
    alignItems: "center",
    paddingTop: 24,
    gap: 24,
  },
  big: { width: 120, height: 120 },
  bigFrame: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 122.7,
    height: 122.7,
  },
  bigInner: {
    position: "absolute",
    left: 6.85,
    top: 6.84,
    width: 106.3,
    height: 106.3,
  },
  bigImage: {
    position: "absolute",
    left: 18.13,
    top: 18.25,
    width: 83.5,
    height: 83.5,
  },
  nameTag: {
    marginTop: -4,
    width: 190,
    height: 48,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: colors.neutral500,
    backgroundColor: colors.neutral50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.neutral800,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  nameText: { textAlign: "center", paddingHorizontal: 12 },
  grid: { width: 344, flexDirection: "row", flexWrap: "wrap", gap: 16 },
  tile: { width: 104, height: 104 },
  tileFrame: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 106.7,
    height: 106.7,
  },
  tileFrameSel: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 105.7,
    height: 105.7,
  },
  tileInner: {
    position: "absolute",
    left: 5.94,
    top: 5.93,
    width: 92,
    height: 92,
  },
  tileImage: {
    position: "absolute",
    left: 15.71,
    top: 15.81,
    width: 72.4,
    height: 72.4,
  },
  check: { position: "absolute", left: 80, top: -8, width: 32, height: 32 },
});
