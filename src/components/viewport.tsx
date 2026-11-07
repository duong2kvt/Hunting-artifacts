import { createContext, useContext } from "react";
import { useWindowDimensions } from "react-native";

export const ViewportContext = createContext<{ width: number; height: number } | null>(null);

/** Kích thước vùng hiển thị app: cả màn hình, hoặc khung máy giả lập khi demo trên web desktop */
export function useViewport() {
  const win = useWindowDimensions();
  return useContext(ViewportContext) ?? win;
}
