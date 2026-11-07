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

## Luồng màn hình
Onboarding → Tutorial (hướng dẫn + vé quà tặng) → 4 tab: **Bảo tàng** (danh sách, bản đồ vùng miền, thông tin / lịch sử / cổ vật / kiến trúc) · **Cổ vật** (bộ sưu tập tem, chi tiết, bưu thiếp) · **Săn ngay** (camera → scan → phần thưởng) · **Hồ sơ** (thành tựu, huy hiệu, vé QR).

- Tiến trình người chơi lưu bằng AsyncStorage (`src/state/profile.tsx`).
- Nội dung demo nằm ở `src/data/content.ts`.
- Nhận diện cổ vật đang là bản mô phỏng: `src/features/hunt/recognize.ts` (lần 1 báo sai góc, lần 2 thành công) – thay bằng model/API thật.
- Web desktop: app hiển thị trong khung điện thoại (`src/components/device-frame.web.tsx`); web trên điện thoại vẫn full màn hình.

## Deploy bản web demo
```bash
npx expo export -p web     # xuất ra thư mục dist/
```
Upload `dist/` lên host tĩnh (Vercel/Netlify…). Vì là SPA, cấu hình rewrite mọi đường dẫn về `/index.html`.

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
