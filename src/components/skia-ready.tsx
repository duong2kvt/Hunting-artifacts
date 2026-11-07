import type { ReactNode } from "react";

/** Native: Skia có sẵn, không cần chờ. (Bản web nằm ở skia-ready.web.tsx) */
export function SkiaReady({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
