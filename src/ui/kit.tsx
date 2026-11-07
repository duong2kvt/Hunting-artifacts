import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { router, usePathname } from "expo-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { DesignCanvas } from "@/components/design-canvas";
import { avatars, img as onboardingImg } from "@/features/onboarding/assets";
import { useProfile } from "@/state/profile";
import { colors, fonts } from "@/theme/tokens";

import { ui, type UiAsset } from "./assets";

export const tapHaptic = () => {
  if (Platform.OS !== "web") Haptics.selectionAsync();
};

/** Ảnh asset đặt tuyệt đối theo toạ độ Figma, kích thước lấy từ asset */
export function Img({
  a,
  x = 0,
  y = 0,
  scale = 1,
  style,
}: {
  a: UiAsset;
  x?: number;
  y?: number;
  scale?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Image
      source={a.src}
      style={[
        {
          position: "absolute",
          left: x,
          top: y,
          width: a.w * scale,
          height: a.h * scale,
        },
        style as object,
      ]}
      contentFit="fill"
    />
  );
}

/** Pressable nhún nhẹ (spring) – dùng cho mọi nút ảnh */
export function Bouncy({
  onPress,
  disabled,
  style,
  children,
  label,
}: {
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  label?: string;
}) {
  const s = useSharedValue(1);
  const st = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPressIn={() =>
        (s.value = withSpring(0.93, { damping: 20, stiffness: 400 }))
      }
      onPressOut={() =>
        (s.value = withSpring(1, { damping: 9, stiffness: 260 }))
      }
      onPress={() => {
        tapHaptic();
        onPress?.();
      }}
      style={style}
    >
      <Animated.View style={[{ flex: 1 }, st]}>{children}</Animated.View>
    </Pressable>
  );
}

/** Nút giấy có nhãn (ảnh nền + chữ Young Display) */
export function LabelButton({
  a,
  label,
  x,
  y,
  onPress,
  disabled,
  textStyle,
}: {
  a: UiAsset;
  label: string;
  x: number;
  y: number;
  onPress?: () => void;
  disabled?: boolean;
  textStyle?: StyleProp<TextStyle>;
}) {
  return (
    <Bouncy
      onPress={onPress}
      disabled={disabled}
      label={label}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: a.w,
        height: a.h,
        opacity: disabled ? 0.55 : 1,
      }}
    >
      <Image source={a.src} style={StyleSheet.absoluteFill} contentFit="fill" />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 5,
            paddingRight: 3,
          },
        ]}
      >
        <Text style={[t.btn, textStyle]}>{label}</Text>
      </View>
    </Bouncy>
  );
}

