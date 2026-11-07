/**
 * Design tokens lấy từ Figma "D.A.S – Major Project" (Foundation styles).
 * Canvas thiết kế: 440 × 956 (iPhone Pro Max). Mọi toạ độ trong app dùng hệ đơn vị này,
 * <DesignCanvas> sẽ scale về kích thước máy thật.
 */
export const DESIGN = { width: 440, height: 956 } as const;

export const colors = {
  neutral50: "#F4F0ED",
  neutral100: "#DCD0C6",
  neutral300: "#B49984",
  neutral400: "#A5856C",
  neutral500: "#8F6747",
  neutral800: "#4F3927",
  neutral950: "#291D14",
  chatText: "#3C2B1E",
  inputText: "#41392D",
  paper: "#FBFAF9",
  accent200: "#F9E79F",
  accent400: "#F5D558",
  accent500: "#F3CB2E",
  accent600: "#DDB92A",
  accent700: "#AD9021",
  red500: "#C33A2E",
  red600: "#B1352A",
  red700: "#8A2921",
  lightBrown100: "#EDDACC",
  lightBrown200: "#E4C8B3",
  scrim: "rgba(0,0,0,0.6)",
} as const;

export const fonts = {
  /** Young Display Bold – dùng cho toàn bộ text hiển thị / hội thoại mascot */
  display: "YoungDisplay-Bold",
  inter: "Inter_400Regular",
  interSemi: "Inter_600SemiBold",
} as const;

/** Text styles khớp với Figma text styles */
export const type = {
  chat: {
    fontFamily: fonts.display,
    fontSize: 20,
    lineHeight: 28,
    color: colors.chatText,
  },
  button: {
    fontFamily: fonts.display,
    fontSize: 18,
    lineHeight: 26,
    letterSpacing: -0.54,
    color: colors.neutral950,
  },
  buttonXL: {
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 44,
    letterSpacing: -0.96,
    color: colors.neutral950,
  },
  input: {
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 34,
    letterSpacing: -0.72,
    color: colors.inputText,
  },
} as const;

/**
 * Lưu ý: font Young Display có ascent (720) thấp hơn dấu mũ/dấu hỏi tiếng Việt (~866),
 * nên mọi text phải đặt lineHeight ≥ 1.4× fontSize để dấu không bị cắt.
 */

/** Thời gian / spring dùng thống nhất cho motion */
export const motion = {
  wordDelayMs: 90,
  spring: { damping: 14, stiffness: 180, mass: 0.9 },
  springSoft: { damping: 18, stiffness: 120 },
} as const;
