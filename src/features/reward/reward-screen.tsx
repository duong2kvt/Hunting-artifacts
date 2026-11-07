import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { DesignCanvas } from "@/components/design-canvas";
import { LightRays } from "@/components/light-effects";
import { ARTIFACTS, WELCOME_TICKET } from "@/data/content";
import { ArtifactStamp } from "@/features/collection/pages";
import { useProfile } from "@/state/profile";
import { ui } from "@/ui/assets";
import { Img, LabelButton, t } from "@/ui/kit";
import { colors, fonts } from "@/theme/tokens";

/**
 * Màn phần thưởng – dựng lại theo 2 video Jitter (Reward.mp4 / Reward ticket.mp4):
 * ribbon hiện → vật phẩm "pop" giữa vầng sáng → tia sáng xoay + lấp lánh → lời nhắn trượt lên → nút hiện.
 */
export function RewardScreen() {
  const { kind = "artifact", id } = useLocalSearchParams<{
    kind?: "artifact" | "ticket";
    id?: string;
  }>();
  const { addTicket, update } = useProfile();
  const artifact = ARTIFACTS.find((a) => a.id === id) ?? ARTIFACTS[0];
  const isTicket = kind === "ticket";

  useEffect(() => {
    if (isTicket) {
      addTicket(WELCOME_TICKET);
      update({ tutorialDone: true });
    }
    if (Platform.OS !== "web") {
      const tm = setTimeout(
        () =>
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
        650,
      );
      return () => clearTimeout(tm);
    }
  }, [isTicket, addTicket, update]);

  return (
    <DesignCanvas
      background={
        <View style={StyleSheet.absoluteFill}>
          <Image
            source={ui.museumArt.src}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: "rgba(20,12,8,0.62)" },
            ]}
          />
        </View>
      }
    >
      <Animated.View
        entering={ZoomIn.delay(200).springify().damping(12)}
        style={{
          position: "absolute",
          left: 66,
          top: 196,
          width: 309,
          height: 62,
        }}
      >
        <Img a={ui.ribbonBlank} scale={1.2} />
        <Text style={styles.ribbon}>
          {isTicket ? "Quà tặng bạn" : "Bạn đã săn được"}
        </Text>
      </Animated.View>

      {/* Vầng sáng + tia sáng xoay */}
      <Animated.View
        entering={FadeIn.delay(650).duration(500)}
        style={{
          position: "absolute",
          left: 220 - 240,
          top: (isTicket ? 456 : 460) - 240,
        }}
        pointerEvents="none"
      >
        <LightRays size={480} rays={12} periodMs={12000} />
      </Animated.View>
      {!isTicket ? (
        <Animated.View
          entering={ZoomIn.delay(450).springify().damping(10)}
          style={styles.halo}
          pointerEvents="none"
        />
      ) : null}

      {isTicket ? (
        <Animated.View
          entering={ZoomIn.delay(500).springify().damping(9).stiffness(150)}
          style={{ position: "absolute", left: 58, top: 378 }}
        >
          <View style={{ transform: [{ rotate: "-3deg" }] }}>
            <Img a={ui.ticket1} style={{ position: "relative" }} />
            <Text
              style={[
                t.h16,
                {
                  position: "absolute",
                  left: 14,
                  top: 9,
                  color: colors.neutral950,
                },
              ]}
            >
              {WELCOME_TICKET.title}
            </Text>
            <Text
              style={[
                t.body14,
                {
                  position: "absolute",
                  left: 14,
                  top: 41,
                  width: 208,
                  color: colors.chatText,
                },
              ]}
            >
              {WELCOME_TICKET.description}
            </Text>
            <Text
              style={[
                t.body14,
                { position: "absolute", left: 22, top: 111, color: "#3F7D20" },
              ]}
            >
              EXP: {WELCOME_TICKET.expires}
            </Text>
            <Text
              style={[
                t.h16,
                {
                  position: "absolute",
                  left: 206,
                  top: 108,
                  width: 104,
                  textAlign: "right",
                  color: "#3F7D20",
                },
              ]}
            >
              Dùng ngay
            </Text>
          </View>
        </Animated.View>
      ) : (
        <Animated.View
          entering={ZoomIn.delay(550).springify().damping(9).stiffness(150)}
          style={{ position: "absolute", left: 148, top: 366 }}
        >
          <View style={{ transform: [{ rotate: "-6deg" }] }}>
            <ArtifactStamp
              index={artifact.stamp}
              name={artifact.name}
              no={artifact.no}
              unlocked
            />
          </View>
        </Animated.View>
      )}

      <Sparkles />

      <Animated.View
        entering={FadeInDown.delay(1300).springify().damping(14)}
        style={{ position: "absolute", left: 64, top: 640 }}
      >
        <View style={styles.quote}>
          <Img a={ui.guideAvatar} style={{ position: "relative" }} />
          <Text style={[t.italic14, { flex: 1 }]}>
            {isTicket
              ? "“Địa chỉ tại số 2 Nguyễn Bỉnh Khiêm, Phường Bến Nghé”"
              : (artifact.details?.quote ??
                "“Một mảnh ghép mới cho bộ sưu tập của bạn!”")}
          </Text>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeIn.delay(1800).duration(400)}
        style={StyleSheet.absoluteFill}
        pointerEvents="box-none"
      >
        {isTicket ? (
          <LabelButton
            a={ui.btnYellow}
            label="Về bảo tàng"
            x={132}
            y={836}
            textStyle={styles.btn}
            onPress={() => router.replace("/museum")}
          />
        ) : (
          <>
            <LabelButton
              a={ui.btnWhite}
              label="Về bảo tàng"
              x={36}
              y={836}
              textStyle={styles.btn}
              onPress={() => router.replace("/museum")}
            />
            <LabelButton
              a={ui.btnYellow}
              label="Xem cổ vật"
              x={226}
              y={836}
              textStyle={styles.btn}
              onPress={() => router.replace("/collection")}
            />
          </>
        )}
      </Animated.View>
    </DesignCanvas>
  );
}

