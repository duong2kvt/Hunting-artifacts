import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { DesignCanvas } from "@/components/design-canvas";
import { PaperButton } from "@/components/paper-button";
import { useProfile } from "@/state/profile";
import { colors, fonts, type as typeStyles } from "@/theme/tokens";

import { ArtifactReveal } from "./artifact-reveal";
import { img, SCRIPT } from "./assets";
import { AvatarPicker } from "./avatar-picker";
import { MascotGuide } from "./mascot-guide";
import { NamePopup } from "./name-popup";

type Phase = "loading" | "start" | "entering" | "dialog" | "name" | "avatar";

const LOADING_MS = 2400;

/**
 * Luồng Onboarding (Figma section "Onboarding"):
 * Loading → Bắt đầu → vào bảo tàng → 6 câu thoại của Giáo sư Zũ → nhập tên → chọn avatar.
 * Dùng một màn hình + state machine để nền/mascot chuyển cảnh liền mạch như Smart Animate.
 */
export function OnboardingFlow() {
  const { name, avatar, setName, setAvatar } = useProfile();
  const [phase, setPhase] = useState<Phase>("loading");
  const [line, setLine] = useState(0);
  const [typed, setTyped] = useState(false);
  const [pct, setPct] = useState(0);

  // 0 = màn splash, 1 = đã vào bảo tàng
  const enter = useSharedValue(0);
  const dim = useSharedValue(0);
  const bar = useSharedValue(0);

  // ---- Loading 0 → 100% ----
  useEffect(() => {
    bar.value = withTiming(1, {
      duration: LOADING_MS,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
    const t0 = Date.now();
    const id = setInterval(() => {
      const p = Math.min(1, (Date.now() - t0) / LOADING_MS);
      // khớp với easing của thanh (xấp xỉ ease-out)
      setPct(Math.round(100 * (1 - Math.pow(1 - p, 2.2))));
      if (p >= 1) {
        clearInterval(id);
        setTimeout(() => setPhase("start"), 250);
      }
    }, 50);
    return () => clearInterval(id);
  }, [bar]);

  const startJourney = useCallback(() => {
    setPhase("entering");
    // splash phóng to + mờ dần như bước qua cánh cửa, bảo tàng hiện ra rồi tối lại
    enter.value = withTiming(1, {
      duration: 900,
      easing: Easing.inOut(Easing.cubic),
    });
    dim.value = withDelay(700, withTiming(1, { duration: 500 }));
    setTimeout(() => {
      setLine(0);
      setTyped(false);
      setPhase("dialog");
    }, 1050);
  }, [enter, dim]);

  const advance = useCallback(() => {
    if (phase !== "dialog") return;
    if (!typed) {
      setTyped(true); // chạm lần 1: hiện hết câu
      return;
    }
    if (Platform.OS !== "web")
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    if (line < SCRIPT.length - 1) {
      setLine((l) => l + 1);
      setTyped(false);
    } else {
      setPhase("name");
    }
  }, [phase, typed, line]);

  const skip = useCallback(() => setPhase("name"), []);

  const splashStyle = useAnimatedStyle(() => ({
    opacity: 1 - enter.value,
    transform: [
      { scale: 1 + enter.value * 0.35 },
      { translateY: enter.value * 60 },
    ],
  }));
  const museumStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [{ scale: 1.12 - enter.value * 0.12 }],
  }));
  const dimStyle = useAnimatedStyle(() => ({ opacity: dim.value * 0.6 }));
  const barStyle = useAnimatedStyle(() => ({
    width: 6 + bar.value * (388 - 6),
  }));

  const scene = SCRIPT[line];
  const showDialog = phase === "dialog";

  return (
    <DesignCanvas
      background={
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Animated.View style={[StyleSheet.absoluteFill, museumStyle]}>
            <Image
              source={img.bgMuseum}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />
          </Animated.View>
          <Animated.View style={[StyleSheet.absoluteFill, splashStyle]}>
            <Image
              source={img.bgSplash}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />
          </Animated.View>
          <Animated.View
            style={[StyleSheet.absoluteFill, styles.scrim, dimStyle]}
          />
        </View>
      }
    >
      {showDialog && scene.artifact ? <ArtifactReveal /> : null}

      {phase === "loading" ? (
        <Animated.View style={styles.loading} exiting={FadeOut.duration(200)}>
          <View style={styles.loadingTrack}>
            <Animated.View style={[styles.loadingFill, barStyle]} />
          </View>
          <Text style={styles.pct}>{pct}%</Text>
        </Animated.View>
      ) : null}

      {phase === "start" ? <StartButton onPress={startJourney} /> : null}

      {showDialog ? (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          {/* vùng chạm toàn màn hình để chuyển câu thoại */}
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={advance}
            accessibilityLabel="Chạm để tiếp tục"
          />
          <MascotGuide
            pose={scene.pose}
            text={scene.text}
            lineKey={line}
            instant={typed}
            onTyped={() => setTyped(true)}
          />
          <Animated.View style={styles.skip} entering={FadeIn.delay(400)}>
            <PaperButton
              source={img.btnSkip}
              width={76}
              height={40}
              imageWidth={78.7}
              imageHeight={42.7}
              onPress={skip}
            />
          </Animated.View>
        </View>
      ) : null}

      {phase === "name" ? (
        <NamePopup
          initial={name}
          onSubmit={(v) => {
            setName(v);
            setPhase("avatar");
          }}
        />
      ) : null}

      {phase === "avatar" ? (
        <AvatarPicker
          name={name}
          selected={avatar}
          onSelect={setAvatar}
          onDone={() => router.replace("/home")}
        />
      ) : null}
    </DesignCanvas>
  );
}

function StartButton({ onPress }: { onPress: () => void }) {
  const breathe = useSharedValue(0);
  useEffect(() => {
    breathe.value = withDelay(
      600,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 900 }),
          withTiming(0, { duration: 900 }),
        ),
        -1,
        false,
      ),
    );
  }, [breathe]);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + breathe.value * 0.04 }],
  }));
  return (
    <Animated.View
      style={styles.start}
      entering={ZoomIn.springify().damping(10).stiffness(180)}
      exiting={FadeOut.duration(180)}
    >
      <Animated.View style={style}>
        <PaperButton
          label="Bắt đầu"
          source={img.btnStart}
          width={216}
          height={84}
          imageWidth={220.3}
          imageHeight={86}
          textStyle={typeStyles.buttonXL}
          onPress={onPress}
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  scrim: { backgroundColor: "#000" },
  loading: { position: "absolute", left: 26, top: 857, width: 388, height: 49 },
  loadingTrack: {
    width: 388,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.neutral500,
    backgroundColor: colors.neutral50,
    overflow: "hidden",
    shadowColor: colors.neutral800,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  loadingFill: {
    position: "absolute",
    left: -2,
    top: -2,
    bottom: -2,
    borderRadius: 12,
    backgroundColor: colors.accent500,
  },
  pct: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 10,
    textAlign: "center",
    fontFamily: fonts.display,
    fontSize: 20,
    lineHeight: 28,
    color: colors.neutral950,
  },
  start: { position: "absolute", left: (440 - 216) / 2, top: 829 },
  skip: { position: "absolute", left: 340, top: 64 },
});
