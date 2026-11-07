import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";

import { DesignCanvas } from "@/components/design-canvas";
import { avatars, img } from "@/features/onboarding/assets";
import { useProfile } from "@/state/profile";
import { colors, fonts } from "@/theme/tokens";

/** Placeholder cho section "Main" – sẽ dựng ở bước tiếp theo */
export default function HomeScreen() {
  const { name, avatar } = useProfile();
  return (
    <DesignCanvas
      background={
        <View style={StyleSheet.absoluteFill}>
          <Image
            source={img.bgMuseum}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: "rgba(0,0,0,0.6)" },
            ]}
          />
        </View>
      }
    >
      <View style={styles.center}>
        <Animated.View
          entering={ZoomIn.springify().damping(12)}
          style={styles.stamp}
        >
          <Image source={img.avatarBigFrame} style={styles.frame} />
          <Image source={img.avatarBigInner} style={styles.inner} />
          {avatar !== null ? (
            <Image
              source={avatars[avatar]}
              style={styles.avatar}
              contentFit="cover"
            />
          ) : null}
        </Animated.View>
        <Animated.Text entering={FadeInDown.delay(200)} style={styles.title}>
          {name || "Nhà thám hiểm"}
        </Animated.Text>
        <Animated.View entering={FadeInDown.delay(320)}>
          <Text style={styles.sub}>
            Màn hình chính (Main) sẽ được dựng ở bước tiếp theo.
          </Text>
        </Animated.View>
      </View>
    </DesignCanvas>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    paddingHorizontal: 40,
  },
  stamp: { width: 120, height: 120 },
  frame: { position: "absolute", width: 122.7, height: 122.7 },
  inner: {
    position: "absolute",
    left: 6.85,
    top: 6.84,
    width: 106.3,
    height: 106.3,
  },
  avatar: {
    position: "absolute",
    left: 18.13,
    top: 18.25,
    width: 83.5,
    height: 83.5,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 44,
    color: colors.neutral50,
  },
  sub: {
    fontFamily: fonts.inter,
    fontSize: 15,
    color: colors.neutral100,
    textAlign: "center",
    lineHeight: 22,
  },
});
