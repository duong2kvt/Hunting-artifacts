import { CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type ReactNode,
} from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { DesignCanvas } from "@/components/design-canvas";
import { ui } from "@/ui/assets";
import { Bouncy, Header, Img } from "@/ui/kit";

export type CameraStageHandle = { capture: () => Promise<string | null> };

/**
 * Màn "Săn cổ vật": camera thật (nếu có quyền, trên máy thật) hoặc ảnh mẫu từ Figma
 * (web / giả lập / chưa cấp quyền), khung ngắm 4 góc + nút chụp.
 */
export const CameraStage = forwardRef<
  CameraStageHandle,
  {
    fallback: "far" | "close";
    onShutter?: () => void;
    shutterDisabled?: boolean;
    children?: ReactNode;
    onBack?: () => void;
  }
>(function CameraStage(
  { fallback, onShutter, shutterDisabled, children, onBack },
  ref,
) {
  const [perm, request] = useCameraPermissions();
  const cam = useRef<CameraView>(null);
  const flash = useSharedValue(0);
  const live = Platform.OS !== "web" && !!perm?.granted;

  useEffect(() => {
    if (Platform.OS !== "web" && perm && !perm.granted && perm.canAskAgain)
      request();
  }, [perm, request]);

  useImperativeHandle(ref, () => ({
    capture: async () => {
      flash.value = withSequence(
        withTiming(1, { duration: 60 }),
        withTiming(0, { duration: 320 }),
      );
      if (!live || !cam.current) return null;
      try {
        const pic = await cam.current.takePictureAsync({
          quality: 0.6,
          skipProcessing: true,
        });
        return pic?.uri ?? null;
      } catch {
        return null;
      }
    },
  }));

  const flashStyle = useAnimatedStyle(() => ({ opacity: flash.value }));

  return (
    <DesignCanvas
      background={
        <View style={StyleSheet.absoluteFill}>
          {live ? (
            <CameraView
              ref={cam}
              style={StyleSheet.absoluteFill}
              facing="back"
            />
          ) : (
            <Image
              source={(fallback === "far" ? ui.photoFar : ui.photoClose).src}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={250}
            />
          )}
        </View>
      }
    >
      <Img a={ui.scanOverlay} />
      <Header
        title="Săn cổ vật"
        light
        titleColor="#FFFFFF"
        x={24}
        y={64}
        width={392}
        onBack={onBack}
      />
      <Bouncy
        label="Chụp ảnh"
        disabled={shutterDisabled}
        onPress={onShutter}
        style={{
          position: "absolute",
          left: 184,
          top: 844,
          width: 72,
          height: 72,
          opacity: shutterDisabled ? 0.6 : 1,
        }}
      >
        <Img a={ui.shutter} />
      </Bouncy>
      {children}
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: "#fff" },
          flashStyle,
        ]}
      />
    </DesignCanvas>
  );
});