export function UserAvatar({
  size,
  style,
}: {
  size: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { avatar } = useProfile();
  return (
    <Image
      source={avatars[avatar ?? 2]}
      style={[{ width: size, height: size }, style as object]}
      contentFit="cover"
    />
  );
}

const TABS = [
  { key: "museum", label: "Bảo tàng", href: "/museum" },
  { key: "collection", label: "Cổ vật", href: "/collection" },
  { key: "hunt", label: "Săn ngay", href: "/hunt" },
  { key: "profile", label: "Hồ sơ", href: "/profile" },
] as const;
export type TabKey = (typeof TABS)[number]["key"];

/** Thanh điều hướng đáy (component "Navbar" trong Figma) */
export function NavBar({
  active,
  highlight,
  onTab,
}: {
  active?: TabKey;
  highlight?: TabKey;
  onTab?: (k: TabKey) => void;
}) {
  const path = usePathname();
  const cur =
    active ??
    (TABS.find((x) => path.startsWith(x.href))?.key as TabKey | undefined);
  return (
    <View style={styles.nav} pointerEvents="box-none">
      <Img a={ui.navGradient} x={0} y={-50} />
      {TABS.map((tab, i) => {
        const on = cur === tab.key;
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            accessibilityLabel={tab.label}
            onPress={() => {
              tapHaptic();
              if (onTab) return onTab(tab.key);
              if (!on) router.replace(tab.href);
            }}
            style={[styles.navItem, { left: 12 + i * 104 }]}
          >
            <NavIcon k={tab.key} on={on} pulse={highlight === tab.key} />
            <Text style={[styles.navLabel, on && { color: colors.accent500 }]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function NavIcon({ k, on, pulse }: { k: TabKey; on: boolean; pulse: boolean }) {
  const s = useSharedValue(1);
  useEffect(() => {
    s.value = withSpring(on ? 1.06 : 1, { damping: 10 });
  }, [on, s]);
  const st = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <Animated.View
      style={[
        { position: "absolute", left: 0, top: 0, width: 104, height: 68 },
        st,
      ]}
    >
      {pulse ? <PulseRing /> : null}
      {k === "museum" ? <Img a={ui.navMuseum} x={16} y={-16} /> : null}
      {k === "collection" ? <Img a={ui.navArtifact} x={22} y={-2} /> : null}
      {k === "hunt" ? <Img a={ui.navHunt} x={24} y={0} /> : null}
      {k === "profile" ? (
        <View
          style={{
            position: "absolute",
            left: 24,
            top: 0,
            width: 56,
            height: 56,
          }}
        >
          <Image
            source={onboardingImg.avatarFrame}
            style={{ position: "absolute", width: 57, height: 57 }}
          />
          <UserAvatar
            size={40}
            style={{ position: "absolute", left: 8.5, top: 8.5 }}
          />
        </View>
      ) : null}
    </Animated.View>
  );
}

function PulseRing() {
  return (
    <Animated.View
      entering={FadeIn}
      style={{
        position: "absolute",
        left: 14,
        top: -10,
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: "rgba(243,203,46,0.28)",
        borderWidth: 2,
        borderColor: colors.accent500,
      }}
    />
  );
}

/** Header: nút quay lại + tiêu đề (component "Navigation") */
export function Header({
  title,
  light,
  onBack,
  x = 27,
  y = 80,
  width = 354,
  titleColor,
}: {
  title: string;
  light?: boolean;
  onBack?: () => void;
  x?: number;
  y?: number;
  width?: number;
  titleColor?: string;
}) {
  return (
    <View style={{ position: "absolute", left: x, top: y, width, height: 40 }}>
      <Bouncy
        label="Quay lại"
        onPress={
          onBack ??
          (() =>
            router.canGoBack() ? router.back() : router.replace("/museum"))
        }
        style={{ position: "absolute", left: 0, top: 0, width: 79, height: 43 }}
      >
        <Image
          source={(light ? ui.backBtnLight : ui.backBtn).src}
          style={StyleSheet.absoluteFill}
        />
      </Bouncy>
      <Text
        style={[t.header, { color: titleColor ?? colors.neutral950 }]}
        numberOfLines={1}
      >
        {title}
      </Text>
    </View>
  );
}

/**
 * Khung trang chung: nền bàn gỗ + quyển sổ + gradient trên/dưới + navbar.
 * Nội dung đặt theo toạ độ Figma 440×956.
 */
export function BookPage({
  children,
  nav = true,
  book = true,
  overlay,
  navHighlight,
  onTab,
}: {
  children?: ReactNode;
  nav?: boolean;
  book?: boolean;
  overlay?: ReactNode;
  navHighlight?: TabKey;
  onTab?: (k: TabKey) => void;
}) {
  return (
    <DesignCanvas
      background={
        <View style={StyleSheet.absoluteFill}>
          <Image
            source={ui.deskBg.src}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
        </View>
      }
    >
      {book ? <Img a={ui.book} x={-12} y={54} /> : null}
      <Img a={ui.topGradient} x={0} y={0} />
      {children}
      {nav ? <NavBar highlight={navHighlight} onTab={onTab} /> : null}
      {overlay}
    </DesignCanvas>
  );
}

/** Giấy trắng (note) + huy hiệu mặt trời ở góc */
export function PaperNote({
  half,
  x = 27,
  y = 148,
  badge = true,
}: {
  half?: boolean;
  x?: number;
  y?: number;
  badge?: boolean;
}) {
  return (
    <>
      <Img a={half ? ui.noteHalf : ui.noteFull} x={x} y={y} />
      {badge ? <Img a={ui.badge} x={x + 320} y={y - 17} /> : null}
    </>
  );
}

export function Pagination({
  page,
  total,
  onChange,
  x = 44,
  y = 718,
  width = 320,
}: {
  page: number;
  total: number;
  onChange: (p: number) => void;
  x?: number;
  y?: number;
  width?: number;
}) {
  return (
    <View style={{ position: "absolute", left: x, top: y, width, height: 43 }}>
      {page > 0 ? (
        <Bouncy
          label="Trang trước"
          onPress={() => onChange(page - 1)}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 79,
            height: 43,
          }}
        >
          <Image
            source={ui.pagNext.src}
            style={[StyleSheet.absoluteFill, { transform: [{ scaleX: -1 }] }]}
          />
        </Bouncy>
      ) : null}
      <Text
        style={[t.pag, { position: "absolute", left: 76, right: 76, top: 8 }]}
      >
        {page + 1}/{total}
      </Text>
      {page < total - 1 ? (
        <Bouncy
          label="Trang sau"
          onPress={() => onChange(page + 1)}
          style={{
            position: "absolute",
            right: -3,
            top: 0,
            width: 79,
            height: 43,
          }}
        >
          <Image source={ui.pagNext.src} style={StyleSheet.absoluteFill} />
        </Bouncy>
      ) : null}
    </View>
  );
}

/** Lớp tối phủ toàn màn hình */
export function Dimmer({
  opacity = 0.8,
  onPress,
}: {
  opacity?: number;
  onPress?: () => void;
}) {
  return (
    <Animated.View
      entering={FadeIn.duration(220)}
      exiting={FadeOut.duration(200)}
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: `rgba(0,0,0,${opacity})` },
      ]}
    >
      {onPress ? (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onPress}
          accessibilityLabel="Đóng"
        />
      ) : null}
    </Animated.View>
  );
}

