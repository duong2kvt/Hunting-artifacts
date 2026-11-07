import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";

import { DesignCanvas } from "@/components/design-canvas";
import { MascotDialog } from "@/features/shared/mascot-dialog";
import { useProfile } from "@/state/profile";

import { CameraStage, type CameraStageHandle } from "./camera-stage";
import { recognizeArtifact } from "./recognize";
import { ScanningScreen } from "./scanning";

type Phase = "camera" | "scanning" | "fail";

/** Luồng "Hunt artifact": chụp → scan → (thất bại → chụp lại) → thành công → phần thưởng */
export function HuntFlow() {
  const { collect } = useProfile();
  const [phase, setPhase] = useState<Phase>("camera");
  const [attempt, setAttempt] = useState(0);
  const [uri, setUri] = useState<string | null>(null);
  const cam = useRef<CameraStageHandle>(null);
  const fallback = attempt === 0 ? "close" : "far";
  const back = () =>
    router.canGoBack() ? router.back() : router.replace("/museum");

  const shoot = async () => {
    const shot = (await cam.current?.capture()) ?? null;
    setUri(shot);
    setPhase("scanning");
    const res = await recognizeArtifact({ uri: shot, attempt });
    if (res.ok) {
      if (Platform.OS !== "web")
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      collect(res.artifactId);
      router.replace({
        pathname: "/reward",
        params: { kind: "artifact", id: res.artifactId },
      });
    } else {
      if (Platform.OS !== "web")
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setPhase("fail");
    }
  };

  if (phase === "camera")
    return (
      <CameraStage
        ref={cam}
        fallback={fallback}
        onShutter={shoot}
        onBack={back}
      />
    );

  return (
    <View style={StyleSheet.absoluteFill}>
      <ScanningScreen
        uri={uri}
        fallback={fallback}
        onBack={() => setPhase("camera")}
      />
      {phase === "fail" ? (
        <View style={StyleSheet.absoluteFill}>
          <DesignCanvas transparent>
            <MascotDialog
              dim={0.8}
              lines={[
                {
                  text: "Chưa thể nhận diện được cổ vật vì góc chụp chưa tối ưu. Hãy thử chụp lại nhé",
                  pose: "think",
                },
              ]}
              onDone={() => {
                setAttempt((a) => a + 1);
                setUri(null);
                setPhase("camera");
              }}
            />
          </DesignCanvas>
        </View>
      ) : null}
    </View>
  );
}
