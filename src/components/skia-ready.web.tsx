import { LoadSkiaWeb } from "@shopify/react-native-skia/lib/module/web";
import { useEffect, useState, type ReactNode } from "react";

/** Web: nạp CanvasKit (public/canvaskit.wasm) trước khi render các component Skia */
export function SkiaReady({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const baseUrl = process.env.EXPO_BASE_URL ?? "";
    LoadSkiaWeb({ locateFile: (file: string) => `${baseUrl}/${file}` }).then(() =>
      setReady(true),
    );
  }, []);
  return ready ? <>{children}</> : null;
}
