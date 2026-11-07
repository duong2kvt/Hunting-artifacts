import type { ReactNode } from "react";

/** Native: app chiếm toàn màn hình, không cần khung. (Bản web: device-frame.web.tsx) */
export function DeviceFrame({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
