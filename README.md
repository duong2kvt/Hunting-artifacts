# Truy Tìm Cổ Vật – D.A.S Major Project

Mobile app (iOS + Android) dựng từ Figma `D.A.S – Major Project`.

## Stack
- **Expo SDK 58 · React Native 0.88 (New Architecture) · React 19 · TypeScript**
- **Expo Router** – điều hướng theo file (`src/app`)
- **Reanimated 4** – toàn bộ motion (spring, layout animation) chạy trên UI thread
- **React Native Skia** – hiệu ứng ánh sáng (tia sáng xoay, cột sáng blur)
- **expo-image**, **expo-haptics**, **expo-font** (Young Display Bold + Inter)

## Chạy thử
```bash
npm install
npx expo start          # quét QR bằng app development build
npx expo run:ios        # hoặc run:android – cần dev build vì có Skia/Reanimated
npx expo start --web    # xem nhanh trên trình duyệt
```

## Cấu trúc
```
src/app/                 _layout (font, provider), index (Onboarding), home (placeholder Main)
src/features/onboarding  onboarding-flow (state machine), mascot-guide, artifact-reveal,
                         name-popup, avatar-picker, assets (asset + kịch bản thoại)
src/components           design-canvas (scale khung 440×956), typewriter-text,
                         paper-button, light-effects (Skia)
src/theme/tokens.ts      màu, font, text style, motion lấy từ Figma
assets/onboarding        asset xuất từ Figma @3x (nền @2x)
```

## Ghi chú
- Mọi toạ độ dùng hệ 440×956 của Figma; `DesignCanvas` scale vừa màn hình, nền phủ full-bleed.
- Hiệu ứng chữ của mascot (plugin Figma) được dựng lại trong `TypewriterText`: hiện từng từ,
  phần chưa hiện vẫn giữ layout bằng chữ trong suốt. Tốc độ: `motion.wordDelayMs` (90ms/từ).
- Font Young Display có ascent thấp hơn dấu tiếng Việt → luôn đặt `lineHeight` ≥ 1.4× cỡ chữ;
  ô nhập tên dùng Text đè lên TextInput để không mất dấu (Â, Ê, Ô).
