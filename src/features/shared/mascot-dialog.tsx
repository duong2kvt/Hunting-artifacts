import { useState, type ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { MascotGuide } from "@/features/onboarding/mascot-guide";
import type { MascotPose } from "@/features/onboarding/assets";
import { Dimmer, tapHaptic } from "@/ui/kit";

export type DialogLine = { text: string; pose: MascotPose; extra?: ReactNode };

/**
 * Hội thoại Giáo sư Zũ dạng overlay: nền tối + mascot + khung chat typewriter.
 * Chạm 1 lần: hiện hết câu; chạm lần nữa: sang câu tiếp; hết câu → onDone.
 */
export function MascotDialog({
  lines,
  onDone,
  onLine,
  dim = 0.8,
}: {
  lines: DialogLine[];
  onDone: () => void;
  onLine?: (i: number) => void;
  dim?: number;
}) {
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState(false);
  const line = lines[i];

  const tap = () => {
    if (!typed) return setTyped(true);
    tapHaptic();
    if (i < lines.length - 1) {
      setI(i + 1);
      setTyped(false);
      onLine?.(i + 1);
    } else onDone();
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      <Dimmer opacity={dim} />
      {line.extra}
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={tap}
        accessibilityLabel="Chạm để tiếp tục"
      />
      <MascotGuide
        pose={line.pose}
        text={line.text}
        lineKey={i}
        instant={typed}
        onTyped={() => setTyped(true)}
      />
    </View>
  );
}
