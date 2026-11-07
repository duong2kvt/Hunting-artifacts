import { useEffect, useMemo, useRef, useState } from "react";
import { Text, type StyleProp, type TextStyle } from "react-native";

import { motion, type as typeStyles } from "@/theme/tokens";

type Props = {
  text: string;
  /** true → hiện toàn bộ ngay lập tức (người dùng chạm để bỏ qua hiệu ứng) */
  instant?: boolean;
  /** ms giữa mỗi từ; mặc định lấy từ tokens */
  wordDelay?: number;
  startDelay?: number;
  onDone?: () => void;
  style?: StyleProp<TextStyle>;
};

/**
 * Tái hiện plugin "text animation" trong Figma: câu được tách theo từ, các từ chưa
 * hiện vẫn được render với màu trong suốt để giữ nguyên layout/xuống dòng
 * (y hệt cách plugin dựng các stage Letter 1…N). Mỗi nhịp hiện thêm một từ.
 */
export function TypewriterText({
  text,
  instant,
  wordDelay = motion.wordDelayMs,
  startDelay = 0,
  onDone,
  style,
}: Props) {
  const tokens = useMemo(() => text.match(/\S+\s*/g) ?? [], [text]);
  const [count, setCount] = useState(0);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  // reset khi đổi câu
  useEffect(() => {
    setCount(0);
    doneRef.current = false;
  }, [text]);

  useEffect(() => {
    if (instant) {
      setCount(tokens.length);
      return;
    }
    let interval: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        setCount((c) => {
          if (c >= tokens.length) {
            if (interval) clearInterval(interval);
            return c;
          }
          return c + 1;
        });
      }, wordDelay);
    }, startDelay);
    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [tokens, instant, wordDelay, startDelay]);

  useEffect(() => {
    if (count >= tokens.length && tokens.length > 0 && !doneRef.current) {
      doneRef.current = true;
      onDoneRef.current?.();
    }
  }, [count, tokens.length]);

  const shown = tokens.slice(0, count).join("");
  const hidden = tokens.slice(count).join("");

  return (
    <Text style={[typeStyles.chat, style]} accessibilityLabel={text}>
      {shown}
      <Text style={{ color: "transparent" }}>{hidden}</Text>
    </Text>
  );
}