const SPARKS = [
  { x: 92, y: 330, s: 16, d: 900 },
  { x: 338, y: 310, s: 12, d: 1050 },
  { x: 70, y: 560, s: 12, d: 1200 },
  { x: 356, y: 520, s: 18, d: 980 },
  { x: 120, y: 640, s: 10, d: 1300 },
  { x: 300, y: 650, s: 10, d: 1150 },
];

function Sparkles() {
  return (
    <>
      {SPARKS.map((p, i) => (
        <Spark key={i} {...p} />
      ))}
    </>
  );
}

function Spark({ x, y, s, d }: { x: number; y: number; s: number; d: number }) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withDelay(
      d,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) }),
          withTiming(0.2, { duration: 700 }),
        ),
        -1,
        true,
      ),
    );
  }, [v, d]);
  const st = useAnimatedStyle(() => ({
    opacity: v.value,
    transform: [{ scale: 0.5 + v.value * 0.6 }, { rotate: "45deg" }],
  }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          left: x,
          top: y,
          width: s,
          height: s,
          backgroundColor: "#FFF6C8",
          borderRadius: 2,
          shadowColor: "#F5D558",
          shadowOpacity: 1,
          shadowRadius: 8,
        },
        st,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  ribbon: {
    position: "absolute",
    left: 30,
    right: 30,
    top: 14,
    textAlign: "center",
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 32,
    color: colors.neutral50,
  },
  halo: {
    position: "absolute",
    left: 220 - 118,
    top: 460 - 118,
    width: 236,
    height: 236,
    borderRadius: 118,
    backgroundColor: "rgba(243,215,120,0.55)",
    borderWidth: 3,
    borderColor: "rgba(255,240,180,0.8)",
    shadowColor: "#F5D558",
    shadowOpacity: 0.9,
    shadowRadius: 30,
  },
  quote: {
    width: 312,
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 4,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.neutral300,
    shadowColor: colors.neutral800,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    transform: [{ rotate: "-2deg" }],
  },
  btn: { fontSize: 20, lineHeight: 28 },
});
