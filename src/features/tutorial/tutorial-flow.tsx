import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeInUp, ZoomIn } from "react-native-reanimated";

import { PaperButton } from "@/components/paper-button";
import { TypewriterText } from "@/components/typewriter-text";
import {
  img as onboardingImg,
  type MascotPose,
} from "@/features/onboarding/assets";
import { MascotGuide } from "@/features/onboarding/mascot-guide";
import { CameraStage } from "@/features/hunt/camera-stage";
import { MuseumCards } from "@/features/museum/museum-cards";
import { useProfile } from "@/state/profile";
import { ui } from "@/ui/assets";
import { BookPage, Dimmer, Img, NavBar, tapHaptic } from "@/ui/kit";

type Step =
  | { kind: "guide"; text: string; pose: MascotPose; selected?: boolean }
  | { kind: "bubble"; text: string; tap?: boolean }
  | { kind: "camera"; text: string };

/** Luồng Tutorial (Figma section "Tutorial": Scene 1 → 9 + Guide take photo 1 → 5 + Reward ticket) */
export function TutorialFlow() {
  const { name } = useProfile();
  const who = name || "bạn";
  const steps: Step[] = [
    {
      kind: "guide",
      pose: "happy",
      text: `Chào mừng ${who}. Từ hôm nay, hành trình truy tìm cổ vật chính thức bắt đầu.`,
    },
    {
      kind: "guide",
      pose: "welcome",
      text: "Trước hết hãy để ta hướng dẫn cậu những tính năng thú vị nhất nhé!",
    },
    {
      kind: "bubble",
      text: "Tính năng đầu tiên và quan trọng nhất là Săn Ngay!",
    },
    {
      kind: "bubble",
      text: "Đây chính là cách để cậu thu thập cổ vật và bỏ vào bộ sưu tập của mình",
    },
    { kind: "bubble", text: "Chạm vào “Săn ngay” để thử nhé!", tap: true },
    { kind: "camera", text: "Đây chính là giao diện Săn Cổ Vật" },
    {
      kind: "camera",
      text: "Hãy chụp thật rõ và bao quát nhiều nhất có thể cổ vật trước mặt.",
    },
    {
      kind: "camera",
      text: "Góc đẹp, ánh sáng tốt sẽ giúp App nhận diện dễ dàng hơn",
    },
    {
      kind: "camera",
      text: `Nhớ nè ${who}: Phải đến trực tiếp bảo tàng và bật định vị nhé!`,
    },
    {
      kind: "camera",
      text: "Chỉ khi đứng ngay trước cổ vật thật, bạn mới có thể săn tìm được chúng!",
    },
    {
      kind: "guide",
      pose: "happy",
      text: "Tuyệt vời! Cậu đã nắm vững cách săn cổ vật rồi.",
    },
    {
      kind: "guide",
      pose: "welcome",
      text: "Ngoài săn cổ vật, cậu còn có thể Khám phá Bảo tàng bất cứ lúc nào!",
    },
    {
      kind: "guide",
      pose: "point",
      selected: true,
      text: "Và hãy luôn nhớ Hành trình săn cổ vật chỉ thực sự trọn vẹn khi cậu đến tận nơi.",
    },
    {
      kind: "guide",
      pose: "point",
      text: "Sẵn sàng chưa nhà khảo cổ trẻ? ta đang đợi cậu ở bảo tàng đấy!",
    },
  ];
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState(false);
  const step = steps[i];

  const finish = () =>
    router.replace({ pathname: "/reward", params: { kind: "ticket" } });
  const next = (force = false) => {
    if (!typed && !force) return setTyped(true);
    if (step.kind === "bubble" && step.tap && !force) return; // phải chạm vào "Săn ngay"
    tapHaptic();
    if (i >= steps.length - 1) return finish();
    setI(i + 1);
    setTyped(false);
  };

  if (step.kind === "camera") {
    return (
      <CameraStage fallback="far" shutterDisabled onBack={() => next(true)}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => next()}
          accessibilityLabel="Chạm để tiếp tục"
        />
        <Animated.View
          entering={FadeInUp.springify().damping(14)}
          pointerEvents="none"
          style={{
            position: "absolute",
            left: 45,
            top: 714,
            width: 351,
            height: 165,
          }}
        >
          <Img a={ui.guideChat} />
          <View style={{ position: "absolute", left: 20, top: 26, width: 226 }}>
            <TypewriterText
              key={i}
              text={step.text}
              instant={typed}
              onDone={() => setTyped(true)}
              style={{ fontSize: 16, lineHeight: 22 }}
            />
          </View>
          <Img a={ui.guideAvatarBig} x={252} y={13} />
        </Animated.View>
      </CameraStage>
    );
  }

  const isBubble = step.kind === "bubble";
  return (
    <BookPage
      nav={false}
      overlay={
        <>
          <Dimmer opacity={0.8} />
          {step.kind === "guide" && step.selected ? (
            <Animated.View
              entering={ZoomIn.springify().damping(12)}
              style={{ position: "absolute", left: 2, top: 75 }}
              pointerEvents="none"
            >
              <Img a={ui.museumSelected} />
            </Animated.View>
          ) : null}
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => next()}
            accessibilityLabel="Chạm để tiếp tục"
          />
          {isBubble ? (
            <>
              <Animated.View
                key="mascot"
                entering={ZoomIn.springify().damping(12)}
                pointerEvents="none"
                style={{ position: "absolute", left: 183, top: 507 }}
              >
                <Img a={ui.mascotSmall} />
              </Animated.View>
              <Animated.View
                key={`b${i}`}
                entering={FadeIn.duration(220)}
                pointerEvents="none"
                style={{
                  position: "absolute",
                  left: 87,
                  top: 407,
                  width: 315,
                  height: 131,
                }}
              >
                <Img a={ui.bubbleTop} />
                <View
                  style={{
                    position: "absolute",
                    left: 12,
                    top: 20,
                    width: 286,
                  }}
                >
                  <TypewriterText
                    text={step.text}
                    instant={typed}
                    onDone={() => setTyped(true)}
                  />
                </View>
              </Animated.View>
              <NavBar
                active="museum"
                highlight={i >= 2 ? "hunt" : undefined}
                onTab={(k) => (k === "hunt" ? next(true) : undefined)}
              />
            </>
          ) : (
            <MascotGuide
              pose={step.pose}
              text={step.text}
              lineKey={i}
              instant={typed}
              onTyped={() => setTyped(true)}
            />
          )}
          <Animated.View
            entering={FadeIn.delay(300)}
            style={{ position: "absolute", left: 340, top: 64 }}
          >
            <PaperButton
              source={onboardingImg.btnSkip}
              width={76}
              height={40}
              imageWidth={78.7}
              imageHeight={42.7}
              onPress={finish}
            />
          </Animated.View>
        </>
      }
    >
      <MuseumCards ids={["btp-hcm", "bt-vung-tau", "btls-hcm"]} />
      {!isBubble ? <NavBar active="museum" /> : null}
    </BookPage>
  );
}
