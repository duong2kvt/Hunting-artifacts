import {
  Blur,
  Canvas,
  Group,
  LinearGradient,
  Path,
  RadialGradient,
  Skia,
  vec,
} from "@shopify/react-native-skia";
import { useEffect, useMemo } from "react";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { colors } from "@/theme/tokens";

/**
 * Tia sáng toả quanh cổ vật (node "Light effect" 400×400 trong Figma: vector hình
 * nan quạt + radial gradient vàng → trong suốt, blend Linear Dodge).
 * Được vẽ bằng Skia để xoay liên tục 60/120fps trên UI thread.
 */
export function LightRays({
  size = 400,
  rays = 10,
  periodMs = 16000,
}: {
  size?: number;
  rays?: number;
  periodMs?: number;
}) {
  const c = size / 2;
  const path = useMemo(() => {
    const p = Skia.PathBuilder.Make();
    const half = (Math.PI / rays) * 0.42; // độ rộng mỗi nan
    for (let i = 0; i < rays; i++) {
      const a = (i / rays) * Math.PI * 2 - Math.PI / 2;
      p.moveTo(c, c);
      p.lineTo(c + Math.cos(a - half) * c, c + Math.sin(a - half) * c);
      p.lineTo(c + Math.cos(a + half) * c, c + Math.sin(a + half) * c);
      p.close();
    }
    return p.build();
  }, [c, rays]);

  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: periodMs, easing: Easing.linear }),
      -1,
      false,
    );
  }, [periodMs, t]);
  const transform = useDerivedValue(() => [{ rotate: t.value * Math.PI * 2 }]);

  return (
    <Canvas style={{ width: size, height: size }} pointerEvents="none">
      <Group origin={vec(c, c)} transform={transform} blendMode="plus">
        <Path path={path}>
          <RadialGradient
            c={vec(c, c)}
            r={c}
            colors={["#F5D451", "#F5D45100"]}
          />
        </Path>
      </Group>
    </Canvas>
  );
}

/**
 * Cột sáng chiếu từ trên xuống (node "Rectangle 4" 328×623: linear gradient
 * accent-400 → accent-600 trong suốt, opacity 40%, layer blur 75).
 */
export function LightBeam({
  width = 328,
  height = 623,
  blur = 75,
}: {
  width?: number;
  height?: number;
  blur?: number;
}) {
  const pad = blur * 1.2;
  const W = width + pad * 2;
  const H = height + pad * 2;
  const path = useMemo(() => {
    const p = Skia.PathBuilder.Make();
    const topInset = width * 0.32;
    const r = 28;
    p.moveTo(pad + topInset + r, pad);
    p.lineTo(pad + width - topInset - r, pad);
    p.quadTo(pad + width - topInset, pad, pad + width - topInset + 4, pad + r);
    p.lineTo(pad + width, pad + height - r);
    p.quadTo(pad + width, pad + height, pad + width - r, pad + height);
    p.lineTo(pad + r, pad + height);
    p.quadTo(pad, pad + height, pad, pad + height - r);
    p.lineTo(pad + topInset - 4, pad + r);
    p.quadTo(pad + topInset, pad, pad + topInset + r, pad);
    p.close();
    return p.build();
  }, [width, height, pad]);

  return (
    <Canvas
      style={{ width: W, height: H, marginLeft: -pad, marginTop: -pad }}
      pointerEvents="none"
    >
      <Group opacity={0.4} blendMode="plus">
        <Path path={path}>
          <LinearGradient
            start={vec(0, pad)}
            end={vec(0, pad + height)}
            colors={[colors.accent400, "#DDB92A00"]}
          />
          <Blur blur={blur / 2} />
        </Path>
      </Group>
    </Canvas>
  );
}