/** Thông báo ngắn kiểu giấy dán */
export function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    if (!msg) return;
    const id = setTimeout(() => setMsg(null), 2200);
    return () => clearTimeout(id);
  }, [msg]);
  const node = msg ? (
    <Animated.View
      key={msg}
      entering={FadeInDown.springify().damping(14)}
      exiting={FadeOutDown}
      style={styles.toast}
      pointerEvents="none"
    >
      <Text style={styles.toastText}>{msg}</Text>
    </Animated.View>
  ) : null;
  return [node, setMsg] as const;
}

export const t = StyleSheet.create({
  btn: {
    fontFamily: fonts.display,
    fontSize: 18,
    lineHeight: 26,
    color: colors.neutral950,
    letterSpacing: -0.5,
  },
  header: {
    position: "absolute",
    left: 80,
    right: 80,
    top: 7,
    textAlign: "center",
    fontFamily: fonts.display,
    fontSize: 18,
    lineHeight: 26,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 32,
    color: colors.neutral950,
    textAlign: "center",
  },
  pag: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    lineHeight: 24,
    color: colors.neutral950,
    textAlign: "center",
  },
  h16: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    lineHeight: 24,
    color: colors.chatText,
  },
  body14: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: "#664932",
  },
  body16: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    lineHeight: 24,
    color: "#664932",
  },
  italic14: {
    fontFamily: "Inter_500Medium_Italic",
    fontSize: 14,
    lineHeight: 20,
    color: colors.chatText,
  },
  italic16: {
    fontFamily: "Inter_500Medium_Italic",
    fontSize: 16,
    lineHeight: 24,
    color: colors.chatText,
  },
});

const styles = StyleSheet.create({
  nav: { position: "absolute", left: 0, top: 827, width: 440, height: 129 },
  navItem: { position: "absolute", top: 16, width: 104, height: 90 },
  navLabel: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 63,
    textAlign: "center",
    fontFamily: fonts.display,
    fontSize: 18,
    lineHeight: 26,
    color: "#FEFAEA",
  },
  toast: {
    position: "absolute",
    left: 40,
    right: 40,
    top: 740,
    backgroundColor: colors.neutral50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral500,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: colors.neutral800,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  toastText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    lineHeight: 22,
    color: colors.chatText,
    textAlign: "center",
  },
});
