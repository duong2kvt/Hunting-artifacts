/* Asset xuất từ Figma ở @3x (nền @2x). Kích thước pt = px / 3. */
export const img = {
  bgSplash: require("@/assets/onboarding/bg_splash.jpg"),
  bgMuseum: require("@/assets/onboarding/bg_museum.jpg"),
  btnStart: require("@/assets/onboarding/btn_start_bg.png"),
  btnPrimary: require("@/assets/onboarding/btn_primary_bg.png"),
  btnSkip: require("@/assets/onboarding/btn_skip.png"),
  chatPanel: require("@/assets/onboarding/chat_panel.png"),
  artifactSheet: require("@/assets/onboarding/artifact_sheet.png"),
  popupNameOuter: require("@/assets/onboarding/popup_name_outer.png"),
  popupNameInner: require("@/assets/onboarding/popup_name_inner.png"),
  ribbonName: require("@/assets/onboarding/ribbon_name.png"),
  popupAvatarOuter: require("@/assets/onboarding/popup_avatar_outer.png"),
  popupAvatarInner: require("@/assets/onboarding/popup_avatar_inner.png"),
  ribbonAvatar: require("@/assets/onboarding/ribbon_avatar.png"),
  avatarBigFrame: require("@/assets/onboarding/avatar_big_frame.png"),
  avatarBigInner: require("@/assets/onboarding/avatar_big_inner.png"),
  avatarFrame: require("@/assets/onboarding/avatar_frame.png"),
  avatarFrameInner: require("@/assets/onboarding/avatar_frame_inner.png"),
  avatarFrameSelected: require("@/assets/onboarding/avatar_frame_selected.png"),
  avatarCheck: require("@/assets/onboarding/avatar_check.png"),
} as const;

export const mascot = {
  welcome: require("@/assets/onboarding/mascot_welcome.png"),
  think: require("@/assets/onboarding/mascot_think.png"),
  point: require("@/assets/onboarding/mascot_point.png"),
  happy: require("@/assets/onboarding/mascot_happy.png"),
} as const;
export type MascotPose = keyof typeof mascot;

export const avatars = [
  require("@/assets/onboarding/avatar_1.png"),
  require("@/assets/onboarding/avatar_2.png"),
  require("@/assets/onboarding/avatar_3.png"),
  require("@/assets/onboarding/avatar_4.png"),
  require("@/assets/onboarding/avatar_5.png"),
  require("@/assets/onboarding/avatar_6.png"),
  require("@/assets/onboarding/avatar_7.png"),
  require("@/assets/onboarding/avatar_8.png"),
  require("@/assets/onboarding/avatar_9.png"),
] as const;

/** Kịch bản hội thoại – nội dung lấy từ layer text-animation trong Figma (Scene 1 → 6) */
export const SCRIPT: { text: string; pose: MascotPose; artifact?: boolean }[] =
  [
    {
      text: "Chào Bạn. Tôi là nhà khảo cổ học và là người đồng hành với Bạn trong hành trình này.",
      pose: "welcome",
    },
    { text: "Bạn có bao giờ tự hỏi...", pose: "think" },
    {
      text: "Những cổ vật trong bảo tàng đã chứng kiến điều gì suốt hàng trăm năm qua chưa?",
      pose: "think",
      artifact: true,
    },
    {
      text: "Vẫn còn rất nhiều cổ vật mà ít người từng chú ý tới. Tôi đang tìm người cùng mình khám phá chúng.",
      pose: "point",
      artifact: true,
    },
    { text: "Và... Bạn chính là người đó!!!", pose: "happy" },
    { text: "Trước khi bắt đầu... Tôi nên gọi bạn là gì nhỉ?", pose: "happy" },
  ];
